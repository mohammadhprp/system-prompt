import test from 'node:test';
import assert from 'node:assert/strict';

import { generateOpenCodeConfig, generateTuiConfig, loadMcpConfigs } from '../src/agent-configs.js';

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

test('loadMcpConfigs reads framework MCP opencode configs', async () => {
  const configs = await loadMcpConfigs(['playwright-mcp']);

  assert.ok(Object.keys(configs).length > 0);
});
