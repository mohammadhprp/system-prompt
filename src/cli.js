import { intro, outro, text, confirm, select, multiselect, spinner, isCancel } from '@clack/prompts';

import { categories } from './catalog.js';
import { install } from './installer.js';
import { update } from './update.js';

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

export async function main() {
  if (process.argv[2] === 'update') {
    await update();
    return;
  }

  intro('system-prompt bootstrap CLI');

  const agentType = await select({
    message: 'Which harness would you like to install?',
    options: [
      { value: 'opencode', label: 'OpenCode', hint: 'Recommended' },
    ],
  });
  if (isCancel(agentType)) {
    outro('Cancelled.');
    process.exit(0);
  }

  const targetDir = await text({
    message: 'Project directory to install into?',
    placeholder: './.opencode',
    defaultValue: '.opencode',
    validate: (val) => val.trim() ? undefined : 'Path is required',
  });
  if (isCancel(targetDir)) {
    outro('Cancelled.');
    process.exit(0);
  }

  const categoryOptions = [
    { value: 'skills', label: 'Skills', hint: '25 task-specific procedures' },
    { value: 'agents', label: 'Subagents', hint: '4 specialized agents' },
    { value: 'commands', label: 'Slash Commands', hint: '7 repeatable workflows' },
    { value: 'mcps', label: 'MCPs', hint: '8 MCP servers' },
    { value: 'plugins', label: 'Plugins', hint: '1 OpenCode plugin' },
    { value: 'styles', label: 'Styles', hint: '2 design systems' },
    { value: 'standards', label: 'Standards', hint: '12 engineering standards' },
    { value: 'templates', label: 'Templates', hint: '8 workflow documents' },
  ];

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

    const includeSystemPromptMd = await confirm({
      message: 'Generate system-prompt.md?',
      initialValue: true,
    });
    if (isCancel(includeSystemPromptMd)) {
      outro('Cancelled.');
      process.exit(0);
    }

    if (!includeAgentsMd && !includeSystemPromptMd) {
      outro('Nothing to install.');
      process.exit(0);
    }

    const s = spinner();
    s.start('Writing files...');
    await install({
      targetDir: targetDir.trim() || '.',
      agentType,
      selections: {},
      includeAgentsMd,
      includeSystemPromptMd,
    });
    s.stop('Done.');
    const installed = [];
    if (includeAgentsMd) installed.push('AGENTS.md');
    if (includeSystemPromptMd) installed.push('system-prompt.md');
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

  const includeSystemPromptMd = await confirm({
    message: 'Generate system-prompt.md?',
    initialValue: true,
  });
  if (isCancel(includeSystemPromptMd)) {
    outro('Cancelled.');
    process.exit(0);
  }

  for (const cat of selectedCategories) {
    const catConfig = categories[cat];
    const allIds = catConfig.items.map(i => i.id);

    const all = await confirm({
      message: `Install all ${catConfig.title.toLowerCase()}?`,
      initialValue: allIds.length <= 12,
    });
    if (isCancel(all)) {
      outro('Cancelled.');
      process.exit(0);
    }

    if (all) {
      selections[cat] = allIds;
    } else {
      const picked = await multiselect({
        message: `Which ${catConfig.title.toLowerCase()} do you want?`,
        options: catConfig.items.map(item => ({
          value: item.id,
          label: item.name,
          hint: item.description,
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

  console.log('\n📦 Summary of what will be installed:\n');
  if (includeAgentsMd) console.log('  📄 AGENTS.md');
  if (includeSystemPromptMd) console.log('  📄 system-prompt.md');
  console.log(buildSummary(selections));
  console.log();

  const confirmed = await confirm({
    message: 'Proceed with installation?',
    initialValue: true,
  });
  if (isCancel(confirmed) || !confirmed) {
    outro('Installation cancelled.');
    process.exit(0);
  }

  const s = spinner();
  s.start('Installing files...');

  const absTarget = await install({
    targetDir: targetDir.trim() || '.',
    agentType,
    selections,
    includeAgentsMd,
    includeSystemPromptMd,
  });

  s.stop('Installation complete!');

  const fileCount = Object.values(selections).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  outro(`Installed ${fileCount} components to ${absTarget}

Next steps:
  ${agentType === 'opencode' ? '- Open your project in OpenCode — it will read opencode.json and AGENTS.md automatically' : '- Point your AI coding agent to AGENTS.md as the entry point'}
  - Run /help in your agent to see available commands
`);
}
