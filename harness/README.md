# Harness Catalog

A curated catalog of OpenCode run harness configurations for this repository.

This catalog tells AI coding agents how to configure themselves to work effectively in this repo — which MCPs, plugins, skills, and commands to load, and how to wire them together.

## Available Harnesses

| Harness | Purpose | Best fit |
| --- | --- | --- |
| [OpenCode](./opencode/README.md) | Self-configuration for the OpenCode agent — load skills, install MCPs, add plugins, register commands. | Any session using this repository. |

## Related Repository Areas

- [`mcps/`](../mcps/) contains the MCP server catalog.
- [`plugins/`](../plugins/) contains the OpenCode plugin catalog.
- [`skills/`](../skills/) contains task-specific procedures.
- [`commands/`](../commands/) contains slash command definitions.
- [`agents/`](../agents/) contains reusable agent definitions.
- [`references/standards/`](../references/standards/) contains canonical engineering rules.