import { fileURLToPath } from 'node:url';
import { dirname, relative, resolve, isAbsolute } from 'node:path';
import { mkdir, writeFile, readdir, stat, lstat, readFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';

import { categories } from './catalog.js';
import { loadMcpConfigs, generateOpenCodeConfig, generateTuiConfig } from './agent-configs.js';
import { LOCK_CATEGORIES, isFileBased, isCopyable, itemSourcePath, itemRelativePath, targetSubdir } from './item-layout.js';
import { status } from './ui.js';

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

export const LOCK_VERSION = 1;

export function lockToSelections(lock) {
  const selections = {};
  if (!lock) return selections;
  for (const category of LOCK_CATEGORIES) {
    const ids = Object.keys(lock[category] || {});
    if (ids.length) selections[category] = ids;
  }
  return selections;
}

function buildComputedHash(files, fallbackId) {
  const keys = Object.keys(files).sort();
  if (keys.length === 0) return hash(fallbackId);
  if (keys.length === 1) return files[keys[0]];
  return hash(keys.map(path => `${path}:${files[path]}`).join('\n'));
}

function getExpectedHash(oldLock, relativePath) {
  const generated = oldLock?.generated?.[relativePath]?.computedHash;
  if (generated) return generated;
  for (const category of LOCK_CATEGORIES) {
    const entries = oldLock?.[category];
    if (!entries) continue;
    for (const entry of Object.values(entries)) {
      const value = entry?.files?.[relativePath];
      if (value) return value;
    }
  }
  return undefined;
}
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
    const lock = JSON.parse(content);
    validateLock(lock);
    return lock;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    if (error instanceof SyntaxError || error.message?.startsWith('Invalid system-prompt lock')) {
      throw new Error(`${error.message}. Remove or repair system-prompt-lock.json before reinstalling.`);
    }
    throw error;
  }
}

function validateLock(lock) {
  if (!lock || typeof lock !== 'object' || Array.isArray(lock)) {
    throw new Error('Invalid system-prompt lock: expected an object');
  }
  if (lock.selections !== undefined || lock.managedFiles !== undefined) {
    throw new Error('Invalid system-prompt lock: legacy lock format no longer supported');
  }
  if (lock.version !== LOCK_VERSION) {
    throw new Error('Invalid system-prompt lock: unsupported version');
  }
  if (typeof lock.agentType !== 'string' || typeof lock.installedAt !== 'string') {
    throw new Error('Invalid system-prompt lock: missing installation metadata');
  }
  if (typeof lock.includeAgentsMd !== 'boolean') {
    throw new Error('Invalid system-prompt lock: includeAgentsMd must be a boolean');
  }
  const allowed = new Set(['version', 'agentType', 'installedAt', 'includeAgentsMd', 'generated', ...LOCK_CATEGORIES]);
  for (const key of Object.keys(lock)) {
    if (!allowed.has(key)) {
      throw new Error(`Invalid system-prompt lock: unknown key ${key}`);
    }
  }
  for (const category of LOCK_CATEGORIES) {
    const entries = lock[category];
    if (entries === undefined) continue;
    if (!entries || typeof entries !== 'object' || Array.isArray(entries)) {
      throw new Error(`Invalid system-prompt lock: invalid ${category} selection`);
    }
    const config = categories[category];
    const knownIds = new Set(config.items.map(item => item.id));
    for (const [id, entry] of Object.entries(entries)) {
      if (!knownIds.has(id)) {
        throw new Error(`Invalid system-prompt lock: unknown ${category} item`);
      }
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        throw new Error(`Invalid system-prompt lock: invalid ${category} entry`);
      }
      if (typeof entry.source !== 'string' || typeof entry.sourceType !== 'string' || typeof entry.itemPath !== 'string') {
        throw new Error(`Invalid system-prompt lock: invalid ${category} entry source`);
      }
      if (!/^[a-f0-9]{64}$/.test(entry.computedHash || '')) {
        throw new Error(`Invalid system-prompt lock: invalid ${category} entry hash`);
      }
      if (!entry.files || typeof entry.files !== 'object' || Array.isArray(entry.files)) {
        throw new Error(`Invalid system-prompt lock: invalid ${category} entry files`);
      }
      for (const [path, checksum] of Object.entries(entry.files)) {
        if (path.startsWith('/') || path.split('/').includes('..') || !/^[a-f0-9]{64}$/.test(checksum)) {
          throw new Error('Invalid system-prompt lock: unsafe managed file entry');
        }
      }
    }
  }
  const generated = lock.generated;
  if (generated !== undefined) {
    if (!generated || typeof generated !== 'object' || Array.isArray(generated)) {
      throw new Error('Invalid system-prompt lock: generated must be an object');
    }
    for (const [path, entry] of Object.entries(generated)) {
      if (path.startsWith('/') || path.split('/').includes('..') || !/^[a-f0-9]{64}$/.test(entry?.computedHash || '')) {
        throw new Error('Invalid system-prompt lock: unsafe generated file entry');
      }
    }
  }
}

function hash(content) {
  return createHash('sha256').update(content).digest('hex');
}

function isInside(parent, child) {
  const relativePath = relative(parent, child);
  return relativePath === '' || (!relativePath.startsWith('../') && relativePath !== '..' && !isAbsolute(relativePath));
}

async function canWrite(destFile, relativePath, oldLock, force) {
  if (force) return true;
  try {
    const existing = await readFile(destFile);
    const previousHash = getExpectedHash(oldLock, relativePath);
    return Boolean(previousHash && previousHash === hash(existing));
  } catch (error) {
    if (error.code === 'ENOENT') return true;
    throw error;
  }
}

async function writeManagedFile(destFile, content, relativePath, options, owner) {
  await assertSafeDestination(options.targetDir, destFile);
  if (!options.allowExistingMerge && !(await canWrite(destFile, relativePath, options.oldLock, options.force))) {
    console.warn(status('warn', `Preserving existing file: ${relativePath}`));
    return false;
  }
  if (!options.dryRun) await mkdir(dirname(destFile), { recursive: true });
  if (!options.dryRun) await writeFile(destFile, content);
  options.managedFiles[relativePath] = hash(content);
  if (owner) options.fileOwners[relativePath] = owner;
  return true;
}

async function copyDir(src, dest, relativeDir, options, owner) {
  if (!options.dryRun) await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);
    const relativePath = `${relativeDir}/${entry.name}`;

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, relativePath, options, owner);
    } else if (entry.isFile()) {
      const content = await readFile(srcPath);
      await writeManagedFile(destPath, content, relativePath, options, owner);
    }
  }
}

function sourceMissing(error) {
  return error?.code === 'ENOENT';
}

function assertSafePath(targetDir, path) {
  if (!isInside(targetDir, path)) {
    throw new Error(`Refusing to access path outside installation directory: ${path}`);
  }
}

async function assertSafeDestination(targetDir, path) {
  assertSafePath(targetDir, path);
  try {
    if ((await lstat(targetDir)).isSymbolicLink()) {
      throw new Error(`Refusing to install through symlink target: ${targetDir}`);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const relativePath = relative(targetDir, path);
  let current = targetDir;
  for (const part of relativePath.split('/').filter(Boolean)) {
    current = resolve(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink()) {
        throw new Error(`Refusing to access symlink inside installation directory: ${current}`);
      }
    } catch (error) {
      if (error.code === 'ENOENT') break;
      throw error;
    }
  }
}

async function copySelectedDirs(targetDir, category, selectedIds, options) {
  const catConfig = categories[category];
  if (!catConfig || !selectedIds?.length) return;

  const destParent = resolve(targetDir, targetSubdir(catConfig.sourceDir));

  for (const id of selectedIds) {
    if (await isRemoved(category, id)) continue;

    const source = itemSourcePath(category, id);
    const srcPath = resolveSource(source);
    const destPath = resolve(destParent, id);
    await assertSafeDestination(targetDir, destPath);

    try {
      await stat(srcPath);
      await copyDir(srcPath, destPath, itemRelativePath(category, id), options, { category, id });
    } catch (error) {
      if (sourceMissing(error)) {
        console.warn(status('warn', `Source not found: ${source}`));
        continue;
      }
      throw error;
    }
  }
}

async function copySelectedFiles(targetDir, category, selectedIds, options) {
  const catConfig = categories[category];
  if (!catConfig || !selectedIds?.length) return;

  const destParent = resolve(targetDir, targetSubdir(catConfig.sourceDir));
  if (!options.dryRun) await mkdir(destParent, { recursive: true });

  for (const id of selectedIds) {
    if (await isRemoved(category, id)) continue;

    const source = itemSourcePath(category, id);
    const relativePath = itemRelativePath(category, id);
    const destFile = resolve(targetDir, relativePath);
    await assertSafeDestination(targetDir, destFile);
    try {
      const content = await readFile(resolveSource(source));
      await writeManagedFile(destFile, content, relativePath, options, { category, id });
    } catch (error) {
      if (sourceMissing(error)) {
        console.warn(status('warn', `Source not found: ${source}`));
        continue;
      }
      throw error;
    }
  }
}

async function deleteSelectedItems(absTarget, category, ids, oldLock, force, dryRun) {
  if (!categories[category] || !ids?.length || !isCopyable(category)) return;

  for (const id of ids) {
    const relativePath = itemRelativePath(category, id);
    const destPath = resolve(absTarget, relativePath);
    await assertSafeDestination(absTarget, destPath);
    if (!force && oldLock) {
      const managedEntries = Object.entries(oldLock?.[category]?.[id]?.files || {});
      if (managedEntries.length === 0) {
        console.warn(status('warn', `Preserving unmanaged item: ${relativePath}`));
        continue;
      }
      let modified = false;
      for (const [path, checksum] of managedEntries) {
        await assertSafeDestination(absTarget, resolve(absTarget, path));
        try {
          if (hash(await readFile(resolve(absTarget, path))) !== checksum) modified = true;
        } catch (error) {
          if (!sourceMissing(error)) throw error;
        }
      }
      if (modified) {
        console.warn(status('warn', `Preserving modified item: ${relativePath}`));
        continue;
      }
      if (!isFileBased(category)) {
        if (!dryRun) {
          for (const [path] of managedEntries) await rm(resolve(absTarget, path), { force: true });
        }
        continue;
      }
    }
    if (!dryRun) await rm(destPath, { recursive: true, force: true });
  }
}

async function mergeJsonFile(destFile, generated, relativePath, options, previousGenerated = generated) {
  let existing = {};
  try {
    existing = JSON.parse(await readFile(destFile, 'utf-8'));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      if (error instanceof SyntaxError) throw new Error(`Cannot merge invalid JSON file: ${relativePath}`);
      throw error;
    }
  }
  const merged = { ...existing, ...generated };
  if (Array.isArray(existing.instructions) && Array.isArray(generated.instructions)) {
    const previous = new Set(previousGenerated.instructions || []);
    merged.instructions = [...new Set([
      ...existing.instructions.filter(item => !previous.has(item)),
      ...generated.instructions,
    ])];
  }
  if (Array.isArray(existing.plugin)) {
    const previous = new Set(previousGenerated.plugin || []);
    const plugins = [...new Set([
      ...existing.plugin.filter(item => !previous.has(item)),
      ...(generated.plugin || []),
    ])];
    if (plugins.length) merged.plugin = plugins;
    else delete merged.plugin;
  }
  for (const key of ['mcp', 'references']) {
    if (existing[key] && typeof existing[key] === 'object') {
      const previous = previousGenerated[key] || {};
      const preserved = Object.fromEntries(Object.entries(existing[key]).filter(([name]) => !(name in previous)));
      const values = { ...preserved, ...(generated[key] || {}) };
      if (Object.keys(values).length) merged[key] = values;
      else delete merged[key];
    }
  }
  return writeManagedFile(destFile, Buffer.from(JSON.stringify(merged, null, 4)), relativePath, {
    ...options,
    allowExistingMerge: !options.oldLock,
  }, { generated: true });
}

async function mergeGitignore(destFile, options) {
  let existing = '';
  try {
    existing = await readFile(destFile, 'utf-8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const lines = new Set(existing.split('\n').filter(Boolean));
  for (const line of OPENCODE_GITIGNORE.split('\n').filter(Boolean)) lines.add(line);
  return writeManagedFile(destFile, Buffer.from(`${[...lines].join('\n')}\n`), '.gitignore', {
    ...options,
    allowExistingMerge: !options.oldLock,
  }, { generated: true });
}

export function validateSelections(selections) {
  if (!selections || typeof selections !== 'object' || Array.isArray(selections)) {
    throw new Error('Selections must be an object');
  }
  for (const [category, ids] of Object.entries(selections)) {
    const config = categories[category];
    if (!config || !Array.isArray(ids)) throw new Error(`Unknown or invalid category: ${category}`);
    const knownIds = new Set(config.items.map(item => item.id));
    if (ids.some(id => !knownIds.has(id))) throw new Error(`Unknown ${category} item selected`);
  }
  return selections;
}

export async function install({ targetDir, agentType, selections, includeAgentsMd = true, writeAgentsMd, oldSelections, oldLock, force = false, dryRun = false, tuiPreferences }) {
  validateSelections(selections);
  if (oldLock) validateLock(oldLock);
  writeAgentsMd = writeAgentsMd ?? includeAgentsMd;
  const absTarget = resolve(process.cwd(), targetDir);
  if (!dryRun) await mkdir(absTarget, { recursive: true });
  const options = {
    targetDir: absTarget,
    oldLock,
    force,
    dryRun,
    managedFiles: {},
    fileOwners: {},
  };
  if (oldLock) {
    for (const category of LOCK_CATEGORIES) {
      for (const [id, entry] of Object.entries(oldLock[category] || {})) {
        for (const [path, checksum] of Object.entries(entry.files || {})) {
          if (!(path in options.managedFiles)) {
            options.managedFiles[path] = checksum;
            options.fileOwners[path] = { category, id };
          }
        }
      }
    }
    for (const [path, entry] of Object.entries(oldLock.generated || {})) {
      if (!(path in options.managedFiles)) {
        options.managedFiles[path] = entry.computedHash;
        options.fileOwners[path] = { generated: true };
      }
    }
  }

  // Delete items that are no longer selected.
  if (oldSelections) {
    for (const cat of Object.keys(oldSelections)) {
      const oldIds = new Set(oldSelections[cat] || []);
      const newIds = new Set(selections[cat] || []);
      const removedIds = [...oldIds].filter(id => !newIds.has(id));
      await deleteSelectedItems(absTarget, cat, removedIds, oldLock, force, dryRun);
    }
  }

  const tasks = [];
  for (const category of LOCK_CATEGORIES) {
    if (!isCopyable(category) || !selections[category]?.length) continue;
    tasks.push(isFileBased(category)
      ? copySelectedFiles(absTarget, category, selections[category], options)
      : copySelectedDirs(absTarget, category, selections[category], options));
  }
  await Promise.all(tasks);

  if (writeAgentsMd) {
    await writeManagedFile(resolve(absTarget, 'AGENTS.md'), Buffer.from(AGENTS_MD), 'AGENTS.md', options, { generated: true });
  }

  if (agentType === 'opencode') {
    let mcpEntries = {};
    if (selections.mcps?.length) mcpEntries = await loadMcpConfigs(selections.mcps);
    let previousOpenCodeConfig;
    let previousTuiConfig;
    if (oldLock) {
      const oldSelections = lockToSelections(oldLock);
      let previousMcpEntries = {};
      if (oldSelections.mcps?.length) previousMcpEntries = await loadMcpConfigs(oldSelections.mcps);
      previousOpenCodeConfig = JSON.parse(generateOpenCodeConfig({
        selections: oldSelections,
        mcpEntries: previousMcpEntries,
        includeAgentsMd: oldLock.includeAgentsMd ?? true,
      }));
      previousTuiConfig = JSON.parse(generateTuiConfig({ selections: oldSelections, preferences: tuiPreferences }));
    }
    const configJson = generateOpenCodeConfig({ selections, mcpEntries, includeAgentsMd });
    await mergeJsonFile(resolve(absTarget, 'opencode.json'), JSON.parse(configJson), 'opencode.json', options, previousOpenCodeConfig);
    await mergeJsonFile(resolve(absTarget, 'tui.json'), JSON.parse(generateTuiConfig({ selections, preferences: tuiPreferences })), 'tui.json', options, previousTuiConfig);
    await mergeGitignore(resolve(absTarget, '.gitignore'), options);
  }

  if (selections.mcps?.length) {
    const envExamples = await collectMcpEnvExamples(selections.mcps);
    await writeMergedEnv(absTarget, envExamples, options);
  }

  if (dryRun) return absTarget;
  const pkgVersion = await getPackageVersion();
  const source = `system-prompt@${pkgVersion}`;
  const lockData = {
    version: LOCK_VERSION,
    agentType,
    installedAt: new Date().toISOString(),
    includeAgentsMd,
  };
  for (const category of LOCK_CATEGORIES) {
    const entries = {};
    for (const id of selections[category] || []) {
      if (await isRemoved(category, id)) continue;
      const files = {};
      for (const [path, checksum] of Object.entries(options.managedFiles)) {
        const owner = options.fileOwners[path];
        if (owner?.category === category && owner?.id === id) files[path] = checksum;
      }
      entries[id] = {
        source,
        sourceType: 'bundled',
        itemPath: itemSourcePath(category, id),
        computedHash: buildComputedHash(files, id),
        files,
      };
    }
    lockData[category] = entries;
  }
  const generated = {};
  for (const [path, checksum] of Object.entries(options.managedFiles)) {
    if (options.fileOwners[path]?.generated) generated[path] = { computedHash: checksum };
  }
  lockData.generated = generated;
  await writeFile(resolve(absTarget, 'system-prompt-lock.json'), JSON.stringify(lockData, null, 2));
  return absTarget;
}

function resolveSource(subpath) {
  return resolve(packageRoot, subpath);
}

async function isRemoved(category, id) {
  const catConfig = categories[category];
  if (!catConfig) return false;
  const item = catConfig.items.find(i => i.id === id);
  return item?.removed === true;
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
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      // MCPs may not provide an environment example.
    }
  }
  return combined;
}

async function writeMergedEnv(absTarget, examples, options) {
  if (examples.size === 0) return;

  const envPath = resolve(absTarget, '.env');
  await assertSafeDestination(options.targetDir, envPath);
  const existing = new Map();
  let existingContent = '';

  try {
    existingContent = await readFile(envPath, 'utf-8');
    const parsed = parseEnv(existingContent);
    for (const [key, value] of parsed) existing.set(key, value);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const additions = [];
  for (const [key, value] of examples) {
    if (!existing.has(key)) additions.push(`${key}=${value}`);
  }

  if (additions.length === 0) return;
  const separator = existingContent && !existingContent.endsWith('\n') ? '\n' : '';
  const content = Buffer.from(`${existingContent}${separator}${additions.join('\n')}\n`);
  if (!options.dryRun) await writeFile(envPath, content);
  options.managedFiles['.env'] = hash(content);
  options.fileOwners['.env'] = { generated: true };
}
