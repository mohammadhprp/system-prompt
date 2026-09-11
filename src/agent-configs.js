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

export const TUI_THEMES = [
  'system',
  'tokyonight',
  'everforest',
  'ayu',
  'catppuccin',
  'catppuccin-macchiato',
  'gruvbox',
  'kanagawa',
  'nord',
  'matrix',
  'one-dark',
];

export const TUI_DEFAULTS = {
  theme: 'system',
  scroll_speed: 3,
  scroll_acceleration: true,
  diff_style: 'auto',
  mouse: true,
  cursor: { style: 'block', blinking: true },
  attention: { enabled: true, notifications: true, sound: true, volume: 0.4 },
};

export function normalizeTuiPreferences(preferences = {}) {
  const source = preferences || {};
  const cursor = source.cursor || {};
  const attention = source.attention || {};
  const scrollSpeed = Number(source.scroll_speed);
  const volume = Number(attention.volume);

  return {
    theme: typeof source.theme === 'string' && source.theme ? source.theme : TUI_DEFAULTS.theme,
    scroll_speed: Number.isFinite(scrollSpeed) && scrollSpeed >= 0.001 ? scrollSpeed : TUI_DEFAULTS.scroll_speed,
    scroll_acceleration: typeof source.scroll_acceleration === 'boolean' ? source.scroll_acceleration : TUI_DEFAULTS.scroll_acceleration,
    diff_style: source.diff_style === 'stacked' ? 'stacked' : 'auto',
    mouse: typeof source.mouse === 'boolean' ? source.mouse : TUI_DEFAULTS.mouse,
    cursor: {
      style: ['block', 'underline', 'line', 'default'].includes(cursor.style) ? cursor.style : TUI_DEFAULTS.cursor.style,
      blinking: typeof cursor.blinking === 'boolean' ? cursor.blinking : TUI_DEFAULTS.cursor.blinking,
    },
    attention: {
      enabled: typeof attention.enabled === 'boolean' ? attention.enabled : TUI_DEFAULTS.attention.enabled,
      notifications: typeof attention.notifications === 'boolean' ? attention.notifications : TUI_DEFAULTS.attention.notifications,
      sound: typeof attention.sound === 'boolean' ? attention.sound : TUI_DEFAULTS.attention.sound,
      volume: Number.isFinite(volume) && volume >= 0 && volume <= 1 ? volume : TUI_DEFAULTS.attention.volume,
    },
  };
}

export function tuiPreferencesFromConfig(config) {
  if (!config || typeof config !== 'object') return {};
  const preferences = {};
  if (typeof config.theme === 'string') preferences.theme = config.theme;
  if (typeof config.scroll_speed === 'number') preferences.scroll_speed = config.scroll_speed;
  if (typeof config.scroll_acceleration?.enabled === 'boolean') preferences.scroll_acceleration = config.scroll_acceleration.enabled;
  if (typeof config.diff_style === 'string') preferences.diff_style = config.diff_style;
  if (typeof config.mouse === 'boolean') preferences.mouse = config.mouse;
  if (config.cursor && typeof config.cursor === 'object') preferences.cursor = config.cursor;
  if (config.attention && typeof config.attention === 'object') preferences.attention = config.attention;
  return preferences;
}

export function generateTuiConfig({ selections, preferences }) {
  const prefs = normalizeTuiPreferences(preferences);
  const config = {
    $schema: 'https://opencode.ai/tui.json',
    theme: prefs.theme,
    scroll_speed: prefs.scroll_speed,
    scroll_acceleration: {
      enabled: prefs.scroll_acceleration,
    },
    diff_style: prefs.diff_style,
    cursor: {
      style: prefs.cursor.style,
      blinking: prefs.cursor.blinking,
    },
    mouse: prefs.mouse,
    attention: {
      enabled: prefs.attention.enabled,
      notifications: prefs.attention.notifications,
      sound: prefs.attention.sound,
      volume: prefs.attention.volume,
    },
  };

  if (selections.plugins?.includes('opencode-goal-plugin')) {
    config.plugin = ['@prevalentware/opencode-goal-plugin'];
  }

  return JSON.stringify(config, null, 4);
}
