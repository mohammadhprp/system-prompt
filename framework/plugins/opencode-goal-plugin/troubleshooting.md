# OpenCode Goal Plugin Troubleshooting

## Plugin not recognized

**Problem**

`opencode plugin @prevalentware/opencode-goal-plugin` returns an error.

**Cause**

The package name is incorrect, or OpenCode cannot reach the npm registry.

**Solution**

- Verify the package name: `@prevalentware/opencode-goal-plugin`.
- Check network connectivity to the npm registry.
- Ensure OpenCode >= 1.17.1 is installed: `opencode --version`.

## Manual config needed

**Problem**

The plugin is installed but does not appear in OpenCode.

**Cause**

The CLI install may not write to all config targets on some platforms.

**Solution**

- Add the plugin to `opencode.json`: `"plugin": ["@prevalentware/opencode-goal-plugin"]`.
- Add the plugin to `tui.json`: `"plugin": ["@prevalentware/opencode-goal-plugin"]`.
- Restart OpenCode.

## Goal not persisting

**Problem**

The goal disappears after session compaction or restart.

**Cause**

The state file cannot be written, or the filesystem does not support atomic writes.

**Solution**

- Check that the state file path is writable: `$XDG_DATA_HOME/opencode-goal-plugin/goals.json` (defaults to `~/.local/share/opencode-goal-plugin/goals.json`).
- Set `OPENCODE_GOAL_STATE_PATH` to a custom writable path.
- Verify disk space is available.

## Auto-continue not working

**Problem**

The goal is set but the agent does not auto-continue on idle.

**Cause**

`auto_continue` is disabled, or the goal is paused or closed.

**Solution**

- Check `auto_continue` is `true` in the plugin options.
- Verify the goal status is `active` with `/goal`.
- Check that no-progress detection has not paused the goal.
- Verify the session is in Build mode (Plan mode suppresses auto-continue).

## Plan mode restrictions

**Problem**

Goals created from Plan mode are paused immediately.

**Cause**

By default, `restricted_agents` includes `"plan"`, and Plan-mode goals start paused.

**Solution**

- Switch to Build mode and run `/goal resume` to activate the goal.
- To disable this restriction, set `allow_goal_execution_from_plan: true` in the plugin options (not recommended).

## Goal closed prematurely

**Problem**

The goal was marked complete or unmet without sufficient evidence.

**Cause**

The agent closed the goal without verifying all requirements.

**Solution**

- Use `/goal history` to review how the goal was closed.
- Use `/goal edit <updated objective>` and `/goal resume` to restart with clearer criteria.
- Include specific verification steps in the original objective.

## State file permission errors

**Problem**

The plugin logs permission errors when writing goal state.

**Cause**

The state file has restrictive permissions from a previous owner or process.

**Solution**

- Remove the state file: `rm ~/.local/share/opencode-goal-plugin/goals.json`.
- Ensure the OpenCode process has write access to the parent directory.