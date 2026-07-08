import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';

import { categories } from '../src/catalog.js';

const packageRoot = resolve(import.meta.dirname, '..');

test('catalog entries point to framework content', async () => {
  for (const [category, config] of Object.entries(categories)) {
    assert.ok(config.title, `${category} has a title`);
    assert.ok(config.sourceDir, `${category} has a sourceDir`);
    assert.ok(config.items.length > 0, `${category} has items`);

    for (const item of config.items) {
      assert.ok(item.id, `${category} item has an id`);
      assert.ok(item.name, `${category}:${item.id} has a name`);
      assert.ok(item.description, `${category}:${item.id} has a description`);

      const suffix = ['agents', 'commands', 'standards', 'templates', 'modes'].includes(category) ? `${item.id}.md` : item.id;
      await access(resolve(packageRoot, config.sourceDir, suffix));
    }
  }
});
