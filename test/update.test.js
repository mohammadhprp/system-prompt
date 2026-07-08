import test from 'node:test';
import assert from 'node:assert/strict';

import { findNewItems, mergeNewSelections } from '../src/update.js';

test('findNewItems returns configured new items not already installed', () => {
  const items = findNewItems({ commands: ['release'] });
  const values = items.map(item => item.value);

  assert.equal(values.includes('commands:release'), false);
  assert.equal(values.includes('mcps:playwright-mcp'), true);
});

test('mergeNewSelections appends picked items without mutating existing selections', () => {
  const selections = { commands: ['review'] };
  const newItems = [
    { value: 'commands:release', cat: 'commands', id: 'release' },
    { value: 'mcps:playwright-mcp', cat: 'mcps', id: 'playwright-mcp' },
  ];

  const next = mergeNewSelections(selections, newItems, ['commands:release', 'mcps:playwright-mcp']);

  assert.deepEqual(next, {
    commands: ['review', 'release'],
    mcps: ['playwright-mcp'],
  });
  assert.deepEqual(selections, { commands: ['review'] });
});
