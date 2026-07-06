# Troubleshooting

## Agent Does Not Load AGENTS.md

**Symptom**: The agent does not seem aware of the repository structure or skills.

**Cause**: The `opencode.json` `instructions` field may not reference `AGENTS.md` correctly.

**Fix**: Ensure `opencode.json` contains:

```json
"instructions": ["AGENTS.md"]
```

The path is relative to the project root where OpenCode is started.

## MCP Not Connecting

**Symptom**: An MCP tool returns errors or is unavailable.

**Causes**:

- The MCP server command is not installed or not on `PATH`.
- The MCP requires an API key, token, or other credentials.
- The MCP version is incompatible with the OpenCode version.

**Fix**: Follow the specific MCP's `install.md` and `troubleshooting.md` in the [`mcps/`](../../mcps/) catalog.

## Plugin Not Loading

**Symptom**: A plugin's commands or features are not available.

**Causes**:

- The plugin package is not installed.
- The `tui.json` or `opencode.json` plugin list is missing the entry.
- The OpenCode version does not meet the plugin's `engines.opencode` requirement.

**Fix**:

1. Check the plugin's `install.md` in [`plugins/`](../../plugins/).
2. Verify the plugin is listed in both `opencode.json` and `tui.json`.
3. Run `opencode --version` and compare with the plugin's requirements.

## Slash Command Not Found

**Symptom**: The agent does not recognize a command like `/review`.

**Cause**: The command file has not been loaded in the current session.

**Fix**: Run `/command load <command-name>` or reference the command file in a prompt. Commands are defined in [`commands/`](../../commands/).

## Skill Not Loaded

**Symptom**: The agent does not follow a specific skill's procedures.

**Cause**: The skill has not been loaded for the current task.

**Fix**: Run `/skill load <skill-name>` or reference the skill's `SKILL.md` file in a prompt. See the skill activation table in [`AGENTS.md`](../../AGENTS.md) for guidance on which skill to load.

## Configuration Conflicts

**Symptom**: OpenCode behaves unexpectedly after merging `opencode.json`.

**Cause**: Existing config values may conflict with the harness config.

**Fix**: When merging, ensure:
- `"instructions"` is an array, not a single string.
- `"plugin"` entries are unique.
- `"mcp"` server names are unique and not duplicated.
- `"references"` paths are valid relative to the project root.