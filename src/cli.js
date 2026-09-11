import { intro, outro, confirm, multiselect, spinner, select, isCancel } from '@clack/prompts';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { categories } from './catalog.js';
import { getPackageVersion, install, loadLockFile, lockToSelections } from './installer.js';
import { doctor } from './doctor.js';
import { normalizeTuiPreferences, tuiPreferencesFromConfig, TUI_THEMES } from './agent-configs.js';

const CATEGORY_FLAGS = new Set(Object.keys(categories));

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

function allSelections() {
  return Object.fromEntries(Object.entries(categories).map(([category, config]) => [
    category,
    config.items.filter(item => !item.removed).map(item => item.id),
  ]));
}

function buildSummary(selections) {
  const lines = [];
  for (const [cat, ids] of Object.entries(selections)) {
    if (!ids?.length) continue;
    const catConfig = categories[cat];
    const label = catConfig?.title || cat;
    const names = ids.map(id => {
      const item = catConfig?.items.find(i => i.id === id);
      return item ? item.name : id;
    });
    lines.push(`  ${label}: ${names.join(', ')}`);
  }
  return lines.join('\n');
}

function computeDiff(oldLock, selections) {
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

function formatDiff(diff) {
  const { added, removed, kept } = diff;
  const lines = [];

  if (Object.keys(added).length) {
    lines.push('  + Added:');
    for (const [cat, data] of Object.entries(added)) {
      const names = data.ids.map(id => {
        const item = data.config?.items?.find(i => i.id === id);
        return item?.name || id;
      });
      lines.push(`    ${data.config?.title || cat}: ${names.join(', ')}`);
    }
  }

  if (Object.keys(removed).length) {
    if (lines.length) lines.push('');
    lines.push('  - Removed:');
    for (const [cat, data] of Object.entries(removed)) {
      const names = data.ids.map(id => {
        const item = data.config?.items?.find(i => i.id === id);
        return item?.name || id;
      });
      lines.push(`    ${data.config?.title || cat}: ${names.join(', ')}`);
    }
  }

  if (Object.keys(kept).length) {
    if (lines.length) lines.push('');
    lines.push('  ~ Unchanged:');
    for (const [cat, data] of Object.entries(kept)) {
      const names = data.ids.map(id => {
        const item = data.config?.items?.find(i => i.id === id);
        return item?.name || id;
      });
      lines.push(`    ${data.config?.title || cat}: ${names.join(', ')}`);
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

async function collectTuiPreferences(existing = {}) {
  const base = normalizeTuiPreferences(existing);

  const theme = await select({
    message: 'TUI theme',
    options: TUI_THEMES.map(value => ({
      value,
      label: value,
      hint: value === 'system' ? 'Adapts to your terminal' : undefined,
    })),
    initialValue: base.theme,
  });
  if (isCancel(theme)) return null;

  const diffStyle = await select({
    message: 'Diff style',
    options: [
      { value: 'auto', label: 'auto', hint: 'Adapts to terminal width' },
      { value: 'stacked', label: 'stacked', hint: 'Always single column' },
    ],
    initialValue: base.diff_style,
  });
  if (isCancel(diffStyle)) return null;

  const cursorStyle = await select({
    message: 'Cursor style',
    options: ['block', 'underline', 'line', 'default'].map(value => ({ value, label: value })),
    initialValue: base.cursor.style,
  });
  if (isCancel(cursorStyle)) return null;

  const scrollSpeed = await select({
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
  if (isCancel(scrollSpeed)) return null;

  const scrollAcceleration = await confirm({
    message: 'Enable scroll acceleration?',
    initialValue: base.scroll_acceleration,
  });
  if (isCancel(scrollAcceleration)) return null;

  const mouse = await confirm({
    message: 'Enable mouse support?',
    initialValue: base.mouse,
  });
  if (isCancel(mouse)) return null;

  const attentionEnabled = await confirm({
    message: 'Enable attention notifications and sounds?',
    initialValue: base.attention.enabled,
  });
  if (isCancel(attentionEnabled)) return null;

  const attention = { ...base.attention, enabled: attentionEnabled };
  if (attentionEnabled) {
    const notifications = await confirm({
      message: 'Desktop notifications?',
      initialValue: base.attention.notifications,
    });
    if (isCancel(notifications)) return null;

    const sound = await confirm({
      message: 'Sound alerts?',
      initialValue: base.attention.sound,
    });
    if (isCancel(sound)) return null;

    const volume = await select({
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
    if (isCancel(volume)) return null;

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

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.doctor) {
    const healthy = await doctor(args.targetDir);
    if (!healthy) process.exitCode = 1;
    return healthy;
  }

  const version = await getPackageVersion();
  intro(`System prompt (v${version})`);

  const agentType = 'opencode';
  const targetDir = args.targetDir;

  if (args.nonInteractive) {
    const selections = args.all ? allSelections() : args.selections;
    const absTarget = resolve(process.cwd(), targetDir);
    const oldLock = await loadLockFile(absTarget);
    if (!args.dryRun) console.log(`Installing selected components into ${absTarget}`);
    await install({
      targetDir,
      agentType,
      selections,
      includeAgentsMd: args.includeAgentsMd,
      oldSelections: oldLock ? lockToSelections(oldLock) : undefined,
      oldLock,
      force: args.force,
      dryRun: args.dryRun,
    });
    console.log(args.dryRun ? 'Dry run complete.' : 'Installation complete.');
    return;
  }

  const categoryOptions = Object.entries(categories).map(([key, cat]) => {
    const visible = cat.items.filter(i => !i.removed);
    return {
      value: key,
      label: cat.title,
      hint: `${visible.length} ${key === 'mcps' ? 'MCPs' : cat.title.toLowerCase()}`,
    };
  });

  const absTarget = resolve(process.cwd(), targetDir);
  const oldLock = await loadLockFile(absTarget);
  const existingSelections = lockToSelections(oldLock);
  const existingTuiPreferences = await readTuiPreferences(absTarget);

  const selectedCategories = await multiselect({
    message: 'What would you like to install?',
    options: categoryOptions,
    initialValues: Object.keys(existingSelections),
    required: false,
  });
  if (isCancel(selectedCategories)) {
    outro('Cancelled.');
    process.exit(0);
  }

  if (!selectedCategories?.length) {
    const includeAgentsMd = await confirm({
      message: 'Generate AGENTS.md?',
      initialValue: oldLock ? oldLock.includeAgentsMd : true,
    });
    if (isCancel(includeAgentsMd)) {
      outro('Cancelled.');
      process.exit(0);
    }

    const hasExisting = Object.keys(existingSelections).length > 0;
    let keepExisting = false;
    if (hasExisting) {
      const removeAll = await confirm({
        message: 'Remove all previously installed components?',
        initialValue: false,
      });
      if (isCancel(removeAll)) {
        outro('Cancelled.');
        process.exit(0);
      }
      keepExisting = !removeAll;
    }

    const s = spinner();
    s.start('Writing files...');
    await install({
      targetDir,
      agentType,
      selections: keepExisting ? existingSelections : {},
      includeAgentsMd,
      oldSelections: hasExisting ? existingSelections : undefined,
      oldLock,
      tuiPreferences: existingTuiPreferences,
    });
    s.stop('Done.');
    const installed = [];
    if (includeAgentsMd) installed.push('AGENTS.md');
    outro(`${installed.join(' and ')} written. Open them in your project to get started.`);
    process.exit(0);
  }

  const selections = {};

  const includeAgentsMd = await confirm({
    message: 'Generate AGENTS.md?',
    initialValue: oldLock ? oldLock.includeAgentsMd : true,
  });
  if (isCancel(includeAgentsMd)) {
    outro('Cancelled.');
    process.exit(0);
  }

  for (const cat of selectedCategories) {
    const catConfig = categories[cat];
    const visibleItems = catConfig.items.filter(i => !i.removed);
    const existingIds = initialItemValues(visibleItems, existingSelections[cat] || []);

    const all = await confirm({
      message: `Install all ${catConfig.title.toLowerCase()}?`,
      initialValue: shouldPreselectAll(visibleItems, existingIds),
    });
    if (isCancel(all)) {
      outro('Cancelled.');
      process.exit(0);
    }

    if (all) {
      selections[cat] = visibleItems.map(i => i.id);
    } else {
      const picked = await multiselect({
        message: `Which ${catConfig.title.toLowerCase()} do you want?`,
        options: visibleItems.map(item => ({
          value: item.id,
          label: item.deprecated ? `${item.name} (deprecated)` : item.name,
          hint: item.deprecated ? '⚠  Deprecated — consider alternatives' : item.description,
        })),
        initialValues: existingIds,
        required: true,
      });
      if (isCancel(picked)) {
        outro('Cancelled.');
        process.exit(0);
      }
      selections[cat] = picked;
    }
  }

  let tuiPreferences = existingTuiPreferences;
  const customizeTui = await confirm({
    message: 'Customize OpenCode TUI settings?',
    initialValue: false,
  });
  if (isCancel(customizeTui)) {
    outro('Cancelled.');
    process.exit(0);
  }
  if (customizeTui) {
    const custom = await collectTuiPreferences(existingTuiPreferences);
    if (!custom) {
      outro('Cancelled.');
      process.exit(0);
    }
    tuiPreferences = custom;
  }

  if (oldLock) {
    const initialDiff = computeDiff(oldLock, selections);
    if (Object.keys(initialDiff.removed).length) {
      const removeDeselected = await confirm({
        message: 'Remove deselected items from the previous installation?',
        initialValue: false,
      });
      if (isCancel(removeDeselected)) {
        outro('Cancelled.');
        process.exit(0);
      }
      if (!removeDeselected) {
        for (const [cat, data] of Object.entries(initialDiff.removed)) {
          selections[cat] = [...new Set([...(selections[cat] || []), ...data.ids])];
        }
      }
    }
  }

  if (oldLock) {
    const diff = computeDiff(oldLock, selections);
    const diffText = formatDiff(diff);

    console.log('\n📦 Changes from previous installation:\n');
    if (diffText) {
      console.log(diffText);
      console.log();
    } else {
      console.log('  No changes — same selections as before.\n');
    }

    const genFiles = [];
    if (includeAgentsMd) genFiles.push('AGENTS.md');
    genFiles.push('opencode.json', 'tui.json', '.gitignore');
    if (selections.mcps?.length) genFiles.push('.env');
    if (selections.memory?.length) genFiles.push('memory/');

    if (genFiles.length) {
      console.log('  Generated files:');
      for (const f of genFiles) {
        console.log(`    📄 ${f}`);
      }
      console.log();
    }
  } else {
    console.log('\n📦 Summary of what will be installed:\n');
    if (includeAgentsMd) console.log('  📄 AGENTS.md');
    console.log('  📄 opencode.json');
    console.log('  📄 tui.json');
    console.log('  📄 .gitignore');
    console.log(buildSummary(selections));
    console.log();
  }

  const confirmed = await confirm({
    message: 'Proceed with installation?',
    initialValue: true,
  });
  if (isCancel(confirmed) || !confirmed) {
    outro('Installation cancelled.');
    process.exit(0);
  }

  const s = spinner();
  s.start(oldLock ? 'Updating files...' : 'Installing files...');

  const finalTarget = await install({
    targetDir,
    agentType,
    selections,
    includeAgentsMd,
    oldSelections: oldLock ? existingSelections : undefined,
    oldLock,
    tuiPreferences,
    force: args.force,
    dryRun: args.dryRun,
  });

  s.stop('Installation complete!');

  const fileCount = Object.values(selections).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  const verb = oldLock ? 'Updated' : 'Installed';
  outro(`${verb} ${fileCount} components to ${finalTarget}

Next steps:
  ${agentType === 'opencode' ? '- Open your project in OpenCode — it will read opencode.json and AGENTS.md automatically' : '- Point your AI coding agent to AGENTS.md as the entry point'}
  - Run /help in your agent to see available commands
`);
}
