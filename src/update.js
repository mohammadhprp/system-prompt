import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { multiselect, isCancel, outro } from '@clack/prompts';

import { categories } from './catalog.js';
import { install } from './installer.js';
import newFrameworkItems from './new-framework-items.json' with { type: 'json' };

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

export function findNewItems(selections) {
  const items = [];

  for (const entry of newFrameworkItems) {
    const cat = entry.category;
    const id = entry.id;
    const config = categories[cat];
    if (!config || !id) continue;

    const installed = new Set(selections?.[cat] || []);
    if (installed.has(id)) continue;

    const item = config.items.find(candidate => candidate.id === id);
    if (!item) continue;

    items.push({
      value: `${cat}:${id}`,
      label: `${config.title}: ${item.name}`,
      hint: item.description,
      cat,
      id,
    });
  }

  return items;
}

export function mergeNewSelections(selections, newItems, selectedValues) {
  const next = Object.fromEntries(
    Object.entries(selections || {}).map(([cat, ids]) => [cat, [...(ids || [])]])
  );
  const byValue = new Map(newItems.map(item => [item.value, item]));

  for (const value of selectedValues || []) {
    const item = byValue.get(value);
    if (!item) continue;
    next[item.cat] = next[item.cat] || [];
    if (!next[item.cat].includes(item.id)) next[item.cat].push(item.id);
  }

  return next;
}

export async function update() {
  const lock = await findLockFile();
  if (!lock) {
    console.error('No system-prompt--lock.json found. Run `system-prompt` first to install.');
    process.exit(1);
  }

  const { agentType, targetDir, selections } = lock.data;
  const newItems = findNewItems(selections || {});
  let nextSelections = selections || {};

  if (newItems.length) {
    const picked = await multiselect({
      message: 'New framework components are available. Select any to add:',
      options: newItems,
      required: false,
    });
    if (isCancel(picked)) {
      outro('Update cancelled.');
      process.exit(0);
    }
    nextSelections = mergeNewSelections(nextSelections, newItems, picked);
  }

  const absTarget = await install({
    targetDir: targetDir || '.opencode',
    agentType: agentType || 'opencode',
    selections: nextSelections,
  });

  const fileCount = Object.values(nextSelections).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  console.log(`\nUpdated ${fileCount} components in ${absTarget}`);
}
