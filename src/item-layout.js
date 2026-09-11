import { categories } from './catalog.js';

export const LOCK_CATEGORIES = Object.keys(categories);

export function isFileBased(category) {
  return categories[category]?.itemLayout === 'file';
}

export function isCopyable(category) {
  const config = categories[category];
  return Boolean(config?.itemLayout) && config.copyItems !== false;
}

export function targetSubdir(sourceDir) {
  return sourceDir.replace(/^framework\//, '');
}

export function itemSourcePath(category, id) {
  const config = categories[category];
  return isFileBased(category) ? `${config.sourceDir}/${id}.md` : `${config.sourceDir}/${id}`;
}

export function itemRelativePath(category, id) {
  const dir = targetSubdir(categories[category].sourceDir);
  return isFileBased(category) ? `${dir}/${id}.md` : `${dir}/${id}`;
}

export function isRemoved(category, id) {
  const item = categories[category]?.items.find(entry => entry.id === id);
  return item?.removed === true;
}
