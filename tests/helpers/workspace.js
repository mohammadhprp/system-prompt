import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Runs `fn` from a fresh temporary directory and cleans up afterward, including
// any extra temp directories requested via `makeTemp`. Restores the original
// working directory even when the test throws.
export async function withWorkspace(fn) {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));
  const extras = [];

  const makeTemp = async (prefix = 'system-prompt-extra-') => {
    const dir = await mkdtemp(join(tmpdir(), prefix));
    extras.push(dir);
    return dir;
  };

  try {
    process.chdir(workspace);
    return await fn({ workspace, makeTemp });
  } finally {
    process.chdir(previousCwd);
    for (const dir of extras) await rm(dir, { recursive: true, force: true });
    await rm(workspace, { recursive: true, force: true });
  }
}
