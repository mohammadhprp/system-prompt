# GitHub MCP Installation

## Requirements

- A GitHub account with API access.
- A GitHub Personal Access Token (classic or fine-grained) with the following scopes:
  - `repo` — full control of private repositories.
  - `read:org` — read organization membership.
- An MCP-compatible AI client that supports remote HTTP MCP servers.

## Authentication

This MCP uses the **remote GitHub MCP Server** hosted by GitHub at `https://api.githubcopilot.com/mcp/`. Authentication is handled via a `Bearer` token in the `Authorization` header.

| Method | Best for |
| --- | --- |
| Personal Access Token (PAT) | Simplest local setup |
| OAuth (via host support) | Better security when host supports it |

## Configuration

| Field | Value |
| --- | --- |
| Server name | `github` |
| Type | `http` |
| URL | `https://api.githubcopilot.com/mcp/` |
| Auth header | `Authorization: Bearer {env:GITHUB_PERSONAL_ACCESS_TOKEN}` |

### Config file examples

Use the examples in [`configs/`](./configs/) as client-specific starting points:

| Client | Example | Typical location |
| --- | --- | --- |
| OpenCode | [`configs/opencode.json`](./configs/opencode.json) | OpenCode MCP configuration. |

### OpenCode

Copy [`configs/opencode.json`](./configs/opencode.json) into your OpenCode project root or user config directory, ensure `GITHUB_PERSONAL_ACCESS_TOKEN` is set in your `.env` file, and restart the OpenCode agent.

## Verification

From your AI client:

- The `github` MCP server is listed.
- The server starts without errors.
- Tools are visible to the agent.

Recommended first prompt:

```
List my GitHub repositories and show me recent pull requests.
```

## Common Issues

- **Server does not start**: confirm your client supports remote HTTP MCP servers.
- **Authentication errors**: confirm the PAT has the required scopes and `GITHUB_PERSONAL_ACCESS_TOKEN` is set in your `.env` or environment.
- **401 Unauthorized**: regenerate the token in GitHub **Settings → Developer settings → Personal access tokens**.
- **Rate limiting**: GitHub API has rate limits; reduce the frequency of tool calls if you encounter 429 errors.
