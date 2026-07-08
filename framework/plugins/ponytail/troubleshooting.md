# Ponytail Plugin Troubleshooting

## Plugin not recognized

**Problem**

OpenCode does not load the ponytail plugin.

**Cause**

The plugin name is incorrect or OpenCode cannot resolve the npm package.

**Solution**

- Verify the package name: `@dietrichgebert/ponytail`.
- Check network connectivity to the npm registry.
- Ensure OpenCode >= 1.17.0 is installed: `opencode --version`.
- Try using the local checkout path instead: `"./.opencode/plugins/ponytail.mjs"`.

## Rules not applying

**Problem**

The ponytail ruleset does not appear in the agent's behavior.

**Cause**

The plugin is not active, or the mode is set to `off`.

**Solution**

- Run `/ponytail` to check the current mode.
- If `off`, run `/ponytail full` to enable.
- Verify the plugin is listed in `opencode.json` and restart OpenCode.
- Check the plugin was installed correctly with `opencode plugin list`.

## Node.js not found

**Problem**

Lifecycle hooks fail with a Node.js error.

**Cause**

The hooks need `node` on the PATH, but it is not available in the non-interactive shell.

**Solution**

- Verify `node --version` works in a new terminal.
- Nix/nvm users: ensure Node.js is on the PATH for non-interactive shells (e.g., via `~/.zshenv` or a nix-darwin activation script).
- The skills still work without Node.js; only the always-on activation is affected.

## Mode not persisting

**Problem**

The mode resets to default after restarting OpenCode.

**Cause**

The state file cannot be written or read.

**Solution**

- Check that `~/.config/opencode/` is writable.
- Verify `~/.config/opencode/.ponytail-active` exists and is readable: `cat ~/.config/opencode/.ponytail-active`.
- Set `PONYTAIL_DEFAULT_MODE` to your preferred mode as a fallback.

## Commands not available

**Problem**

`/ponytail` or `/ponytail-review` slash commands do not appear.

**Cause**

The plugin commands are not registered, or the host does not support slash commands.

**Solution**

- Verify the plugin loaded successfully.
- Some adapters (Cursor, Windsurf, Cline) load only the ruleset, not the commands.
- Codex uses `@ponytail-review` instead of `/ponytail-review`.
- For OpenCode, ensure the plugin config points to the correct path or npm package.

## Plugin conflicts

**Problem**

Ponytail conflicts with other plugins or skills.

**Cause**

Multiple plugins modify the system prompt in conflicting ways.

**Solution**

- Run `/ponytail off` to disable ponytail and isolate the issue.
- Review other installed plugins for system prompt modifications.
- Adjust mode to `lite` for a gentler nudge that may conflict less.

## Excessive minimalism

**Problem**

The agent is cutting too much code, including necessary functionality.

**Cause**

`ultra` mode may be too aggressive for the task.

**Solution**

- Switch to `full` or `lite` mode.
- Be explicit in your prompts about what you expect.
- Ponytail never cuts validation, error handling, security, or accessibility by design.
