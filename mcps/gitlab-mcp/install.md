# GitLab MCP Installation

## Requirements

- Node.js >= 18 and npm available on `PATH`, or Homebrew.
- A GitLab account with API access.
- A GitLab Personal Access Token with `api` scope (or `read_api` for read-only mode).
- An MCP-compatible AI client.

## Authentication

The server supports four authentication methods:

| Method | Best for |
| --- | --- |
| Personal Access Token (PAT) | Simplest local setup |
| OAuth2 — Local Browser | Better security for desktop use |
| OAuth2 — MCP Proxy | Remote deployments (Claude.ai, etc.) |
| Remote Authorization | Multi-user deployments with per-request tokens |

## Installation

Install globally via npm or Homebrew:

```bash
npm install -g @zereight/mcp-gitlab
```

Or with Homebrew:

```bash
brew install zereight/gitlab-mcp/zereight-mcp-gitlab
```

No global install? Use `npx` pinned to a specific version:

```bash
npx -y @zereight/mcp-gitlab@latest
```

## Configuration

| Field | Value |
| --- | --- |
| Server name | `gitlab` |
| Command | `zereight-mcp-gitlab` |
| Env | `GITLAB_PERSONAL_ACCESS_TOKEN`, `GITLAB_API_URL` |
| Alt command (no global install) | `npx` with args `-y`, `@zereight/mcp-gitlab@latest` |
| CLI args | `--token`, `--api-url`, `--permission-mode` |

### Config file examples

Use the examples in [`configs/`](./configs/) as client-specific starting points:

| Client | Example | Typical location |
| --- | --- | --- |
| OpenCode | [`configs/opencode.json`](./configs/opencode.json) | OpenCode MCP configuration. |

### OpenCode

Copy [`configs/opencode.json`](./configs/opencode.json) into your OpenCode project root or user config directory, replace the placeholder token and API URL, and restart the OpenCode agent.

## Verification

Run the MCP server command directly:

```bash
zereight-mcp-gitlab
```

Then verify from your AI client:

- The `gitlab` MCP server is listed.
- The server starts without errors.
- Tools are visible to the agent.

Recommended first prompt:

```
List my GitLab projects and show me recent merge requests.
```

## Updating

```bash
npm update -g @zereight/mcp-gitlab
```

## Uninstalling

1. Remove the MCP entry from AI client configuration files.
2. Uninstall the package: `npm uninstall -g @zereight/mcp-gitlab`.

## Common Issues

- **Server does not start**: run `zereight-mcp-gitlab` manually and fix the first error shown. Ensure Node.js >= 18 is installed.
- **Authentication errors**: confirm the PAT has the correct scopes and the API URL is `https://gitlab.com/api/v4` (not the web URL).
- **Client cannot find the server**: use the absolute path from `which zereight-mcp-gitlab`, or use `npx` as the command instead.
- **Wrong API URL**: use `https://gitlab.com/api/v4` for GitLab SaaS, or `https://your-instance/api/v4` for self-hosted.