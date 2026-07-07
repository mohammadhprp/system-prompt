# Chrome DevTools MCP Troubleshooting

## Server won't start

**Problem**

The AI client reports that `chrome-devtools` failed to start.

**Cause**

The client cannot run `npx`, Node.js is not installed, or Chrome is not found.

**Solution**

- Run `npx -y chrome-devtools-mcp@latest` manually to verify the server starts.
- Check Node.js is installed: `node --version` (requires LTS).
- Ensure Google Chrome is installed. Use `--executable-path` to specify a custom location.
- Check network access if the npm package has not been cached locally.

## Browser does not launch

**Problem**

The server starts but no browser window appears.

**Cause**

Headless mode is enabled, or Chrome cannot be found at the expected path.

**Solution**

- If using `--headless`, the browser runs without a UI — this is expected.
- If headless is not set, ensure Chrome is installed at the default location.
- Use `--executable-path=/path/to/chrome` to specify a custom Chrome binary.
- On macOS, grant screen recording permission if prompted.

## Permission errors on macOS

**Problem**

Chrome displays a permission prompt or fails to capture the screen.

**Cause**

macOS requires screen recording permission for browser automation.

**Solution**

- Go to **System Settings → Privacy & Security → Screen Recording**.
- Add Terminal, VS Code, or the AI client app.
- Restart Chrome and the MCP server.

## "Cannot find module" errors

**Problem**

The server fails with module resolution errors.

**Cause**

The npm package is corrupted or incompletely cached.

**Solution**

- Clear npm cache: `npm cache clean --force`.
- Retry with `npx -y chrome-devtools-mcp@latest`.

## Configuration errors

**Problem**

The MCP server is not listed, or the client ignores the config file.

**Cause**

The config file is in the wrong location, the JSON is invalid, or the client expects a different configuration wrapper.

**Solution**

- Validate the JSON with `python -m json.tool <file>` or another JSON parser.
- Confirm the client-specific config location in the client's documentation.
- Keep the server name as `chrome-devtools`.

## Headless mode limitations

**Problem**

Some tools (screencast, certain UI interactions) fail in headless mode.

**Cause**

Headless mode does not support all browser features.

**Solution**

- Omit `--headless` for features that require a visible browser.
- Use `--screenshot-format=jpeg` to reduce screenshot size in headless mode.
- For screencast, install ffmpeg and use `--experimental-screencast`.

## Usage statistics collection

**Problem**

You want to disable Google's usage data collection.

**Solution**

- Pass `--no-usage-statistics` in the server args.
- Or set the `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS` environment variable.
- Or set the `CI` environment variable.