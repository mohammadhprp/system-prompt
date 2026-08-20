import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

test('npm package contains the executable and framework payload', async () => {
  const { stdout } = await execFileAsync('npm', ['pack', '--dry-run', '--json'], { encoding: 'utf-8' });
  const report = JSON.parse(stdout);
  const files = new Set(report[0].files.map(file => file.path));

  assert.ok(files.has('bin/system-prompt.js'));
  assert.ok(files.has('src/installer.js'));
  assert.ok(files.has('framework/skills/backend-best-practices/SKILL.md'));
  assert.ok(files.has('framework/skills/great-interface/SKILL.md'));
  assert.equal([...files].some(file => file.includes('framework/skills/brand-guidelines/')), false);
  assert.equal([...files].some(file => file.startsWith('tests/')), false);
});
