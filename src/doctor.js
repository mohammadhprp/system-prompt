import { resolve } from 'node:path';
import { access, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

import { categories } from './catalog.js';
import { loadLockFile } from './installer.js';

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
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

  for (const [path, expected] of Object.entries(lock.managedFiles || {})) {
    try {
      const actual = createHash('sha256').update(await readFile(resolve(absTarget, path))).digest('hex');
      if (actual !== expected) issues.push(`Modified managed file: ${path}`);
    } catch (error) {
      if (error.code === 'ENOENT') issues.push(`Missing managed file: ${path}`);
      else throw error;
    }
  }

  for (const [category, ids] of Object.entries(lock.selections)) {
    const config = categories[category];
    for (const id of ids) {
      const item = config.items.find(entry => entry.id === id);
      const relativePath = ['agents', 'commands', 'memory', 'modes', 'standards', 'templates'].includes(category)
        ? `${config.sourceDir.replace(/^framework\//, '')}/${id}.md`
        : `${config.sourceDir.replace(/^framework\//, '')}/${id}`;
      if (!item || !(await exists(resolve(absTarget, relativePath)))) {
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
  output(`Checking ${result.targetDir}`);
  if (result.issues.length === 0) {
    output('No issues found.');
    return true;
  }
  for (const issue of result.issues) output(`  ⚠  ${issue}`);
  return false;
}
