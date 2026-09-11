import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import { categories } from '../catalog.js';
import { loadMcpConfigs } from '../config/mcp.js';
import { generateOpenCodeConfig } from '../config/opencode.js';
import { generateTuiConfig } from '../config/tui.js';
import { LOCK_CATEGORIES, isCopyable, isFileBased } from '../item-layout.js';
import { getPackageVersion } from '../paths.js';
import { collectMcpEnvExamples, writeMergedEnv } from './env.js';
import { copySelectedDirs, copySelectedFiles, deleteSelectedItems, writeManagedFile } from './files.js';
import { createLockData, lockToSelections, validateLock, writeLockFile } from './lock.js';
import { mergeGitignore, mergeJsonFile } from './merge.js';
import { AGENTS_MD } from './templates.js';

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
      const previousSelections = lockToSelections(oldLock);
      let previousMcpEntries = {};
      if (previousSelections.mcps?.length) previousMcpEntries = await loadMcpConfigs(previousSelections.mcps);
      previousOpenCodeConfig = JSON.parse(generateOpenCodeConfig({
        selections: previousSelections,
        mcpEntries: previousMcpEntries,
        includeAgentsMd: oldLock.includeAgentsMd ?? true,
      }));
      previousTuiConfig = JSON.parse(generateTuiConfig({ selections: previousSelections, preferences: tuiPreferences }));
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
  const lockData = createLockData({
    agentType,
    includeAgentsMd,
    selections,
    managedFiles: options.managedFiles,
    fileOwners: options.fileOwners,
    source: `system-prompt@${pkgVersion}`,
  });
  await writeLockFile(absTarget, lockData);
  return absTarget;
}
