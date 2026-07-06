# Installing the OpenCode Harness

## Quick Start

The `opencode.json` in this directory configures OpenCode to self-configure. Copy or link it to `<repo-root>/.opencode/opencode.json` (or merge its contents with your existing config).

```json
{
    "$schema": "https://opencode.ai/config.json",
    "formatter": true,
    "lsp": false,
    "plugin": [
      "@prevalentware/opencode-goal-plugin"
    ],
    "instructions": ["AGENTS.md"],
    "references": {
      "docs": {
          "path": "references/docs",
          "description": "Project architecture, domain, API, and development documentation."
      }
    },
    "mcp": {
      "chrome-devtools": {
          "type": "local",
          "command": ["bun", "x", "chrome-devtools-mcp@latest"],
          "enabled": true
      },
      "notion": {
          "type": "remote",
          "url": "https://mcp.notion.com/mcp",
          "enabled": true
      }
    }
}
```

## Step-by-Step

### 1. Load AGENTS.md

The `instructions` field in `opencode.json` points to [`AGENTS.md`](../../AGENTS.md) at the repository root. OpenCode reads this file on session start to learn the repository structure, skill activation rules, standards, and agent conduct guidelines.

### 2. Load Skills

Skills are task-specific procedures in [`skills/`](../../skills/). The agent should load only skills relevant to the current task (see the skill activation table in `AGENTS.md` for guidance).

Skills are loaded via the OpenCode skill system. Run `/skill load <skill-name>` or reference the skill's `SKILL.md` in a prompt.

### 3. Install MCPs

MCPs are installed from the [`mcps/`](../../mcps/) catalog. Each MCP entry has its own `install.md` with setup instructions.

The `opencode.json` in this harness pre-configures example MCPs. To add more:

1. Browse the [MCP catalog](../../mcps/README.md) and choose an MCP.
2. Follow its `install.md` for setup steps.
3. Add the MCP configuration to `opencode.json` under `"mcp"`.

### 4. Add Plugins

Plugins are installed from the [`plugins/`](../../plugins/) catalog. Each plugin entry has its own `install.md` with setup instructions.

The goal plugin [`@prevalentware/opencode-goal-plugin`](../../plugins/opencode-goal-plugin/README.md) is pre-configured in both `opencode.json` and `tui.json`.

To add more plugins:

1. Browse the [plugin catalog](../../plugins/README.md) and choose a plugin.
2. Follow its `install.md` for setup steps.
3. Add the plugin to `opencode.json` under `"plugin"` and to `tui.json` if it has TUI features.

### 5. Register Commands

Commands are registered from [`commands/`](../../commands/). Each `.md` file defines a slash command with a `description` field and a `## Process` section.

Commands are loaded when the agent reads the command file or when the user invokes the slash command. Run `/command load <command-name>` to register a command for the session.

Available commands are listed in the [command catalog](../../commands/README.md).

## Configuration Files

| File | Purpose |
| --- | --- |
| [`opencode.json`](./opencode.json) | Main OpenCode configuration — MCPs, plugins, instructions, references. |
| [`tui.json`](./tui.json) | Terminal UI plugin configuration. |

## Verification

After completing setup, verify the harness is working:

1. Start a new OpenCode session in the repository root.
2. OpenCode should load `AGENTS.md` automatically.
3. Run `/help` to confirm plugins and commands are available.
4. Test an MCP by asking the agent to use one (e.g., "open Chrome DevTools").