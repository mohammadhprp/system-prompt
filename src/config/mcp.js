import { readFile } from 'node:fs/promises';

import { isMissing, resolveSource } from '../paths.js';
import { status } from '../ui.js';

export async function loadMcpConfigs(selectedIds) {
  const entries = {};
  for (const id of selectedIds) {
    try {
      const configPath = resolveSource(`framework/mcps/${id}/configs/opencode.json`);
      const raw = await readFile(configPath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.mcp) {
        Object.assign(entries, parsed.mcp);
      }
    } catch (error) {
      if (isMissing(error)) {
        console.warn(status('warn', `No opencode.json config found for MCP: ${id}`));
        continue;
      }
      throw error;
    }
  }
  return entries;
}
