# Mode Catalog

A catalog of behavior, tool, and prompt presets for AI coding agents.

Modes customize how the agent behaves for a given use case. Each mode defines a temperature, restricts or grants tools, and sets the response style, workflow, and output format. Switch modes to adopt a different operating posture — for example, a read-only high-scrutiny review mode versus a default building mode.

## Available Modes

| Mode | Purpose | Tools |
| --- | --- | --- |
| [Audit](./audit.md) | Read-only high-scrutiny review of artifacts — correctness, architecture, security, maintainability. | `write`, `edit`, `bash` disabled |

## Mode Entry Structure

```text
modes/<mode-name>.md
```

Each mode file uses YAML frontmatter defining runtime constraints, followed by markdown instructions defining the mode's behavior, response style, workflow, and output format.

```yaml
---
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
---
```

| Field | Purpose |
| --- | --- |
| `temperature` | Sampling temperature for the mode (lower = more deterministic). |
| `tools` | Per-tool allow/deny flags that override the base agent's tool access. |

## How to Contribute a New Mode

1. Create `modes/<mode-name>.md` following the existing format.
2. Set `temperature` appropriate to the mode's posture.
3. Declare `tools` restrictions (typically deny `write`/`edit`/`bash` for review modes).
4. Write markdown instructions: purpose, response style, workflow, output format, and constraints.
5. Add the mode to the table in this README.

## Related Repository Areas

- [`skills/`](../skills/) contains task-specific skill definitions.
- [`agents/`](../agents/) contains specialized subagent definitions.
- [`commands/`](../commands/) contains slash commands for repeatable workflows.
- [`mcps/`](../mcps/) contains the MCP server catalog.
- [`plugins/`](../plugins/) contains the OpenCode plugin catalog.
- [`references/standards/`](../references/standards/) contains canonical engineering rules.
- [`references/templates/`](../references/templates/) contains reusable engineering deliverables.
