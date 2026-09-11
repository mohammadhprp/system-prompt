import { intro, outro, confirm, multiselect, spinner, select, isCancel } from '@clack/prompts';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { categories } from './catalog.js';
import { getPackageVersion, install, loadLockFile, lockToSelections } from './installer.js';
import { doctor } from './doctor.js';
import { normalizeTuiPreferences, tuiPreferencesFromConfig, TUI_THEMES } from './agent-configs.js';

const CATEGORY_FLAGS = new Set(Object.keys(categories));

const defaultUi = {
  intro,
  outro,
  confirm,
  multiselect,
  spinner,
  select,
  isCancel,
  log: (...args) => console.log(...args),
};

export function parseArgs(argv) {
  const options = {
    targetDir: '.opencode',
    selections: {},
    all: false,
    dryRun: false,
    force: false,
    doctor: false,
    includeAgentsMd: true,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--all') options.all = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--doctor') options.doctor = true;
    else if (arg === '--no-agents-md') options.includeAgentsMd = false;
    else if (arg === '--target') {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error('Missing value for --target');
      options.targetDir = value;
    }
    else if (arg.startsWith('--target=')) {
      const value = arg.slice('--target='.length);
      if (!value) throw new Error('Missing value for --target');
      options.targetDir = value;
    }
    else if (arg.startsWith('--')) {
      const [flag, inlineValue] = arg.slice(2).split('=', 2);
      if (!CATEGORY_FLAGS.has(flag)) throw new Error(`Unknown option: ${arg}`);
      const value = inlineValue ?? argv[++index];
      if (!value) throw new Error(`Missing value for --${flag}`);
      options.selections[flag] = value.split(',').filter(Boolean);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  options.nonInteractive = options.all || Object.keys(options.selections).length > 0;
  return options;
}

export function allSelections() {
  return Object.fromEntries(Object.entries(categories).map(([category, config]) => [
    category,
    config.items.filter(item => !item.removed).map(item => item.id),
  ]));
}

function itemNames(config, ids) {
  return ids.map(id => config?.items?.find(item => item.id === id)?.name || id);
}

function buildSummary(selections) {
  const lines = [];
  for (const [cat, ids] of Object.entries(selections)) {
    if (!ids?.length) continue;
    const catConfig = categories[cat];
    lines.push(`  ${catConfig?.title || cat}: ${itemNames(catConfig, ids).join(', ')}`);
  }
  return lines.join('\n');
}

export function computeDiff(oldLock, selections) {
  const oldSels = lockToSelections(oldLock);
  const added = {};
  const removed = {};
  const kept = {};

  const allCats = [...new Set([...Object.keys(oldSels), ...Object.keys(selections)])];

  for (const cat of allCats) {
    const catConfig = categories[cat] || null;
    const oldIds = new Set(oldSels[cat] || []);
    const newIds = new Set(selections[cat] || []);

    const addedIds = [...newIds].filter(id => !oldIds.has(id));
    const removedIds = [...oldIds].filter(id => !newIds.has(id));
    const keptIds = [...newIds].filter(id => oldIds.has(id));

    if (addedIds.length) added[cat] = { config: catConfig, ids: addedIds };
    if (removedIds.length) removed[cat] = { config: catConfig, ids: removedIds };
    if (keptIds.length) kept[cat] = { config: catConfig, ids: keptIds };
  }

  return { added, removed, kept };
}

export function formatDiff(diff) {
  const sections = [
    ['+ Added', diff.added],
    ['- Removed', diff.removed],
    ['~ Unchanged', diff.kept],
  ];
  const lines = [];

  for (const [label, group] of sections) {
    const entries = Object.entries(group);
    if (!entries.length) continue;
    if (lines.length) lines.push('');
    lines.push(`  ${label}:`);
    for (const [cat, data] of entries) {
      lines.push(`    ${data.config?.title || cat}: ${itemNames(data.config, data.ids).join(', ')}`);
    }
  }

  return lines.join('\n');
}

export function initialItemValues(visibleItems, existingIds = []) {
  const visible = new Set(visibleItems.map(item => item.id));
  return existingIds.filter(id => visible.has(id));
}

export function shouldPreselectAll(visibleItems, existingIds = []) {
  if (existingIds.length) return existingIds.length === visibleItems.length;
  return visibleItems.length <= 12;
}

async function readTuiPreferences(absTarget) {
  try {
    return tuiPreferencesFromConfig(JSON.parse(await readFile(resolve(absTarget, 'tui.json'), 'utf-8')));
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) return {};
    throw error;
  }
}

async function collectTuiPreferences(existing, ui) {
  const base = normalizeTuiPreferences(existing);

  const theme = await ui.select({
    message: 'TUI theme',
    options: TUI_THEMES.map(value => ({
      value,
      label: value,
      hint: value === 'system' ? 'Adapts to your terminal' : undefined,
    })),
    initialValue: base.theme,
  });
  if (ui.isCancel(theme)) return null;

  const diffStyle = await ui.select({
    message: 'Diff style',
    options: [
      { value: 'auto', label: 'auto', hint: 'Adapts to terminal width' },
      { value: 'stacked', label: 'stacked', hint: 'Always single column' },
    ],
    initialValue: base.diff_style,
  });
  if (ui.isCancel(diffStyle)) return null;

  const cursorStyle = await ui.select({
    message: 'Cursor style',
    options: ['block', 'underline', 'line', 'default'].map(value => ({ value, label: value })),
    initialValue: base.cursor.style,
  });
  if (ui.isCancel(cursorStyle)) return null;

  const scrollSpeed = await ui.select({
    message: 'Scroll speed',
    options: [
      { value: 1, label: '1', hint: 'Slow' },
      { value: 2, label: '2' },
      { value: 3, label: '3', hint: 'Default' },
      { value: 4, label: '4' },
      { value: 5, label: '5', hint: 'Fast' },
    ],
    initialValue: base.scroll_speed,
  });
  if (ui.isCancel(scrollSpeed)) return null;

  const scrollAcceleration = await ui.confirm({
    message: 'Enable scroll acceleration?',
    initialValue: base.scroll_acceleration,
  });
  if (ui.isCancel(scrollAcceleration)) return null;

  const mouse = await ui.confirm({
    message: 'Enable mouse support?',
    initialValue: base.mouse,
  });
  if (ui.isCancel(mouse)) return null;

  const attentionEnabled = await ui.confirm({
    message: 'Enable attention notifications and sounds?',
    initialValue: base.attention.enabled,
  });
  if (ui.isCancel(attentionEnabled)) return null;

  const attention = { ...base.attention, enabled: attentionEnabled };
  if (attentionEnabled) {
    const notifications = await ui.confirm({
      message: 'Desktop notifications?',
      initialValue: base.attention.notifications,
    });
    if (ui.isCancel(notifications)) return null;

    const sound = await ui.confirm({
      message: 'Sound alerts?',
      initialValue: base.attention.sound,
    });
    if (ui.isCancel(sound)) return null;

    const volume = await ui.select({
      message: 'Alert volume',
      options: [
        { value: 0.2, label: '20%' },
        { value: 0.4, label: '40%', hint: 'Default' },
        { value: 0.6, label: '60%' },
        { value: 0.8, label: '80%' },
        { value: 1, label: '100%' },
      ],
      initialValue: base.attention.volume,
    });
    if (ui.isCancel(volume)) return null;

    attention.notifications = notifications;
    attention.sound = sound;
    attention.volume = volume;
  }

  return normalizeTuiPreferences({
    theme,
    diff_style: diffStyle,
    cursor: { style: cursorStyle, blinking: base.cursor.blinking },
    scroll_speed: scrollSpeed,
    scroll_acceleration: scrollAcceleration,
    mouse,
    attention,
  });
}

function cancelled(ui) {
  ui.outro('Cancelled.');
  return { status: 'cancelled' };
}

export function buildCategoryOptions() {
  return Object.entries(categories).map(([key, cat]) => {
    const visible = cat.items.filter(item => !item.removed);
    return {
      value: key,
      label: cat.title,
      hint: `${visible.length} ${key === 'mcps' ? 'MCPs' : cat.title.toLowerCase()}`,
    };
  });
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

  const installed = includeAgentsMd ? ['AGENTS.md'] : [];
  ui.outro(`${installed.join(' and ')} written. Open them in your project to get started.`);
  return { status: 'installed' };
}

function reportPlan({ ui, oldLock, selections, includeAgentsMd }) {
  if (oldLock) {
    const diffText = formatDiff(computeDiff(oldLock, selections));
    ui.log('\n📦 Changes from previous installation:\n');
    if (diffText) {
      ui.log(diffText);
      ui.log();
    } else {
      ui.log('  No changes — same selections as before.\n');
    }

    const generatedFiles = [];
    if (includeAgentsMd) generatedFiles.push('AGENTS.md');
    generatedFiles.push('opencode.json', 'tui.json', '.gitignore');
    if (selections.mcps?.length) generatedFiles.push('.env');
    if (selections.memory?.length) generatedFiles.push('memory/');

    if (generatedFiles.length) {
      ui.log('  Generated files:');
      for (const file of generatedFiles) ui.log(`    📄 ${file}`);
      ui.log();
    }
    return;
  }

  ui.log('\n📦 Summary of what will be installed:\n');
  if (includeAgentsMd) ui.log('  📄 AGENTS.md');
  ui.log('  📄 opencode.json');
  ui.log('  📄 tui.json');
  ui.log('  📄 .gitignore');
  ui.log(buildSummary(selections));
  ui.log();
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
  ui.outro(`${verb} ${fileCount} components to ${finalTarget}

Next steps:
  ${agentType === 'opencode' ? '- Open your project in OpenCode — it will read opencode.json and AGENTS.md automatically' : '- Point your AI coding agent to AGENTS.md as the entry point'}
  - Run /help in your agent to see available commands
`);
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

export async function runNonInteractive({ targetDir, selections, all, includeAgentsMd, force = false, dryRun = false, agentType = 'opencode', ui = defaultUi }) {
  const resolvedSelections = all ? allSelections() : selections;
  const absTarget = resolve(process.cwd(), targetDir);
  const oldLock = await loadLockFile(absTarget);
  if (!dryRun) ui.log(`Installing selected components into ${absTarget}`);
  await install({
    targetDir,
    agentType,
    selections: resolvedSelections,
    includeAgentsMd,
    oldSelections: oldLock ? lockToSelections(oldLock) : undefined,
    oldLock,
    force,
    dryRun,
  });
  ui.log(dryRun ? 'Dry run complete.' : 'Installation complete.');
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.doctor) {
    const healthy = await doctor(args.targetDir);
    if (!healthy) process.exitCode = 1;
    return healthy;
  }

  const version = await getPackageVersion();
  defaultUi.intro(`System prompt (v${version})`);

  const agentType = 'opencode';

  if (args.nonInteractive) {
    return runNonInteractive({ ...args, agentType });
  }
  return runInteractive({ ...args, agentType });
}
