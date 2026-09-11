import test from 'node:test';
import assert from 'node:assert/strict';

import { colorEnabled, status } from '../src/ui.js';

test('status renders a symbol and message when color is disabled', () => {
  assert.equal(status('success', 'Done.', { enabled: false }), '✓ Done.');
  assert.equal(status('info', 'Working', { enabled: false }), '› Working');
  assert.equal(status('warn', 'Careful', { enabled: false }), '! Careful');
  assert.equal(status('error', 'Failed', { enabled: false }), '✗ Failed');
});

test('status colors the symbol when enabled', () => {
  assert.equal(status('success', 'Done.', { enabled: true }), '\u001b[32m✓\u001b[0m Done.');
});

test('status falls back to the info style for unknown kinds', () => {
  assert.equal(status('unknown', 'Hello', { enabled: false }), '› Hello');
});

test('colorEnabled honors NO_COLOR, FORCE_COLOR, and TTY detection', () => {
  const originalNoColor = process.env.NO_COLOR;
  const originalForceColor = process.env.FORCE_COLOR;
  try {
    delete process.env.NO_COLOR;
    delete process.env.FORCE_COLOR;
    assert.equal(colorEnabled({ isTTY: true }), true);
    assert.equal(colorEnabled({ isTTY: false }), false);
    assert.equal(colorEnabled({}), false);

    process.env.NO_COLOR = '1';
    assert.equal(colorEnabled({ isTTY: true }), false);

    delete process.env.NO_COLOR;
    process.env.FORCE_COLOR = '1';
    assert.equal(colorEnabled({ isTTY: false }), true);

    process.env.FORCE_COLOR = '0';
    assert.equal(colorEnabled({ isTTY: false }), false);
  } finally {
    if (originalNoColor === undefined) delete process.env.NO_COLOR;
    else process.env.NO_COLOR = originalNoColor;
    if (originalForceColor === undefined) delete process.env.FORCE_COLOR;
    else process.env.FORCE_COLOR = originalForceColor;
  }
});
