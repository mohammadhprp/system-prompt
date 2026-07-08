# Ponytail Plugin Installation

## Requirements

- OpenCode >= 1.17.0 installed.
- Node.js on PATH (required by lifecycle hooks; Nix/nvm users must have it on the non-interactive shell's PATH).

## Installation

### OpenCode

Add to `opencode.json`:

```json
{
  "plugin": ["@dietrichgebert/ponytail"]
}
```

Or install from a local checkout (reuses `hooks/` and `skills/`):

```json
{
  "plugin": ["./.opencode/plugins/ponytail.mjs"]
}
```

The `./` path resolves against your project's `opencode.json`. To share one checkout across projects, point it at the absolute path of the `.mjs` instead.

### Other Platforms

The plugin works with 16+ agent platforms. See the [official install guide](https://github.com/DietrichGebert/ponytail#install) for platform-specific instructions.

| Platform | Command |
|---|---|
| Claude Code | `/plugin marketplace add DietrichGebert/ponytail` then `/plugin install ponytail@ponytail` |
| Codex | `codex plugin marketplace add DietrichGebert/ponytail` |
| Copilot CLI | `copilot plugin marketplace add DietrichGebert/ponytail` |
| Gemini CLI | `gemini extensions install https://github.com/DietrichGebert/ponytail` |
| Pi agent | `pi install git:github.com/DietrichGebert/ponytail` |
| Hermes | `hermes plugins install DietrichGebert/ponytail --enable` |

## Verification

After installing, start or restart OpenCode and run:

```
/ponytail
```

You should see the current mode. The ruleset activates every turn.

## Updating

```bash
opencode plugin update @dietrichgebert/ponytail
```

## Uninstalling

Remove the plugin entry from `opencode.json`. On other platforms:

| Platform | Command |
|---|---|
| Claude Code | `/plugin remove ponytail` |
| Codex | `codex plugin remove ponytail` |
| Devin CLI | `devin plugins remove ponytail` |
| Pi agent | `pi uninstall ponytail` |

To clean up state files, run `node scripts/uninstall.js` from a clone of the repo before removing the plugin.

## Common Issues

- **Plugin not loaded**: ensure `@dietrichgebert/ponytail` is in the `plugin` array in `opencode.json`.
- **Node.js not found**: lifecycle hooks need Node.js on PATH. Verify with `node --version`.
- **Mode not persisting**: mode state is stored in `~/.config/opencode/.ponytail-active`. Check that the directory is writable.
- **Rules not applying**: the plugin injects rules via the system prompt transform. Verify the plugin is active with `/ponytail`.
