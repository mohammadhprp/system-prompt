import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { hash } from '../hash.js';
import { assertSafeDestination, isMissing, resolveSource } from '../paths.js';

export async function collectMcpEnvExamples(mcpIds) {
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
      if (!isMissing(error)) throw error;
      // MCPs may not provide an environment example.
    }
  }
  return combined;
}

export async function writeMergedEnv(absTarget, examples, options) {
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
    if (!isMissing(error)) throw error;
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
