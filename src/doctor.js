import { resolve } from 'node:path';
import { access, readFile } from 'node:fs/promises';

import { categories } from './catalog.js';
import { hash } from './hash.js';
import { itemRelativePath } from './item-layout.js';
import { loadLockFile, lockToSelections } from './install/lock.js';
import { isMissing } from './paths.js';
import { status } from './ui.js';

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function checkManagedFile(absTarget, relativePath, expectedHash, issues) {
  try {
    const actual = hash(await readFile(resolve(absTarget, relativePath)));
    if (actual !== expectedHash) issues.push(`Modified managed file: ${relativePath}`);
  } catch (error) {
    if (isMissing(error)) issues.push(`Missing managed file: ${relativePath}`);
    else throw error;
  }
}

export async function inspectInstallation(targetDir) {
  const absTarget = resolve(process.cwd(), targetDir);
  const issues = [];
  let lock;

  try {
    lock = await loadLockFile(absTarget);
  } catch (error) {
    issues.push(error.message);
    return { targetDir: absTarget, issues };
  }

  if (!lock) {
    issues.push('No system-prompt-lock.json found.');
    return { targetDir: absTarget, issues };
  }

  for (const [path, entry] of Object.entries(lock.generated || {})) {
    await checkManagedFile(absTarget, path, entry.computedHash, issues);
  }

  for (const [category, entries] of Object.entries(lock)) {
    if (!categories[category]) continue;
    for (const entry of Object.values(entries)) {
      for (const [path, expected] of Object.entries(entry.files || {})) {
        await checkManagedFile(absTarget, path, expected, issues);
      }
    }
  }

  for (const [category, ids] of Object.entries(lockToSelections(lock))) {
    const config = categories[category];
    for (const id of ids) {
      const item = config.items.find(entry => entry.id === id);
      if (!item || !(await exists(resolve(absTarget, itemRelativePath(category, id))))) {
        issues.push(`Missing installed ${category} item: ${id}`);
      }
    }
  }

  if (lock.agentType === 'opencode') {
    for (const file of ['opencode.json', 'tui.json']) {
      const path = resolve(absTarget, file);
      if (!(await exists(path))) {
        issues.push(`Missing generated file: ${file}`);
        continue;
      }
      try {
        JSON.parse(await readFile(path, 'utf-8'));
      } catch {
        issues.push(`Invalid JSON: ${file}`);
      }
    }
  }

  return { targetDir: absTarget, issues };
}

export async function doctor(targetDir = '.opencode', output = console.log) {
  const result = await inspectInstallation(targetDir);
  output(status('info', `Checking ${result.targetDir}`));
  if (result.issues.length === 0) {
    output(status('success', 'No issues found.'));
    return true;
  }
  output(status('error', `${result.issues.length} issue${result.issues.length === 1 ? '' : 's'} found:`));
  for (const issue of result.issues) output(`  ${status('warn', issue)}`);
  return false;
}
