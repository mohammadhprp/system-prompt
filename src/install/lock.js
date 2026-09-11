import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { categories } from '../catalog.js';
import { hash } from '../hash.js';
import { LOCK_CATEGORIES, isRemoved, itemSourcePath } from '../item-layout.js';
import { isMissing } from '../paths.js';

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

export function getExpectedHash(oldLock, relativePath) {
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

export async function loadLockFile(absTarget) {
  try {
    const content = await readFile(resolve(absTarget, 'system-prompt-lock.json'), 'utf-8');
    const lock = JSON.parse(content);
    validateLock(lock);
    return lock;
  } catch (error) {
    if (isMissing(error)) return null;
    if (error instanceof SyntaxError || error.message?.startsWith('Invalid system-prompt lock')) {
      throw new Error(`${error.message}. Remove or repair system-prompt-lock.json before reinstalling.`);
    }
    throw error;
  }
}

export function validateLock(lock) {
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

export function createLockData({ agentType, includeAgentsMd, selections, managedFiles, fileOwners, source }) {
  const lockData = {
    version: LOCK_VERSION,
    agentType,
    installedAt: new Date().toISOString(),
    includeAgentsMd,
  };
  for (const category of LOCK_CATEGORIES) {
    const entries = {};
    for (const id of selections[category] || []) {
      if (isRemoved(category, id)) continue;
      const files = {};
      for (const [path, checksum] of Object.entries(managedFiles)) {
        const owner = fileOwners[path];
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
  for (const [path, checksum] of Object.entries(managedFiles)) {
    if (fileOwners[path]?.generated) generated[path] = { computedHash: checksum };
  }
  lockData.generated = generated;
  return lockData;
}

export async function writeLockFile(absTarget, lockData) {
  await writeFile(resolve(absTarget, 'system-prompt-lock.json'), JSON.stringify(lockData, null, 2));
}

function buildComputedHash(files, fallbackId) {
  const keys = Object.keys(files).sort();
  if (keys.length === 0) return hash(fallbackId);
  if (keys.length === 1) return files[keys[0]];
  return hash(keys.map(path => `${path}:${files[path]}`).join('\n'));
}
