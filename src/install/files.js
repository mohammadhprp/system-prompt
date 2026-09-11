import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { categories } from '../catalog.js';
import { hash } from '../hash.js';
import {
  isCopyable,
  isFileBased,
  isRemoved,
  itemRelativePath,
  itemSourcePath,
  targetSubdir,
} from '../item-layout.js';
import { assertSafeDestination, isMissing, resolveSource } from '../paths.js';
import { status } from '../ui.js';
import { getExpectedHash } from './lock.js';

async function canWrite(destFile, relativePath, oldLock, force) {
  if (force) return true;
  try {
    const existing = await readFile(destFile);
    const previousHash = getExpectedHash(oldLock, relativePath);
    return Boolean(previousHash && previousHash === hash(existing));
  } catch (error) {
    if (isMissing(error)) return true;
    throw error;
  }
}

export async function writeManagedFile(destFile, content, relativePath, options, owner) {
  await assertSafeDestination(options.targetDir, destFile);
  if (!options.allowExistingMerge && !(await canWrite(destFile, relativePath, options.oldLock, options.force))) {
    console.warn(status('warn', `Preserving existing file: ${relativePath}`));
    return false;
  }
  if (!options.dryRun) await mkdir(dirname(destFile), { recursive: true });
  if (!options.dryRun) await writeFile(destFile, content);
  options.managedFiles[relativePath] = hash(content);
  if (owner) options.fileOwners[relativePath] = owner;
  return true;
}

async function copyDir(src, dest, relativeDir, options, owner) {
  if (!options.dryRun) await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);
    const relativePath = `${relativeDir}/${entry.name}`;

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, relativePath, options, owner);
    } else if (entry.isFile()) {
      const content = await readFile(srcPath);
      await writeManagedFile(destPath, content, relativePath, options, owner);
    }
  }
}

export async function copySelectedDirs(targetDir, category, selectedIds, options) {
  const catConfig = categories[category];
  if (!catConfig || !selectedIds?.length) return;

  const destParent = resolve(targetDir, targetSubdir(catConfig.sourceDir));

  for (const id of selectedIds) {
    if (isRemoved(category, id)) continue;

    const source = itemSourcePath(category, id);
    const srcPath = resolveSource(source);
    const destPath = resolve(destParent, id);
    await assertSafeDestination(targetDir, destPath);

    try {
      await stat(srcPath);
      await copyDir(srcPath, destPath, itemRelativePath(category, id), options, { category, id });
    } catch (error) {
      if (isMissing(error)) {
        console.warn(status('warn', `Source not found: ${source}`));
        continue;
      }
      throw error;
    }
  }
}

export async function copySelectedFiles(targetDir, category, selectedIds, options) {
  const catConfig = categories[category];
  if (!catConfig || !selectedIds?.length) return;

  const destParent = resolve(targetDir, targetSubdir(catConfig.sourceDir));
  if (!options.dryRun) await mkdir(destParent, { recursive: true });

  for (const id of selectedIds) {
    if (isRemoved(category, id)) continue;

    const source = itemSourcePath(category, id);
    const relativePath = itemRelativePath(category, id);
    const destFile = resolve(targetDir, relativePath);
    await assertSafeDestination(targetDir, destFile);
    try {
      const content = await readFile(resolveSource(source));
      await writeManagedFile(destFile, content, relativePath, options, { category, id });
    } catch (error) {
      if (isMissing(error)) {
        console.warn(status('warn', `Source not found: ${source}`));
        continue;
      }
      throw error;
    }
  }
}

export async function deleteSelectedItems(absTarget, category, ids, oldLock, force, dryRun) {
  if (!categories[category] || !ids?.length || !isCopyable(category)) return;

  for (const id of ids) {
    const relativePath = itemRelativePath(category, id);
    const destPath = resolve(absTarget, relativePath);
    await assertSafeDestination(absTarget, destPath);
    if (!force && oldLock) {
      const managedEntries = Object.entries(oldLock?.[category]?.[id]?.files || {});
      if (managedEntries.length === 0) {
        console.warn(status('warn', `Preserving unmanaged item: ${relativePath}`));
        continue;
      }
      let modified = false;
      for (const [path, checksum] of managedEntries) {
        await assertSafeDestination(absTarget, resolve(absTarget, path));
        try {
          if (hash(await readFile(resolve(absTarget, path))) !== checksum) modified = true;
        } catch (error) {
          if (!isMissing(error)) throw error;
        }
      }
      if (modified) {
        console.warn(status('warn', `Preserving modified item: ${relativePath}`));
        continue;
      }
      if (!isFileBased(category)) {
        if (!dryRun) {
          for (const [path] of managedEntries) await rm(resolve(absTarget, path), { force: true });
        }
        continue;
      }
    }
    if (!dryRun) await rm(destPath, { recursive: true, force: true });
  }
}
