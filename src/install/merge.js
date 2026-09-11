import { readFile } from 'node:fs/promises';

import { isMissing } from '../paths.js';
import { writeManagedFile } from './files.js';
import { OPENCODE_GITIGNORE } from './templates.js';

export async function mergeJsonFile(destFile, generated, relativePath, options, previousGenerated = generated) {
  let existing = {};
  try {
    existing = JSON.parse(await readFile(destFile, 'utf-8'));
  } catch (error) {
    if (!isMissing(error)) {
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

export async function mergeGitignore(destFile, options) {
  let existing = '';
  try {
    existing = await readFile(destFile, 'utf-8');
  } catch (error) {
    if (!isMissing(error)) throw error;
  }
  const lines = new Set(existing.split('\n').filter(Boolean));
  for (const line of OPENCODE_GITIGNORE.split('\n').filter(Boolean)) lines.add(line);
  return writeManagedFile(destFile, Buffer.from(`${[...lines].join('\n')}\n`), '.gitignore', {
    ...options,
    allowExistingMerge: !options.oldLock,
  }, { generated: true });
}
