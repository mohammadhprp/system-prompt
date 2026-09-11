import test from 'node:test';
import assert from 'node:assert/strict';

import { categories } from '../src/catalog.js';
import {
  LOCK_CATEGORIES,
  isFileBased,
  isCopyable,
  itemSourcePath,
  itemRelativePath,
  targetSubdir,
} from '../src/item-layout.js';

test('LOCK_CATEGORIES derives from the catalog', () => {
  assert.deepEqual(LOCK_CATEGORIES, Object.keys(categories));
});

test('isFileBased distinguishes file and directory categories', () => {
  assert.equal(isFileBased('agents'), true);
  assert.equal(isFileBased('commands'), true);
  assert.equal(isFileBased('skills'), false);
  assert.equal(isFileBased('styles'), false);
  assert.equal(isFileBased('unknown'), false);
});

test('isCopyable excludes config-only categories', () => {
  assert.equal(isCopyable('skills'), true);
  assert.equal(isCopyable('agents'), true);
  assert.equal(isCopyable('mcps'), false);
  assert.equal(isCopyable('plugins'), false);
  assert.equal(isCopyable('unknown'), false);
});

test('itemSourcePath and itemRelativePath follow the category layout', () => {
  assert.equal(itemSourcePath('agents', 'reviewer'), 'framework/agents/reviewer.md');
  assert.equal(itemRelativePath('agents', 'reviewer'), 'agents/reviewer.md');
  assert.equal(itemSourcePath('skills', 'adhd'), 'framework/skills/adhd');
  assert.equal(itemRelativePath('skills', 'adhd'), 'skills/adhd');
  assert.equal(itemSourcePath('standards', 'security'), 'framework/references/standards/security.md');
  assert.equal(itemRelativePath('standards', 'security'), 'references/standards/security.md');
  assert.equal(itemSourcePath('mcps', 'playwright-mcp'), 'framework/mcps/playwright-mcp');
  assert.equal(itemRelativePath('mcps', 'playwright-mcp'), 'mcps/playwright-mcp');
});

test('targetSubdir strips the framework prefix', () => {
  assert.equal(targetSubdir('framework/skills'), 'skills');
  assert.equal(targetSubdir('framework/references/standards'), 'references/standards');
  assert.equal(targetSubdir('other/path'), 'other/path');
});
