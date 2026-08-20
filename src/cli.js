import { intro, outro, confirm, multiselect, spinner, isCancel } from '@clack/prompts';
import { resolve } from 'node:path';

import { categories } from './catalog.js';
import { getPackageVersion, install, loadLockFile } from './installer.js';
import { doctor } from './doctor.js';

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
  const oldSels = oldLock.selections;
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
      oldSelections: oldLock?.selections,
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

  const selectedCategories = await multiselect({
    message: 'What would you like to install?',
    options: categoryOptions,
    required: false,
  });
  if (isCancel(selectedCategories)) {
    outro('Cancelled.');
    process.exit(0);
  }

  if (!selectedCategories?.length) {
    const includeAgentsMd = await confirm({
      message: 'Generate AGENTS.md?',
      initialValue: true,
    });
    if (isCancel(includeAgentsMd)) {
      outro('Cancelled.');
      process.exit(0);
    }

    const s = spinner();
    s.start('Writing files...');
    await install({
       targetDir,
      agentType,
      selections: {},
      includeAgentsMd,
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
    initialValue: true,
  });
  if (isCancel(includeAgentsMd)) {
    outro('Cancelled.');
    process.exit(0);
  }

  for (const cat of selectedCategories) {
    const catConfig = categories[cat];
    const allIds = catConfig.items.map(i => i.id);

      const visibleItems = catConfig.items.filter(i => !i.removed);

      const all = await confirm({
        message: `Install all ${catConfig.title.toLowerCase()}?`,
        initialValue: visibleItems.length <= 12,
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
          required: true,
        });
      if (isCancel(picked)) {
        outro('Cancelled.');
        process.exit(0);
      }
      selections[cat] = picked;
    }
  }

  const absTarget = resolve(process.cwd(), targetDir);
  const oldLock = await loadLockFile(absTarget);

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
    oldSelections: oldLock?.selections,
    oldLock,
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
