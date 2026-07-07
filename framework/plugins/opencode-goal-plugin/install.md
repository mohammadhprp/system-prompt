# OpenCode Goal Plugin Installation

## Requirements

- OpenCode >= 1.17.1 installed.

## Installation

Install locally for the current OpenCode project:

```bash
opencode plugin @prevalentware/opencode-goal-plugin
```

Install globally:

```bash
opencode plugin -g @prevalentware/opencode-goal-plugin
```

OpenCode detects both package entrypoints and writes the plugin into the server and TUI config targets.

## Manual Config

If you configure it manually, add the package to both config files.

`opencode.json`:

```json
{
  "plugin": ["@prevalentware/opencode-goal-plugin"]
}
```

`tui.json`:

```json
{
  "plugin": ["@prevalentware/opencode-goal-plugin"]
}
```

## Verification

After installing, start or restart OpenCode and run:

```
/goal
```

You should see the current goal state (or a message that no goal is set). The TUI should also show a goal indicator in the sidebar.

## Updating

```bash
opencode plugin update @prevalentware/opencode-goal-plugin
```

## Uninstalling

```bash
opencode plugin remove @prevalentware/opencode-goal-plugin
```

Then remove the plugin entries from `opencode.json` and `tui.json` if they were added manually.

## Common Issues

- **Plugin not found**: ensure the package name is `@prevalentware/opencode-goal-plugin` (not `opencode-goal-plugin`).
- **OpenCode version too old**: the plugin requires OpenCode >= 1.17.1. Run `opencode --version` to check.
- **Manual config required**: if the CLI install does not work, add the plugin to both `opencode.json` and `tui.json` manually.