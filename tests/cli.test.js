import test from 'node:test';
import assert from 'node:assert/strict';

import { parseArgs } from '../src/cli.js';

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
