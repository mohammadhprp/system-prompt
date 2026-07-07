# Chrome DevTools Examples

## Example 1: Debug Console Error

A page shows a JavaScript error in the console. Good agent behavior:

- Use `navigate_page` to open the page.
- Use `list_console_messages` to find errors with stack traces.
- Use `evaluate_script` to probe the page state and narrow the root cause.
- Use `get_network_request` on any failing API calls to check request/response details.
- Report the exact error, stack trace, and network request that caused it.

## Example 2: Capture Performance Trace

The user reports a slow page load. Good agent behavior:

- Use `performance_start_trace` to begin recording with appropriate categories.
- Use `navigate_page` to trigger a fresh load of the target URL.
- Use `performance_stop_trace` to retrieve the trace data.
- Use `performance_analyze_insight` to extract actionable recommendations.
- Present the top 3 bottlenecks with specific metrics and suggested fixes.

## Example 3: Cross-Browser Form Fill

Automate a multi-step checkout form across different viewports. Good agent behavior:

- Use `emulate` to switch to a mobile device profile.
- Use `navigate_page` to open the checkout page.
- Use `fill_form` to populate all fields in a single call.
- Use `take_screenshot` after each step to verify rendering.
- Use `emulate` again to switch to desktop and repeat the same flow.