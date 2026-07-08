import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdir, copyFile, writeFile, readdir, stat, readFile } from 'node:fs/promises';

import { categories } from './catalog.js';
import { loadMcpConfigs, generateOpenCodeConfig } from './agent-configs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');

export async function getPackageVersion() {
  try {
    const pkg = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf-8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function resolveSource(subpath) {
  return resolve(packageRoot, subpath);
}

function targetSubdir(sourceDir) {
  return sourceDir.replace(/^framework\//, '');
}

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await mkdir(dirname(destPath), { recursive: true });
      await copyFile(srcPath, destPath);
    }
  }
}

async function copySelectedDirs(targetDir, category, selectedIds) {
  const catConfig = categories[category];
  if (!catConfig || !selectedIds?.length) return;

  const relativeDir = targetSubdir(catConfig.sourceDir);
  const destParent = resolve(targetDir, relativeDir);

  for (const id of selectedIds) {
    const srcPath = resolveSource(`${catConfig.sourceDir}/${id}`);
    const destPath = resolve(destParent, id);

    try {
      await stat(srcPath);
      await copyDir(srcPath, destPath);
    } catch {
      console.warn(`  ⚠  Source not found: ${catConfig.sourceDir}/${id}`);
    }
  }
}

async function copySelectedFiles(targetDir, category, selectedIds) {
  const catConfig = categories[category];
  if (!catConfig || !selectedIds?.length) return;

  const relativeDir = targetSubdir(catConfig.sourceDir);
  const destParent = resolve(targetDir, relativeDir);
  await mkdir(destParent, { recursive: true });

  for (const id of selectedIds) {
    const srcFile = resolveSource(`${catConfig.sourceDir}/${id}.md`);
    const destFile = resolve(destParent, `${id}.md`);
    try {
      await stat(srcFile);
      await copyFile(srcFile, destFile);
    } catch {
      console.warn(`  ⚠  Source not found: ${catConfig.sourceDir}/${id}.md`);
    }
  }
}

function generateAgentsMd({ selections }) {
  const sections = [];

  sections.push(`# AGENTS.md

You are a senior engineering agent. This file describes the tools and knowledge available in this project.
`);

  if (selections.skills?.length) {
    sections.push(`## Skills

Load skills on-demand when the task matches their purpose.

Browse the skill catalog at \`skills/\` and load a skill by referencing its \`SKILL.md\` in a prompt.
`);
  }

  if (selections.commands?.length) {
    sections.push(`## Commands

Available slash commands:

| Command | Purpose |
| --- | --- |`);
    for (const id of selections.commands) {
      const item = categories.commands.items.find(i => i.id === id);
      if (item) sections.push(`| \`/${id}\` | ${item.description} |`);
    }
    sections.push('');
  }

  if (selections.agents?.length) {
    sections.push(`## Subagents

Available subagents and their permissions:

| Agent | Permissions |
| --- | --- |`);
    for (const id of selections.agents) {
      const item = categories.agents.items.find(i => i.id === id);
      if (item) sections.push(`| ${item.name} | read, grep, glob (no edit/write) |`);
    }
    sections.push('');
  }

  if (selections.mcps?.length) {
    sections.push(`## MCPs

Available MCP servers documented in \`mcps/\`. Configured via \`opencode.json\`.
`);
  }

  if (selections.plugins?.length) {
    sections.push(`## Plugins

Available OpenCode plugins. Configured via \`opencode.json\`.
`);
  }

  if (selections.styles?.length) {
    sections.push(`## Styles

Design system references in \`styles/\`. Use them for UI component design and tokens.
`);
  }

  if (selections.standards?.length || selections.templates?.length) {
    sections.push(`## References`);
    if (selections.standards?.length) {
      sections.push(`- **Standards** — \`references/standards/\` — canonical engineering rules.`);
    }
    if (selections.templates?.length) {
      sections.push(`- **Templates** — \`references/templates/\` — fillable workflow documents.`);
    }
    sections.push('');
  }

  sections.push(`## Engineering Conduct

1. **Safety and correctness outrank speed** — data loss, authorization gaps, and silent failures are never acceptable shortcuts.
2. **Data integrity outranks convenience** — do not weaken constraints or validation.
3. **Design before code** — understand actors, entities, invariants, and failure modes.
4. **Prefer simplicity** — fewer moving parts means fewer failure modes.
5. **Make tradeoffs explicit** — surface what was deferred, why, and what could break.
6. **Small, reversible changes** — prefer narrow, testable, rollback-safe increments.
7. **Verify before concluding** — run tests, linters, and type checks.
`);

  return sections.join('\n');
}

export async function install({ targetDir, agentType, selections, includeAgentsMd = true, includeSystemPromptMd = true }) {
  const absTarget = resolve(process.cwd(), targetDir);
  await mkdir(absTarget, { recursive: true });

  const tasks = [];

  if (selections.skills?.length) {
    tasks.push(copySelectedDirs(absTarget, 'skills', selections.skills));
  }
  if (selections.agents?.length) {
    tasks.push(copySelectedFiles(absTarget, 'agents', selections.agents));
  }
  if (selections.commands?.length) {
    tasks.push(copySelectedFiles(absTarget, 'commands', selections.commands));
  }
  if (selections.styles?.length) {
    tasks.push(copySelectedDirs(absTarget, 'styles', selections.styles));
  }
  if (selections.standards?.length) {
    tasks.push(copySelectedFiles(absTarget, 'standards', selections.standards));
  }
  if (selections.templates?.length) {
    tasks.push(copySelectedFiles(absTarget, 'templates', selections.templates));
  }

  await Promise.all(tasks);

  if (includeSystemPromptMd) {
    const systemPromptSrc = resolveSource('framework/harness/opencode/configs/system-prompt.md');
    try {
      await stat(systemPromptSrc);
      await copyFile(systemPromptSrc, resolve(absTarget, 'system-prompt.md'));
    } catch {
      console.warn('  ⚠  system-prompt.md not found in harness');
    }
  }

  if (includeAgentsMd) {
    const agentsContent = generateAgentsMd({ selections });
    await writeFile(resolve(absTarget, 'AGENTS.md'), agentsContent);
  }

  if (agentType === 'opencode') {
    let mcpEntries = {};
    if (selections.mcps?.length) {
      mcpEntries = await loadMcpConfigs(selections.mcps);
    }
    const configJson = generateOpenCodeConfig({ selections, mcpEntries, includeAgentsMd, includeSystemPromptMd });
    if (configJson) {
      await writeFile(resolve(absTarget, 'opencode.json'), configJson);
    }
  }

  const version = await getPackageVersion();
  const lockData = {
    version,
    agentType,
    targetDir,
    installedAt: new Date().toISOString(),
    selections: Object.fromEntries(
      Object.entries(selections).map(([k, v]) => [k, [...v]])
    ),
  };
  await writeFile(resolve(absTarget, 'system-prompt--lock.json'), JSON.stringify(lockData, null, 2));

  return absTarget;
}
