# Ponytail Plugin Capabilities

## What It Can Do

### Slash Commands

| Command | Description |
|---|---|
| `/ponytail` | Report the current mode |
| `/ponytail lite` | Set lightweight mode (gentle nudge) |
| `/ponytail full` | Set full mode (default, standard lazy senior dev) |
| `/ponytail ultra` | Set ultra mode (aggressive minimalism) |
| `/ponytail off` | Disable ponytail |
| `/ponytail-review` | Review the current diff for over-engineering, returns a delete-list |
| `/ponytail-audit` | Audit the whole repo for over-engineering |
| `/ponytail-debt` | Harvest deferred `ponytail:` shortcuts into a ledger |
| `/ponytail-gain` | Show measured impact scoreboard (less code, cost, speed) |
| `/ponytail-help` | Quick reference for all ponytail commands |

### Bundled Skills

- `ponytail` — core lazy senior dev mode
- `ponytail-review` — diff review for over-engineering
- `ponytail-audit` — full repo audit for over-engineering
- `ponytail-debt` — technical debt tracking for shortcuts
- `ponytail-gain` — impact measurement
- `ponytail-help` — command reference

### The Ladder (Core Ruleset)

Before writing code, the agent stops at the first rung that holds:

1. **Does this need to exist?** → no: skip it (YAGNI)
2. **Already in this codebase?** → reuse it, don't rewrite
3. **Stdlib does it?** → use it
4. **Native platform feature?** → use it
5. **Installed dependency?** → use it
6. **One line?** → one line
7. **Only then**: the minimum that works

The ladder runs after the agent understands the problem — it reads the code it touches and traces the real flow before picking a rung.

### System Prompt Transformation

The plugin appends the ruleset to the system prompt every turn, so the ladder is always active. Mode switches are persisted between sessions via a state file.

## Configuration Options

Configure in `opencode.json`:

```json
{
  "plugin": ["@dietrichgebert/ponytail"]
}
```

Set the default mode via environment variable:

```bash
export PONYTAIL_DEFAULT_MODE=full
```

Or in `~/.config/ponytail/config.json` (`%APPDATA%\ponytail\config.json` on Windows):

```json
{
  "defaultMode": "full"
}
```

### Mode Levels

| Mode | Description |
|---|---|
| `off` | Disabled, no rules injected |
| `lite` | Gentle nudge toward simplicity |
| `full` | (Default) Standard lazy senior dev rules |
| `ultra` | Aggressive minimalism |

## What It Cannot Do

- It cannot override explicit user requests for complex implementations.
- It cannot guarantee correctness — it minimizes code, but validation and error handling are never cut.
- It cannot enforce YAGNI on dependencies already installed and used by the project.
- It cannot prevent the agent from building what was explicitly requested.

## Best Practices

- Start with `full` mode and adjust to `ultra` if the codebase needs aggressive simplification.
- Use `/ponytail-review` after a coding session to catch over-engineering the agent missed.
- Mark intentional shortcuts with `ponytail:` comments naming the ceiling and upgrade path.
- Review `/ponytail-debt` regularly to track deferred improvements.
- Pair with the `/pr` command for a complete quality workflow.

## Common Workflows

### Start a session with ponytail

1. Install the plugin and start OpenCode.
2. Run `/ponytail` to confirm the mode (defaults to `full`).
3. Work as usual — the ruleset is active every turn.

### Review a diff

1. After making changes, run `/ponytail-review`.
2. Review the delete-list and remove unnecessary code.

### Switch mode mid-session

1. Run `/ponytail ultra` to go aggressive.
2. Run `/ponytail off` to disable temporarily.
3. The mode persists across session restarts.
