import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { multiselect, isCancel, outro } from '@clack/prompts';

import { categories } from './catalog.js';
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

export function findNewItems(selections) {
  const items = [];

  for (const [cat, config] of Object.entries(categories)) {
    for (const item of config.items) {
      if (!item.new) continue;

      const installed = new Set(selections?.[cat] || []);
      if (installed.has(item.id)) continue;

      items.push({
        value: `${cat}:${item.id}`,
        label: `${config.title}: ${item.name}`,
        hint: item.description,
        cat,
        id: item.id,
      });
    }
  }

  return items;
}

export function findDeprecatedItems(selections) {
  const items = [];

  for (const [cat, config] of Object.entries(categories)) {
    for (const item of config.items) {
      if (!item.deprecated) continue;

      const installed = new Set(selections?.[cat] || []);
      if (!installed.has(item.id)) continue;

      items.push({ cat, id: item.id, name: item.name, title: config.title });
    }
  }

  return items;
}

export function findRemovedItems(selections) {
  const items = [];

  for (const [cat, config] of Object.entries(categories)) {
    for (const item of config.items) {
      if (!item.removed) continue;

      const installed = new Set(selections?.[cat] || []);
      if (!installed.has(item.id)) continue;

      items.push({ cat, id: item.id, name: item.name, title: config.title });
    }
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

export function stripRemoved(selections) {
  const removed = findRemovedItems(selections);
  if (!removed.length) return selections;

  const removedByCat = {};
  for (const r of removed) {
    (removedByCat[r.cat] = removedByCat[r.cat] || new Set()).add(r.id);
  }

  const next = {};
  for (const [cat, ids] of Object.entries(selections || {})) {
    const set = removedByCat[cat];
    if (!set) {
      next[cat] = [...ids];
    } else {
      next[cat] = ids.filter(id => !set.has(id));
    }
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

  const deprecated = findDeprecatedItems(nextSelections);
  for (const d of deprecated) {
    console.log(`  ⚠  ${d.title}: ${d.name} is deprecated. Consider migrating to an alternative.`);
  }

  const removed = findRemovedItems(nextSelections);
  if (removed.length) {
    for (const r of removed) {
      console.log(`  ✗  ${r.title}: ${r.name} has been removed. Cleaning up from lock file.`);
    }
    nextSelections = stripRemoved(nextSelections);
  }

  if (deprecated.length || removed.length) console.log();

  const absTarget = await install({
    targetDir: targetDir || '.opencode',
    agentType: agentType || 'opencode',
    selections: nextSelections,
  });

  const fileCount = Object.values(nextSelections).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  console.log(`\nUpdated ${fileCount} components in ${absTarget}`);
}
