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
    } catch {
      console.warn(`  ⚠  No opencode.json config found for MCP: ${id}`);
    }
  }
  return entries;
}

export function generateOpenCodeConfig({ selections, mcpEntries }) {
  const plugins = [];
  if (selections.plugins?.includes('opencode-goal-plugin')) {
    plugins.push('@prevalentware/opencode-goal-plugin');
  }

  const config = {
    $schema: 'https://opencode.ai/config.json',
    formatter: true,
    lsp: false,
    instructions: ['AGENTS.md', 'system-prompt.md'],
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
