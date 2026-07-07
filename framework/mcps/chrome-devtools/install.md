# Chrome DevTools MCP Installation

## Requirements

- Node.js LTS version available on `PATH`.
- Google Chrome (stable or newer) or Chrome for Testing.
- An MCP-compatible AI client.

## Installation

The server is used directly with `npx` — no build step required.

```bash
npx -y chrome-devtools-mcp@latest
```

## Configuration

| Field | Value |
| --- | --- |
| Server name | `chrome-devtools` |
| Command | `npx` |
| Args | `-y`, `chrome-devtools-mcp@latest` |

### Config file examples

Use the examples in [`configs/`](./configs/) as client-specific starting points:

| Client | Example | Typical location |
| --- | --- | --- |
| OpenCode | [`configs/opencode.json`](./configs/opencode.json) | OpenCode MCP configuration. |

### OpenCode

Copy [`configs/opencode.json`](./configs/opencode.json) into your OpenCode project root or user config directory and restart the OpenCode agent.

### Common flags

Pass these via the `args` array:

| Flag | Description |
| --- | --- |
| `--headless` | Run in headless (no UI) mode |
| `--slim` | Expose only 3 core tools (navigation, script, screenshot) |
| `--channel=canary` | Use Chrome Canary instead of stable |
| `--isolated` | Use a temporary user data dir cleaned up on close |
| `--browser-url=http://127.0.0.1:9222` | Connect to a running Chrome instance |
| `--no-usage-statistics` | Opt out of usage data collection |
| `--memory-debugging` | Enable heap snapshot and memory tools |

Slim+headless config example:

```json
{
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "enabled": true,
      "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--slim", "--headless"]
    }
  }
}
```

## Verification

Run the MCP server command directly:

```bash
npx -y chrome-devtools-mcp@latest
```

Then verify from your AI client:

- The `chrome-devtools` MCP server is listed.
- The server starts without errors.
- Tools are visible to the agent.

Recommended first prompt:

```
Check the performance of https://developers.chrome.com
```

## Updating

The `@latest` tag ensures your client always uses the newest version. To force an update:

```bash
npx -y chrome-devtools-mcp@latest
```

## Uninstalling

Remove the `chrome-devtools` MCP entry from AI client configuration files.

## Common Issues

- **Browser does not start**: ensure Google Chrome is installed. Set `--executable-path` to a custom Chrome location if needed.
- **Server not found**: confirm the config file is in the correct location and the JSON is valid.
- **Permission errors**: Chrome may need permission to access the display on macOS. Grant screen recording permission if prompted.
- **Headless mode not working**: some tools (e.g., screencast) require a visible browser. Omit `--headless` for those.