import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { categories } from '../src/catalog.js';

const packageRoot = resolve(import.meta.dirname, '..');

async function markdownFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
  }
  return files;
}

test('catalog entries point to framework content', async () => {
  for (const [category, config] of Object.entries(categories)) {
    assert.ok(config.title, `${category} has a title`);
    assert.ok(config.sourceDir, `${category} has a sourceDir`);
    assert.ok(config.items.length > 0, `${category} has items`);

    for (const item of config.items) {
      assert.ok(item.id, `${category} item has an id`);
      assert.ok(item.name, `${category}:${item.id} has a name`);
      assert.ok(item.description, `${category}:${item.id} has a description`);

      const suffix = ['agents', 'commands', 'memory', 'standards', 'templates', 'modes'].includes(category) ? `${item.id}.md` : item.id;
      await access(resolve(packageRoot, config.sourceDir, suffix));
    }
  }
});

test('catalog IDs are unique and framework markdown links resolve', async () => {
  for (const [category, config] of Object.entries(categories)) {
    const ids = config.items.map(item => item.id);
    assert.equal(new Set(ids).size, ids.length, `${category} has duplicate IDs`);
  }

  const files = await markdownFiles(resolve(packageRoot, 'framework'));
  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    for (const match of content.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
      const link = match[1];
      if (/^(https?:|mailto:)/.test(link)) continue;
      if (file.endsWith('/codenavi/references/notebook-spec.md')) continue;
      if (/[{}]/.test(link)) continue;
      await access(resolve(dirname(file), link));
    }
  }
});

test('subagents deny write access', async () => {
  const files = await readdir(resolve(packageRoot, 'framework/agents'));
  for (const file of files.filter(name => name.endsWith('.md') && name !== 'README.md')) {
    const content = await readFile(resolve(packageRoot, 'framework/agents', file), 'utf-8');
    assert.match(content, /\n  write: deny\n/, `${file} must be read-only`);
  }
});

test('MCP environment examples match referenced environment variables', async () => {
  const mcps = await readdir(resolve(packageRoot, 'framework/mcps'), { withFileTypes: true });
  for (const entry of mcps.filter(item => item.isDirectory())) {
    const configPath = resolve(packageRoot, 'framework/mcps', entry.name, 'configs/opencode.json');
    const envPath = resolve(packageRoot, 'framework/mcps', entry.name, 'configs/.env.example');
    let config;
    let env;
    try {
      config = await readFile(configPath, 'utf-8');
      env = await readFile(envPath, 'utf-8');
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    const variables = [...config.matchAll(/\{env:([A-Z0-9_]+)\}/g)].map(match => match[1]);
    for (const variable of variables) assert.match(env, new RegExp(`^${variable}=`, 'm'), `${entry.name} is missing ${variable}`);
  }
});
