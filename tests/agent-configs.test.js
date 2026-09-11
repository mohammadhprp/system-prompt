import test from 'node:test';
import assert from 'node:assert/strict';

import { generateOpenCodeConfig, generateTuiConfig, loadMcpConfigs, normalizeTuiPreferences, tuiPreferencesFromConfig } from '../src/agent-configs.js';

test('generateOpenCodeConfig includes selected plugins, references, and MCPs', () => {
  const config = JSON.parse(generateOpenCodeConfig({
    selections: {
      plugins: ['opencode-goal-plugin'],
      standards: ['security'],
      templates: ['adr'],
    },
    mcpEntries: {
      example: { type: 'local', command: ['node', 'server.js'] },
    },
  }));

  assert.equal(config.$schema, 'https://opencode.ai/config.json');
  assert.deepEqual(config.plugin, ['@prevalentware/opencode-goal-plugin']);
  assert.equal(config.references.standards.path, 'references/standards');
  assert.equal(config.references.templates.path, 'references/templates');
  assert.deepEqual(config.mcp.example, { type: 'local', command: ['node', 'server.js'] });
});

test('generateOpenCodeConfig includes memory glob in instructions when memory selected', () => {
  const config1 = JSON.parse(generateOpenCodeConfig({
    selections: { memory: ['codebase-insights'] },
    mcpEntries: {},
  }));
  assert.ok(config1.instructions.includes('.opencode/memory/*.md'));

  const config2 = JSON.parse(generateOpenCodeConfig({
    selections: {},
    mcpEntries: {},
  }));
  assert.equal(config2.instructions.includes('.opencode/memory/*.md'), false);
});

test('generateTuiConfig includes the goal plugin when selected', () => {
  const config = JSON.parse(generateTuiConfig({
    selections: { plugins: ['opencode-goal-plugin'] },
  }));

  assert.equal(config.$schema, 'https://opencode.ai/tui.json');
  assert.deepEqual(config.plugin, ['@prevalentware/opencode-goal-plugin']);
});

test('generateTuiConfig applies user preferences over defaults', () => {
  const config = JSON.parse(generateTuiConfig({
    selections: {},
    preferences: {
      theme: 'tokyonight',
      scroll_speed: 5,
      scroll_acceleration: false,
      diff_style: 'stacked',
      mouse: false,
      cursor: { style: 'line', blinking: false },
      attention: { enabled: false, sound: false, volume: 0.8 },
    },
  }));

  assert.equal(config.theme, 'tokyonight');
  assert.equal(config.scroll_speed, 5);
  assert.equal(config.scroll_acceleration.enabled, false);
  assert.equal(config.diff_style, 'stacked');
  assert.equal(config.mouse, false);
  assert.deepEqual(config.cursor, { style: 'line', blinking: false });
  assert.equal(config.attention.enabled, false);
  assert.equal(config.attention.sound, false);
  assert.equal(config.attention.volume, 0.8);
  assert.equal(config.attention.notifications, true);
});

test('normalizeTuiPreferences falls back on invalid values', () => {
  const prefs = normalizeTuiPreferences({
    theme: '',
    scroll_speed: -5,
    diff_style: 'bogus',
    cursor: { style: 'nope' },
    attention: { volume: 3 },
  });

  assert.equal(prefs.theme, 'system');
  assert.equal(prefs.scroll_speed, 3);
  assert.equal(prefs.diff_style, 'auto');
  assert.equal(prefs.cursor.style, 'block');
  assert.equal(prefs.attention.volume, 0.4);
});

test('tuiPreferencesFromConfig extracts only known settings', () => {
  const prefs = tuiPreferencesFromConfig({
    theme: 'nord',
    diff_style: 'stacked',
    scroll_acceleration: { enabled: false },
    mouse: false,
    unknown: true,
  });

  assert.equal(prefs.theme, 'nord');
  assert.equal(prefs.diff_style, 'stacked');
  assert.equal(prefs.scroll_acceleration, false);
  assert.equal(prefs.mouse, false);
  assert.equal('unknown' in prefs, false);
});

test('loadMcpConfigs reads framework MCP opencode configs', async () => {
  const configs = await loadMcpConfigs(['playwright-mcp']);

  assert.ok(Object.keys(configs).length > 0);
});
