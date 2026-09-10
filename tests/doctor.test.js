import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { install } from '../src/installer.js';
import { inspectInstallation } from '../src/doctor.js';

test('doctor reports modified managed files', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);
    const target = await install({
      targetDir: '.opencode',
      agentType: 'opencode',
      selections: { commands: ['summarize-changes'] },
      includeAgentsMd: false,
    });
    const commandPath = join(target, 'commands/summarize-changes.md');
    await writeFile(commandPath, `${await readFile(commandPath, 'utf-8')}\nUser change\n`);

    const result = await inspectInstallation('.opencode');
    assert.ok(result.issues.some(issue => issue.includes('Modified managed file: commands/summarize-changes.md')));
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});
