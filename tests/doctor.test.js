import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { install } from '../src/install/index.js';
import { doctor, inspectInstallation } from '../src/doctor.js';
import { withWorkspace } from './helpers/workspace.js';

const SELECTIONS = { commands: ['summarize-changes'] };

async function healthyInstall() {
  return install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: SELECTIONS,
    includeAgentsMd: true,
  });
}

test('doctor reports no issues for a healthy installation', () => withWorkspace(async () => {
  await healthyInstall();
  const result = await inspectInstallation('.opencode');
  assert.deepEqual(result.issues, []);
}));

test('doctor reports a missing lock file', () => withWorkspace(async () => {
  const result = await inspectInstallation('.opencode');
  assert.deepEqual(result.issues, ['No system-prompt-lock.json found.']);
}));

test('doctor reports a malformed lock file', () => withWorkspace(async () => {
  const target = await healthyInstall();
  await writeFile(join(target, 'system-prompt-lock.json'), '{ not valid json');

  const result = await inspectInstallation('.opencode');
  assert.equal(result.issues.length, 1);
  assert.match(result.issues[0], /system-prompt-lock\.json/);
}));

test('doctor reports modified managed files', () => withWorkspace(async () => {
  const target = await healthyInstall();
  const commandPath = join(target, 'commands/summarize-changes.md');
  await writeFile(commandPath, `${await readFile(commandPath, 'utf-8')}\nUser change\n`);

  const result = await inspectInstallation('.opencode');
  assert.ok(result.issues.some(issue => issue === 'Modified managed file: commands/summarize-changes.md'));
}));

test('doctor reports missing managed files', () => withWorkspace(async () => {
  const target = await healthyInstall();
  await rm(join(target, 'commands/summarize-changes.md'));

  const result = await inspectInstallation('.opencode');
  assert.ok(result.issues.some(issue => issue === 'Missing managed file: commands/summarize-changes.md'));
}));

test('doctor reports invalid generated JSON', () => withWorkspace(async () => {
  const target = await healthyInstall();
  await writeFile(join(target, 'opencode.json'), '{ nope');

  const result = await inspectInstallation('.opencode');
  assert.ok(result.issues.some(issue => issue === 'Invalid JSON: opencode.json'));
}));

test('doctor prints a success status for a healthy installation', () => withWorkspace(async () => {
  await healthyInstall();
  const lines = [];

  const healthy = await doctor('.opencode', line => lines.push(line));

  assert.equal(healthy, true);
  assert.ok(lines.some(line => line.includes('Checking ')));
  assert.ok(lines.some(line => line.includes('No issues found.')));
}));

test('doctor prints an issue count and each issue', () => withWorkspace(async () => {
  const lines = [];

  const healthy = await doctor('.opencode', line => lines.push(line));

  assert.equal(healthy, false);
  assert.ok(lines.some(line => line.includes('1 issue found:')));
  assert.ok(lines.some(line => line.includes('No system-prompt-lock.json found.')));
}));
