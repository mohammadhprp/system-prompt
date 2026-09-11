import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { lstat, readFile } from 'node:fs/promises';

const moduleDir = dirname(fileURLToPath(import.meta.url));

export const packageRoot = resolve(moduleDir, '..');

export function resolveSource(subpath) {
  return resolve(packageRoot, subpath);
}

export async function getPackageVersion() {
  try {
    const pkg = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf-8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export function isMissing(error) {
  return error?.code === 'ENOENT';
}

function isInside(parent, child) {
  const relativePath = relative(parent, child);
  return relativePath === '' || (!relativePath.startsWith('../') && relativePath !== '..' && !isAbsolute(relativePath));
}

export function assertSafePath(targetDir, path) {
  if (!isInside(targetDir, path)) {
    throw new Error(`Refusing to access path outside installation directory: ${path}`);
  }
}

export async function assertSafeDestination(targetDir, path) {
  assertSafePath(targetDir, path);
  try {
    if ((await lstat(targetDir)).isSymbolicLink()) {
      throw new Error(`Refusing to install through symlink target: ${targetDir}`);
    }
  } catch (error) {
    if (!isMissing(error)) throw error;
  }
  const relativePath = relative(targetDir, path);
  let current = targetDir;
  for (const part of relativePath.split('/').filter(Boolean)) {
    current = resolve(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink()) {
        throw new Error(`Refusing to access symlink inside installation directory: ${current}`);
      }
    } catch (error) {
      if (isMissing(error)) break;
      throw error;
    }
  }
}
