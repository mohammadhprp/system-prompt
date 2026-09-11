import { categories } from '../catalog.js';
import { lockToSelections } from '../install/lock.js';

export function computeDiff(oldLock, selections) {
  const oldSels = lockToSelections(oldLock);
  const added = {};
  const removed = {};
  const kept = {};

  const allCats = [...new Set([...Object.keys(oldSels), ...Object.keys(selections)])];

  for (const cat of allCats) {
    const catConfig = categories[cat] || null;
    const oldIds = new Set(oldSels[cat] || []);
    const newIds = new Set(selections[cat] || []);

    const addedIds = [...newIds].filter(id => !oldIds.has(id));
    const removedIds = [...oldIds].filter(id => !newIds.has(id));
    const keptIds = [...newIds].filter(id => oldIds.has(id));

    if (addedIds.length) added[cat] = { config: catConfig, ids: addedIds };
    if (removedIds.length) removed[cat] = { config: catConfig, ids: removedIds };
    if (keptIds.length) kept[cat] = { config: catConfig, ids: keptIds };
  }

  return { added, removed, kept };
}

export function formatDiff(diff) {
  const sections = [
    ['+ Added', diff.added],
    ['- Removed', diff.removed],
    ['~ Unchanged', diff.kept],
  ];
  const lines = [];

  for (const [label, group] of sections) {
    const entries = Object.entries(group);
    if (!entries.length) continue;
    if (lines.length) lines.push('');
    lines.push(`  ${label}:`);
    for (const [cat, data] of entries) {
      lines.push(`    ${data.config?.title || cat}: ${itemNames(data.config, data.ids).join(', ')}`);
    }
  }

  return lines.join('\n');
}

export function initialItemValues(visibleItems, existingIds = []) {
  const visible = new Set(visibleItems.map(item => item.id));
  return existingIds.filter(id => visible.has(id));
}

export function shouldPreselectAll(visibleItems, existingIds = []) {
  if (existingIds.length) return existingIds.length === visibleItems.length;
  return visibleItems.length <= 12;
}

export function buildSummary(selections) {
  const lines = [];
  for (const [cat, ids] of Object.entries(selections)) {
    if (!ids?.length) continue;
    const catConfig = categories[cat];
    lines.push(`• ${catConfig?.title || cat}: ${itemNames(catConfig, ids).join(', ')}`);
  }
  return lines.join('\n');
}

export function generatedFiles(selections, includeAgentsMd) {
  const files = [];
  if (includeAgentsMd) files.push('AGENTS.md');
  files.push('opencode.json', 'tui.json', '.gitignore');
  if (selections.mcps?.length) files.push('.env');
  if (selections.memory?.length) files.push('memory/');
  return files;
}

export function fileList(files) {
  return files.map(file => `• ${file}`).join('\n');
}

function itemNames(config, ids) {
  return ids.map(id => config?.items?.find(item => item.id === id)?.name || id);
}
