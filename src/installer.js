import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdir, copyFile, writeFile, readdir, stat, readFile, rm } from 'node:fs/promises';

import { categories } from './catalog.js';
import { loadMcpConfigs, generateOpenCodeConfig, generateTuiConfig } from './agent-configs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');

const AGENTS_MD = `# AGENTS.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

Read CONTEXT.md for repository-specific setup, commands, architecture, tests, and workflow guidance.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines, and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multistep tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]


Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

`;

const OPENCODE_GITIGNORE = `.env*
node_modules
package.json
package-lock.json
bun.lock
`;

export async function getPackageVersion() {
  try {
    const pkg = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf-8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export async function loadLockFile(absTarget) {
  try {
    const content = await readFile(resolve(absTarget, 'system-prompt-lock.json'), 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
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

async function isRemoved(category, id) {
  const catConfig = categories[category];
  if (!catConfig) return false;
  const item = catConfig.items.find(i => i.id === id);
  return item?.removed === true;
}

async function copySelectedDirs(targetDir, category, selectedIds) {
  const catConfig = categories[category];
  if (!catConfig || !selectedIds?.length) return;

  const relativeDir = targetSubdir(catConfig.sourceDir);
  const destParent = resolve(targetDir, relativeDir);

  for (const id of selectedIds) {
    if (await isRemoved(category, id)) continue;

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

async function copySelectedFiles(targetDir, category, selectedIds, skipIfExists = false) {
  const catConfig = categories[category];
  if (!catConfig || !selectedIds?.length) return;

  const relativeDir = targetSubdir(catConfig.sourceDir);
  const destParent = resolve(targetDir, relativeDir);
  await mkdir(destParent, { recursive: true });

  for (const id of selectedIds) {
    if (await isRemoved(category, id)) continue;

    const srcFile = resolveSource(`${catConfig.sourceDir}/${id}.md`);
    const destFile = resolve(destParent, `${id}.md`);
    try {
      await stat(srcFile);
      if (skipIfExists) {
        try {
          await stat(destFile);
          continue;
        } catch {
          // dest doesn't exist — proceed to copy
        }
      }
      await copyFile(srcFile, destFile);
    } catch {
      console.warn(`  ⚠  Source not found: ${catConfig.sourceDir}/${id}.md`);
    }
  }
}

function parseEnv(content) {
  const vars = new Map();
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      vars.set(trimmed, '');
    } else {
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (key) vars.set(key, value);
    }
  }
  return vars;
}

async function collectMcpEnvExamples(mcpIds) {
  const combined = new Map();
  for (const id of mcpIds) {
    try {
      const examplePath = resolveSource(`framework/mcps/${id}/configs/.env.example`);
      const content = await readFile(examplePath, 'utf-8');
      const parsed = parseEnv(content);
      for (const [key, value] of parsed) {
        if (!combined.has(key)) combined.set(key, value);
      }
    } catch {
      // Silently skip MCPs without .env.example
    }
  }
  return combined;
}

async function deleteSelectedItems(absTarget, category, ids) {
  const catConfig = categories[category];
  if (!catConfig || !ids?.length) return;

  const FILE_BASED = new Set(['agents', 'commands', 'memory', 'modes', 'standards', 'templates']);
  if (!FILE_BASED.has(category) && category !== 'skills' && category !== 'styles') return;

  const relativeDir = targetSubdir(catConfig.sourceDir);
  const destParent = resolve(absTarget, relativeDir);

  for (const id of ids) {
    const destPath = FILE_BASED.has(category)
      ? resolve(destParent, `${id}.md`)
      : resolve(destParent, id);
    try {
      await rm(destPath, { recursive: true, force: true });
    } catch {
      // File may not exist — ignore
    }
  }
}

async function writeMergedEnv(absTarget, examples) {
  if (examples.size === 0) return;

  const envPath = resolve(absTarget, '.env');
  const existing = new Map();

  try {
    const existingContent = await readFile(envPath, 'utf-8');
    const parsed = parseEnv(existingContent);
    for (const [key, value] of parsed) existing.set(key, value);
  } catch {
    // File doesn't exist yet
  }

  const merged = new Map(existing);
  for (const [key, value] of examples) {
    if (!merged.has(key)) merged.set(key, value);
  }

  if (merged.size === 0) return;

  const lines = [];
  for (const [key, value] of merged) {
    lines.push(`${key}=${value}`);
  }
  lines.push('');

  await writeFile(envPath, lines.join('\n'));
}

function generateAgentsMd({ selections }) {
  return AGENTS_MD;
}

export async function install({ targetDir, agentType, selections, includeAgentsMd = true, writeAgentsMd, oldSelections }) {
  writeAgentsMd = writeAgentsMd ?? includeAgentsMd;
  const absTarget = resolve(process.cwd(), targetDir);
  await mkdir(absTarget, { recursive: true });

  // Delete items that are no longer selected
  if (oldSelections) {
    for (const cat of Object.keys(oldSelections)) {
      const oldIds = new Set(oldSelections[cat] || []);
      const newIds = new Set(selections[cat] || []);
      const removedIds = [...oldIds].filter(id => !newIds.has(id));
      if (removedIds.length > 0) {
        await deleteSelectedItems(absTarget, cat, removedIds);
      }
    }
  }

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
  if (selections.modes?.length) {
    tasks.push(copySelectedFiles(absTarget, 'modes', selections.modes));
  }
  if (selections.memory?.length) {
    tasks.push(copySelectedFiles(absTarget, 'memory', selections.memory, true));
  }
  if (selections.standards?.length) {
    tasks.push(copySelectedFiles(absTarget, 'standards', selections.standards));
  }
  if (selections.templates?.length) {
    tasks.push(copySelectedFiles(absTarget, 'templates', selections.templates));
  }

  await Promise.all(tasks);

  if (writeAgentsMd) {
    const agentsContent = generateAgentsMd({ selections });
    await writeFile(resolve(absTarget, 'AGENTS.md'), agentsContent);
  }

  if (agentType === 'opencode') {
    let mcpEntries = {};
    if (selections.mcps?.length) {
      mcpEntries = await loadMcpConfigs(selections.mcps);
    }
    const configJson = generateOpenCodeConfig({
      selections,
      mcpEntries,
      includeAgentsMd: includeAgentsMd,
    });
    if (configJson) {
      await writeFile(resolve(absTarget, 'opencode.json'), configJson);
    }
    await writeFile(resolve(absTarget, 'tui.json'), generateTuiConfig({ selections }));
    await writeFile(resolve(absTarget, '.gitignore'), OPENCODE_GITIGNORE);
  }

  if (selections.mcps?.length) {
    const envExamples = await collectMcpEnvExamples(selections.mcps);
    await writeMergedEnv(absTarget, envExamples);
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
    includeAgentsMd,
  };
  await writeFile(resolve(absTarget, 'system-prompt-lock.json'), JSON.stringify(lockData, null, 2));

  return absTarget;
}
