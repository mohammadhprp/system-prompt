import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');

export async function loadMcpConfigs(selectedIds) {
  const entries = {};
  for (const id of selectedIds) {
    try {
      const configPath = resolve(packageRoot, `framework/mcps/${id}/configs/opencode.json`);
      const raw = await readFile(configPath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.mcp) {
        Object.assign(entries, parsed.mcp);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn(`  ⚠  No opencode.json config found for MCP: ${id}`);
        continue;
      }
      throw error;
    }
  }
  return entries;
}

export function generateOpenCodeConfig({ selections, mcpEntries, includeAgentsMd }) {
  const plugins = [];
  if (selections.plugins?.includes('opencode-goal-plugin')) {
    plugins.push('@prevalentware/opencode-goal-plugin');
  }
  if (selections.plugins?.includes('ponytail')) {
    plugins.push('@dietrichgebert/ponytail');
  }

  const instructions = [];
  if (includeAgentsMd) instructions.push('AGENTS.md');
  if (selections.memory?.length) instructions.push('.opencode/memory/*.md');

  const config = {
    $schema: 'https://opencode.ai/config.json',
    formatter: true,
    lsp: false,
    instructions,
  };

  if (plugins.length > 0) {
    config.plugin = plugins;
  }

  const references = {};
  if (selections.standards?.length) {
    references.standards = {
      path: 'references/standards',
      description: 'Canonical engineering standards referenced by skills.',
    };
  }
  if (selections.templates?.length) {
    references.templates = {
      path: 'references/templates',
      description: 'Ready-to-use workflow documents.',
    };
  }
  if (Object.keys(references).length > 0) {
    config.references = references;
  }

  if (Object.keys(mcpEntries).length > 0) {
    config.mcp = mcpEntries;
  }

  return JSON.stringify(config, null, 4);
}

export function generateTuiConfig({ selections }) {
  const config = {
    $schema: 'https://opencode.ai/tui.json',
    theme: 'system',
    scroll_speed: 3,
    scroll_acceleration: {
      enabled: true,
    },
    diff_style: 'auto',
    mouse: true,
    attention: {
      enabled: true,
      notifications: true,
      sound: true,
      volume: 0.4,
    },
  };

  if (selections.plugins?.includes('opencode-goal-plugin')) {
    config.plugin = ['@prevalentware/opencode-goal-plugin'];
  }

  return JSON.stringify(config, null, 4);
}
