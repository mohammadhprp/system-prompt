import { resolve } from 'node:path';

import { categories } from '../catalog.js';
import { install } from '../install/index.js';
import { loadLockFile, lockToSelections } from '../install/lock.js';
import { defaultUi } from './clack-ui.js';
import {
  buildSummary,
  computeDiff,
  fileList,
  formatDiff,
  generatedFiles,
  initialItemValues,
  shouldPreselectAll,
} from './plan.js';
import { collectTuiPreferences, readTuiPreferences } from './tui-preferences.js';

function cancelled(ui) {
  ui.outro('Cancelled.');
  return { status: 'cancelled' };
}

function reportPlan({ ui, oldLock, selections, includeAgentsMd }) {
  if (oldLock) {
    const diffText = formatDiff(computeDiff(oldLock, selections));
    ui.note(diffText || 'No changes — same selections as before.', 'Changes from previous installation');
  } else {
    ui.note(buildSummary(selections), 'What will be installed');
  }
  ui.note(fileList(generatedFiles(selections, includeAgentsMd)), 'Generated files');
}

async function collectSelections({ ui, selectedCategories, existingSelections }) {
  const selections = {};
  for (const cat of selectedCategories) {
    const catConfig = categories[cat];
    const visibleItems = catConfig.items.filter(item => !item.removed);
    const existingIds = initialItemValues(visibleItems, existingSelections[cat] || []);

    const all = await ui.confirm({
      message: `Install all ${catConfig.title.toLowerCase()}?`,
      initialValue: shouldPreselectAll(visibleItems, existingIds),
    });
    if (ui.isCancel(all)) return null;

    if (all) {
      selections[cat] = visibleItems.map(item => item.id);
      continue;
    }

    const picked = await ui.multiselect({
      message: `Which ${catConfig.title.toLowerCase()} do you want?`,
      options: visibleItems.map(item => ({
        value: item.id,
        label: item.deprecated ? `${item.name} (deprecated)` : item.name,
        hint: item.deprecated ? '⚠  Deprecated — consider alternatives' : item.description,
      })),
      initialValues: existingIds,
      required: true,
    });
    if (ui.isCancel(picked)) return null;
    selections[cat] = picked;
  }
  return selections;
}

async function installGeneratedFiles({ ui, targetDir, agentType, force, dryRun, oldLock, existingSelections, existingTuiPreferences }) {
  const includeAgentsMd = await ui.confirm({
    message: 'Generate AGENTS.md?',
    initialValue: oldLock ? oldLock.includeAgentsMd : true,
  });
  if (ui.isCancel(includeAgentsMd)) return cancelled(ui);

  const hasExisting = Object.keys(existingSelections).length > 0;
  let keepExisting = false;
  if (hasExisting) {
    const removeAll = await ui.confirm({
      message: 'Remove all previously installed components?',
      initialValue: false,
    });
    if (ui.isCancel(removeAll)) return cancelled(ui);
    keepExisting = !removeAll;
  }

  const progress = ui.spinner();
  progress.start('Writing files...');
  await install({
    targetDir,
    agentType,
    selections: keepExisting ? existingSelections : {},
    includeAgentsMd,
    oldSelections: hasExisting ? existingSelections : undefined,
    oldLock,
    tuiPreferences: existingTuiPreferences,
    force,
    dryRun,
  });
  progress.stop('Done.');

  ui.outro(includeAgentsMd ? 'AGENTS.md and configuration written.' : 'Configuration written.');
  return { status: 'installed' };
}

async function installSelectedItems({ ui, targetDir, agentType, force, dryRun, oldLock, existingSelections, existingTuiPreferences }, selectedCategories) {
  const includeAgentsMd = await ui.confirm({
    message: 'Generate AGENTS.md?',
    initialValue: oldLock ? oldLock.includeAgentsMd : true,
  });
  if (ui.isCancel(includeAgentsMd)) return cancelled(ui);

  const selections = await collectSelections({ ui, selectedCategories, existingSelections });
  if (!selections) return cancelled(ui);

  let tuiPreferences = existingTuiPreferences;
  const customizeTui = await ui.confirm({
    message: 'Customize OpenCode TUI settings?',
    initialValue: false,
  });
  if (ui.isCancel(customizeTui)) return cancelled(ui);
  if (customizeTui) {
    const custom = await collectTuiPreferences(existingTuiPreferences, ui);
    if (!custom) return cancelled(ui);
    tuiPreferences = custom;
  }

  if (oldLock) {
    const initialDiff = computeDiff(oldLock, selections);
    if (Object.keys(initialDiff.removed).length) {
      const removeDeselected = await ui.confirm({
        message: 'Remove deselected items from the previous installation?',
        initialValue: false,
      });
      if (ui.isCancel(removeDeselected)) return cancelled(ui);
      if (!removeDeselected) {
        for (const [cat, data] of Object.entries(initialDiff.removed)) {
          selections[cat] = [...new Set([...(selections[cat] || []), ...data.ids])];
        }
      }
    }
  }

  reportPlan({ ui, oldLock, selections, includeAgentsMd });

  const confirmed = await ui.confirm({
    message: 'Proceed with installation?',
    initialValue: true,
  });
  if (ui.isCancel(confirmed) || !confirmed) {
    ui.outro('Installation cancelled.');
    return { status: 'cancelled' };
  }

  const progress = ui.spinner();
  progress.start(oldLock ? 'Updating files...' : 'Installing files...');

  const finalTarget = await install({
    targetDir,
    agentType,
    selections,
    includeAgentsMd,
    oldSelections: oldLock ? existingSelections : undefined,
    oldLock,
    tuiPreferences,
    force,
    dryRun,
  });

  progress.stop('Installation complete!');

  const fileCount = Object.values(selections).reduce((sum, ids) => sum + (ids?.length || 0), 0);
  const verb = oldLock ? 'Updated' : 'Installed';
  ui.note(
    [
      agentType === 'opencode'
        ? 'Open your project in OpenCode — it reads opencode.json and AGENTS.md automatically.'
        : 'Point your AI coding agent to AGENTS.md as the entry point.',
      'Run /help in your agent to see available commands.',
    ].join('\n'),
    'Next steps',
  );
  ui.outro(`${verb} ${fileCount} components to ${finalTarget}`);
  return { status: 'installed', target: finalTarget };
}

export async function runInteractive({ targetDir, force = false, dryRun = false, agentType = 'opencode', ui = defaultUi }) {
  const absTarget = resolve(process.cwd(), targetDir);
  const oldLock = await loadLockFile(absTarget);
  const existingSelections = lockToSelections(oldLock);
  const existingTuiPreferences = await readTuiPreferences(absTarget);
  const context = { ui, targetDir, agentType, force, dryRun, oldLock, existingSelections, existingTuiPreferences };

  const selectedCategories = await ui.multiselect({
    message: 'What would you like to install?',
    options: buildCategoryOptions(),
    initialValues: Object.keys(existingSelections),
    required: false,
  });
  if (ui.isCancel(selectedCategories)) return cancelled(ui);

  if (!selectedCategories?.length) return installGeneratedFiles(context);
  return installSelectedItems(context, selectedCategories);
}

function buildCategoryOptions() {
  return Object.entries(categories).map(([key, cat]) => {
    const visible = cat.items.filter(item => !item.removed);
    return {
      value: key,
      label: cat.title,
      hint: `${visible.length} ${key === 'mcps' ? 'MCPs' : cat.title.toLowerCase()}`,
    };
  });
}
