# Plugin Catalog

A curated catalog of OpenCode plugins for AI coding agents.

This catalog is framework-agnostic: each entry documents what the plugin does, when to use it, how to install it, how to configure it, and how to troubleshoot it.

## Available Plugins

| Plugin | Purpose | Best fit |
| --- | --- | --- |
| [OpenCode Goal Plugin](./opencode-goal-plugin/README.md) | Adds Codex-style long-running goal mode with `/goal` slash commands, persistent goal state, completion evidence, and auto-continuation. | Any OpenCode session that needs focused, goal-driven long-running tasks. |
| [Ponytail](./ponytail/README.md) | Lazy senior dev mode — YAGNI-first, reuse-first ladder that cuts code bloat, token usage, and cost without cutting safety. | Any coding session where agents tend to over-engineer or add unnecessary abstractions. |

## Why Plugins Are Useful

OpenCode plugins extend the core agent with custom commands, tools, TUI elements, and lifecycle hooks. For coding agents, plugins can improve:

- **Focus**: goal-driven workflows keep the agent on task across many turns.
- **Persistence**: state survives session compaction and restarts.
- **User experience**: custom TUI indicators and slash commands make agent behavior visible.
- **Safety**: explicit completion evidence and blocker requirements prevent premature closure.

## How to Choose a Plugin

Use a plugin when it adds a concrete workflow or user interface that the base OpenCode agent does not provide.

Before installing one, check:

- **Compatibility**: does it match your OpenCode version? Check the `engines.opencode` field.
- **Capabilities**: does it add commands, tools, or UI that improve your workflow?
- **Permissions**: does it read or write files outside the project directory?
- **Maintenance**: is the plugin actively maintained and documented?

## Catalog Entry Structure

Every plugin entry must use this structure:

```text
plugins/<plugin-slug>/
├── README.md
├── install.md
├── capabilities.md
└── troubleshooting.md
```

## Naming Conventions

- Use lowercase kebab-case directory names, for example `opencode-goal-plugin`.
- Use the upstream plugin name in page titles, for example `# OpenCode Goal Plugin`.
- Keep file names exactly as shown in the catalog structure.

## How to Contribute a New Plugin

1. Create `plugins/<plugin-slug>/` using the standard structure.
2. Prefer official documentation for install commands, requirements, capabilities, and configuration.
3. Document options and their defaults in `capabilities.md`.
4. Add common startup, permission, and version issues in `troubleshooting.md`.
5. Add the plugin to the table in this README.

## Related Repository Areas

- [`mcps/`](../mcps/) contains the MCP (Model Context Protocol) server catalog.
- [`skills/`](../skills/) contains task-specific procedures for AI coding agents.
- [`references/standards/`](../references/standards/) contains canonical engineering rules.
- [`references/templates/`](../references/templates/) contains reusable engineering deliverables.