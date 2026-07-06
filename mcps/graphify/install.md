# Graphify MCP Installation

## Requirements

- Python 3.10+.
- `uv` (recommended) or `pipx`.
- A built graph (`graphify-out/graph.json`) via `graphify extract .` or `/graphify .`.

## Installation

Install graphify with MCP support:

```bash
uv tool install graphifyy[mcp]
```

Or with pipx:

```bash
pipx install graphifyy[mcp]
```

### Build a graph

```bash
graphify extract .
```

Or use AI assistant skill: `/graphify .` (see platform-specific install below).

### OpenCode skill install (alternative to MCP)

Graphify can also be installed as an OpenCode skill that provides the `/graphify` slash command:

```bash
graphify install --platform opencode
```

This writes a skill config that lets you use `/graphify .` to build graphs directly from OpenCode.

## Configuration

| Field | Value |
| --- | --- |
| Server name | `graphify` |
| Command | `python` |
| Args | `-m`, `graphify.serve`, `graphify-out/graph.json` |
| Prerequisite | Graph must be built before starting the server |

### Config file examples

Use the examples in [`configs/`](./configs/) as client-specific starting points:

| Client | Example | Typical location |
| --- | --- | --- |
| OpenCode | [`configs/opencode.json`](./configs/opencode.json) | OpenCode MCP configuration. |

### OpenCode

Copy [`configs/opencode.json`](./configs/opencode.json) into your OpenCode project root or user config directory and restart the OpenCode agent.

### HTTP server (shared team access)

```bash
python -m graphify.serve graphify-out/graph.json --transport http --port 8080
```

## Verification

Run the MCP server command directly:

```bash
python -m graphify.serve graphify-out/graph.json
```

Then verify from your AI client:

- The `graphify` MCP server is listed.
- The server starts without errors.
- Tools such as `query_graph`, `get_node`, and `shortest_path` are visible.

Recommended first prompt:

```
What are the most-connected concepts in this project?
```

## Updating

```bash
uv tool install graphifyy[mcp]  # reinstalls latest
```

Then rebuild the graph: `graphify extract . --update`.

## Uninstalling

1. Remove the MCP entry from AI client configuration files.
2. Uninstall: `uv tool uninstall graphifyy`.

## Common Issues

- **Graph not built**: run `graphify extract .` first. The MCP server requires `graphify-out/graph.json`.
- **`python -m graphify.serve` not found**: ensure the `[mcp]` extra was installed: `uv tool install graphifyy[mcp]`.
- **`graphify: command not found`**: run `uv tool update-shell` and open a new terminal, or use `python -m graphify`.
- **Stale graph**: rebuild with `graphify extract . --update` when code changes.