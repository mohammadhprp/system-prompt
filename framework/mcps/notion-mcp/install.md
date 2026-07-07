# Notion MCP Installation

## Requirements

- A Notion workspace with appropriate permissions.
- An MCP-compatible AI client that supports remote HTTP MCP servers (Streamable HTTP or SSE).
- No local infrastructure — the server is hosted by Notion at `https://mcp.notion.com/mcp`.

## Configuration

Notion MCP is a remote Streamable HTTP server — no local command or install needed. Authentication uses OAuth, completed interactively on first use.

| Field | Value |
| --- | --- |
| Server name | `notion` |
| Transport type | Streamable HTTP (recommended) |
| URL | `https://mcp.notion.com/mcp` |

### Config file examples

Use the examples in [`configs/`](./configs/) as client-specific starting points:

| Client | Example | Typical location |
| --- | --- | --- |
| OpenCode | [`configs/opencode.json`](./configs/opencode.json) | OpenCode MCP configuration. |

### OpenCode

Copy [`configs/opencode.json`](./configs/opencode.json) into your OpenCode project root or user config directory and restart the OpenCode agent. When you use a Notion tool for the first time, complete the OAuth flow to connect your workspace.

### For clients that only support local stdio servers

Some MCP clients only support local stdio servers. Use the [mcp-remote](https://www.npmjs.com/package/mcp-remote) bridge to connect:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
    }
  }
}
```

## Verification

After configuring and restarting your AI client, use a Notion tool for the first time to trigger the OAuth flow.

Recommended first prompt:

```
Fetch "self" to see which workspace and user this Notion connection is for.
```

## Updating

Notion MCP is hosted by Notion — no update steps needed. The latest version is always available at `https://mcp.notion.com/mcp`.

## Uninstalling

Remove the `notion` MCP entry from AI client configuration files. Optionally, clear the OAuth connection in your Notion workspace: **Settings → Connections → Notion MCP**.

## Common Issues

- **Authentication fails**: make sure you complete the OAuth flow when prompted. Try disconnecting and reconnecting in the tool's MCP settings.
- **Permission errors**: check that you have the correct permissions in the Notion workspace for the pages or databases you're trying to access.
- **Client does not support remote servers**: use the `mcp-remote` bridge as a stdio wrapper to connect to the remote server.
- **Tool not found**: some clients prefix tools with `notion-`. For OpenAI-based clients (ChatGPT), `notion-fetch` and `notion-search` may appear as `fetch` and `search`.
- **Rate limited**: standard API limits apply (180 requests/min average, 30 requests/min for search). Prompt the agent to reduce parallel operations.