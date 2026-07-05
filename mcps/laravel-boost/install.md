# Laravel Boost Installation

## Requirements

- Laravel application root as the working directory.
- PHP available on `PATH`.
- Composer available on `PATH`.
- An MCP-compatible AI client.

## Installation

Run these commands from the Laravel application root:

```bash
composer require laravel/boost --dev
php artisan boost:install
```

During `boost:install`, select the AI agents and features you want Boost to configure.

## Configuration

Boost can configure supported agents during installation. If manual registration is needed, use the official server details:

| Field | Value |
| --- | --- |
| Server name | `laravel-boost` |
| Command | `php` |
| Args | `artisan`, `boost:mcp` |

### Config file examples

Use the examples in [`configs/`](./configs/) as client-specific starting points:

| Client | Example | Typical location |
| --- | --- | --- |
| OpenCode | [`configs/opencode.json`](./configs/opencode.json) | OpenCode MCP configuration. |

Because client configuration paths change over time, prefer the client's official documentation for the exact file location. Keep the command and args unchanged unless your Laravel app runs in a wrapper environment such as Docker, Sail, DDEV, or a remote container.

## Client Setup Notes

### Claude Code

Boost usually enables Claude Code automatically. If it does not, run this from the Laravel application root:

```bash
claude mcp add -s local -t stdio laravel-boost php artisan boost:mcp
```

### Codex

Boost usually enables Codex automatically. If it does not, run this from the Laravel application root:

```bash
codex mcp add laravel-boost -- php "artisan" "boost:mcp"
```

### Cursor

1. Open the command palette.
2. Open MCP settings.
3. Enable `laravel-boost`.

### VS Code with GitHub Copilot

1. Open the command palette.
2. Run `MCP: List Servers`.
3. Select `laravel-boost`.
4. Choose `Start server`.

### PhpStorm

1. Press `shift` twice.
2. Search for `MCP Settings`.
3. Enable `laravel-boost`.
4. Apply the change.

## Verification

Run the MCP server command directly from the Laravel application root:

```bash
php artisan boost:mcp
```

Then verify from your AI client:

- The `laravel-boost` MCP server is listed.
- The server starts without errors.
- Boost tools such as application info, database schema, logs, or documentation search are visible to the agent.

## Updating

Update Boost resources after package updates or when generated agent files need to be refreshed:

```bash
php artisan boost:update
```

To discover newly installed package guidelines and skills:

```bash
php artisan boost:update --discover
```

Optional Composer automation:

```json
{
  "scripts": {
    "post-update-cmd": [
      "@php artisan boost:update --ansi"
    ]
  }
}
```

## Uninstalling

1. Remove the package:

```bash
composer remove laravel/boost --dev
```

2. Remove the `laravel-boost` MCP entry from AI client configuration files.
3. Remove generated Boost files if your project does not keep them:
   - `.mcp.json`
   - `boost.json`
   - generated agent guideline files such as `CLAUDE.md`, `AGENTS.md`, or client-specific directories

## Common Issues

- **Server does not start**: run `php artisan boost:mcp` manually and fix the first PHP, Composer, or Laravel error shown.
- **Client cannot find the server**: confirm the config is in the location used by that client and the server name is `laravel-boost`.
- **Wrong working directory**: run the AI client from the Laravel application root or configure the client to start the server there.
- **Wrapper environment required**: replace `php artisan boost:mcp` with the command required by your local environment only when necessary.
