import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

import { install } from './installer.js';

const LOCK_FILENAME = 'system-prompt--lock.json';

async function findLockFile() {
  const candidates = [
    resolve(process.cwd(), '.opencode', LOCK_FILENAME),
    resolve(process.cwd(), LOCK_FILENAME),
  ];
  for (const path of candidates) {
    try {
      const raw = await readFile(path, 'utf-8');
      return { path, data: JSON.parse(raw) };
    } catch {
      continue;
    }
  }
  return null;
}

export async function update() {
  const lock = await findLockFile();
  if (!lock) {
    console.error('No system-prompt--lock.json found. Run `system-prompt` first to install.');
    process.exit(1);
  }

  const { agentType, targetDir, selections } = lock.data;

  const absTarget = await install({
    targetDir: targetDir || '.opencode',
    agentType: agentType || 'opencode',
    selections: selections || {},
  });

  const fileCount = Object.values(selections || {}).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  console.log(`\nUpdated ${fileCount} components in ${absTarget}`);
}