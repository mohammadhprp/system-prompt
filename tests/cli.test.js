import test from 'node:test';
import assert from 'node:assert/strict';

import { parseArgs, initialItemValues, shouldPreselectAll } from '../src/cli.js';

test('parseArgs supports non-interactive installation options', () => {
  const options = parseArgs([
    '--target', 'config',
    '--skills=security-best-practices,taste',
    '--commands', 'review,pr',
    '--dry-run',
    '--force',
    '--no-agents-md',
  ]);

  assert.equal(options.targetDir, 'config');
  assert.deepEqual(options.selections.skills, ['security-best-practices', 'taste']);
  assert.deepEqual(options.selections.commands, ['review', 'pr']);
  assert.equal(options.dryRun, true);
  assert.equal(options.force, true);
  assert.equal(options.includeAgentsMd, false);
  assert.equal(options.nonInteractive, true);
});

test('parseArgs rejects unknown options', () => {
  assert.throws(() => parseArgs(['--unknown']), /Unknown option/);
});

test('parseArgs rejects missing target values', () => {
  assert.throws(() => parseArgs(['--target']), /Missing value for --target/);
  assert.throws(() => parseArgs(['--target', '--doctor']), /Missing value for --target/);
});

test('initialItemValues keeps only visible previously installed items', () => {
  const visible = [{ id: 'a' }, { id: 'b' }];
  assert.deepEqual(initialItemValues(visible, ['b', 'retired']), ['b']);
});

test('shouldPreselectAll defaults to all when few items and no previous install', () => {
  assert.equal(shouldPreselectAll([{ id: 'a' }], []), true);
  const many = Array.from({ length: 20 }, (_, index) => ({ id: String(index) }));
  assert.equal(shouldPreselectAll(many, []), false);
});

test('shouldPreselectAll follows the previous installation on re-run', () => {
  const visible = [{ id: 'a' }, { id: 'b' }];
  assert.equal(shouldPreselectAll(visible, ['a']), false);
  assert.equal(shouldPreselectAll(visible, ['a', 'b']), true);
});
