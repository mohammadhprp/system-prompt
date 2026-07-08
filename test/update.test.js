import test from 'node:test';
import assert from 'node:assert/strict';

import { findNewItems, findDeprecatedItems, findRemovedItems, mergeNewSelections, stripRemoved } from '../src/update.js';

test('findNewItems returns new-flagged items not already installed', () => {
  const items = findNewItems({ commands: ['release'], mcps: ['playwright-mcp'] });
  const values = items.map(item => item.value);

  assert.equal(values.includes('commands:release'), false, 'already installed release should be excluded');
  assert.equal(values.includes('mcps:playwright-mcp'), false, 'already installed playwright-mcp should be excluded');
  assert.ok(values.includes('modes:audit'), 'unreleased modes:audit should be surfaced as new');
  assert.equal(items.filter(i => i.value === 'modes:audit').length, 1, 'each new item appears once');
});

test('findDeprecatedItems returns deprecated items that are installed', () => {
  const items = findDeprecatedItems({});
  assert.equal(items.length, 0, 'no deprecated items currently flagged');
});

test('findRemovedItems returns removed items that are installed', () => {
  const items = findRemovedItems({});
  assert.equal(items.length, 0, 'no removed items currently flagged');
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

test('stripRemoved removes flagged items from selections', () => {
  const selections = { commands: ['review', 'release'], mcps: ['playwright-mcp'] };
  const next = stripRemoved(selections);

  assert.deepEqual(next, selections, 'no removed items flagged, selections unchanged');
});
