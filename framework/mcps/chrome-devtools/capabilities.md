# Chrome DevTools MCP Capabilities

## What It Can Do

49 tools across 11 categories.

### Input Automation

| Tool | Description |
| --- | --- |
| `click` | Click an element by CSS selector |
| `click_at` | Click at specific x/y coordinates |
| `drag` | Drag an element by CSS selector |
| `fill` | Fill an input field with text |
| `fill_form` | Fill multiple form fields at once |
| `handle_dialog` | Accept or dismiss browser dialogs |
| `hover` | Hover over an element |
| `press_key` | Press a keyboard key |
| `type_text` | Type text character by character |
| `upload_file` | Upload a file to a file input |

### Navigation Automation

| Tool | Description |
| --- | --- |
| `close_page` | Close the current page |
| `list_pages` | List all open pages/tabs |
| `navigate_page` | Navigate to a URL |
| `new_page` | Open a new page/tab |
| `select_page` | Switch to a specific page |
| `wait_for` | Wait for a condition or timeout |

### Emulation

| Tool | Description |
| --- | --- |
| `emulate` | Emulate a device (viewport, user agent) |
| `resize_page` | Resize the viewport |

### Performance

| Tool | Description |
| --- | --- |
| `performance_analyze_insight` | Analyze a performance trace for insights |
| `performance_start_trace` | Start recording a performance trace |
| `performance_stop_trace` | Stop recording and return the trace |

### Network

| Tool | Description |
| --- | --- |
| `get_network_request` | Get details of a specific network request |
| `list_network_requests` | List all network requests on a page |

### Debugging

| Tool | Description |
| --- | --- |
| `evaluate_script` | Execute JavaScript in the page context |
| `get_console_message` | Get a specific console message by index |
| `lighthouse_audit` | Run a Lighthouse audit |
| `list_console_messages` | List all console messages with stack traces |
| `screencast_start` | Start recording a screencast (requires ffmpeg) |
| `screencast_stop` | Stop the current screencast recording |
| `take_screenshot` | Take a screenshot of the page or element |
| `take_snapshot` | Take an accessibility/snapshot of the page |

### Memory

| Tool | Description |
| --- | --- |
| `take_heapsnapshot` | Take a JavaScript heap snapshot |
| `close_heapsnapshot` | Close an open heap snapshot |
| `compare_heapsnapshots` | Compare two heap snapshots |
| `get_heapsnapshot_class_nodes` | Get class constructor nodes |
| `get_heapsnapshot_details` | Get detailed info on specific nodes |
| `get_heapsnapshot_dominators` | Get dominator tree |
| `get_heapsnapshot_duplicate_strings` | Find duplicate strings |
| `get_heapsnapshot_edges` | Get edges of specific nodes |
| `get_heapsnapshot_retainers` | Get retainers of specific nodes |
| `get_heapsnapshot_retaining_paths` | Get retaining paths |
| `get_heapsnapshot_summary` | Get summary statistics |

### Extensions

| Tool | Description |
| --- | --- |
| `install_extension` | Install a Chrome extension |
| `list_extensions` | List installed extensions |
| `reload_extension` | Reload an extension |
| `trigger_extension_action` | Trigger an extension's action |
| `uninstall_extension` | Uninstall an extension |

### Third-Party

| Tool | Description |
| --- | --- |
| `execute_3p_developer_tool` | Execute a third-party developer tool |
| `list_3p_developer_tools` | List available third-party developer tools |

### WebMCP

| Tool | Description |
| --- | --- |
| `execute_webmcp_tool` | Execute a WebMCP tool (Chrome 149+) |
| `list_webmcp_tools` | List available WebMCP tools |

## Slim Mode

Use `--slim` to expose only 3 core tools: `navigate_page`, `evaluate_script`, and `take_screenshot`. Useful for basic browser tasks and reducing tool surface area.

## What It Cannot Do

- It cannot work without Google Chrome or a Chromium-based browser installed.
- It cannot interact with browser tabs that require authentication or are behind CAPTCHAs.
- It cannot persist data across isolated sessions (when `--isolated` is used).
- It does not support Firefox, Safari, or other non-Chromium browsers.
- It cannot access local files outside the browser's sandbox.
- Memory debugging tools require `--memory-debugging` flag to be enabled.

## Best Practices

- Use `--headless` for CI and automated workflows.
- Use `--slim` for basic browsing to reduce token usage.
- Use `--isolated` for concurrent agent sessions to avoid profile conflicts.
- Use `--browser-url` or `--ws-endpoint` to connect to an existing browser instead of launching a new one.
- Use `--blocked-url-pattern` or `--allowed-url-pattern` to restrict network access.
- Use `--screenshot-format=jpeg` or `--screenshot-format=webp` to reduce screenshot size in AI context.
- Use `--no-usage-statistics` to opt out of Google's usage data collection.
- Use `--redact-network-headers` to redact sensitive headers before returning them.

## Common Workflows

### Debug a page error

1. Call `navigate_page` to open the page.
2. Call `list_console_messages` to check for errors with stack traces.
3. Call `list_network_requests` to find failing network requests.
4. Call `get_network_request` on failing requests for details.

### Audit performance

1. Call `navigate_page` to open the page.
2. Call `performance_start_trace` to begin recording.
3. Interact with the page or wait for loading.
4. Call `performance_stop_trace` to get the trace.
5. Call `performance_analyze_insight` for actionable insights.

### Run a Lighthouse audit

1. Call `navigate_page` to open the page.
2. Call `lighthouse_audit` to run the audit.
3. Review performance, accessibility, SEO, and best-practice scores.

### Take a screenshot

1. Call `navigate_page` to open the page.
2. Call `take_screenshot` with optional selector for a specific element.

### Memory analysis

1. Enable `--memory-debugging` in server args.
2. Call `take_heapsnapshot` to capture heap state.
3. Call `get_heapsnapshot_summary` for an overview.
4. Call `get_heapsnapshot_duplicate_strings` to find optimization opportunities.
5. Call `compare_heapsnapshots` to diff two snapshots.