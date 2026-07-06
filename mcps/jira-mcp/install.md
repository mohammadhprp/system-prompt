# Jira MCP Installation

## Requirements

- Node.js 18 or higher available on `PATH`.
- A self-hosted Jira instance.
- A Jira Personal Access Token.
- An MCP-compatible AI client.

## Creating a Personal Access Token

1. Log in to your self-hosted Jira instance.
2. Click your profile icon → **Profile** or **Account Settings**.
3. Navigate to **Personal Access Tokens** or **Security**.
4. Click **Create token**, give it a name, set an expiration date, and copy the token immediately.

## Installation

The server can be used directly with `npx` — no build step required.

```bash
npx -y mcp-jira-server
```

Or install globally:

```bash
npm install -g mcp-jira-server
```

## Configuration

| Field | Value |
| --- | --- |
| Server name | `jira` |
| Command | `npx` (or `mcp-jira-server` if installed globally) |
| Args | `-y`, `mcp-jira-server` |
| Env | `JIRA_BASE_URL`, `JIRA_PAT` |

### Config file examples

Use the examples in [`configs/`](./configs/) as client-specific starting points:

| Client | Example | Typical location |
| --- | --- | --- |
| OpenCode | [`configs/opencode.json`](./configs/opencode.json) | OpenCode MCP configuration. |

### OpenCode

Copy [`configs/opencode.json`](./configs/opencode.json) into your OpenCode project root or user config directory, replace the placeholder URL and token, and restart the OpenCode agent.

## Verification

Run the MCP server command directly:

```bash
npx -y mcp-jira-server
```

Then verify from your AI client:

- The `jira` MCP server is listed.
- The server starts without errors.
- Tools are visible to the agent.

Recommended first prompt:

```
Get my current Jira user information
```

## Updating

```bash
npx -y mcp-jira-server@latest
```

Or update global install:

```bash
npm update -g mcp-jira-server
```

## Uninstalling

1. Remove the MCP entry from AI client configuration files.
2. Uninstall the package: `npm uninstall -g mcp-jira-server`.

## Common Issues

- **Server does not start**: run `npx -y mcp-jira-server` manually. Ensure Node.js >= 18 is installed.
- **Authentication errors**: verify the PAT is valid and not expired. Confirm `JIRA_BASE_URL` has no trailing slash.
- **Connection refused**: check if the Jira instance is accessible and the URL is correct.
- **API requests redirect to SSO login**: your Jira may be behind a reverse proxy. Set `JIRA_USER_AGENT` to a whitelisted User-Agent string.