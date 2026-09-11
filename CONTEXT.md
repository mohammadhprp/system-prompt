# CONTEXT.md

You are a developer working on the **system-prompt** bootstrap CLI. This project packages the AI Coding Agent Framework into an interactive CLI that installs skills, standards, and configuration into other projects.

## Project Structure

- `src/` — CLI source code, grouped by responsibility:
  - `catalog.js` — category data (`title`, `sourceDir`, `itemLayout`, `copyItems`, `items`). Add new installable content here.
  - `item-layout.js` — derives source/target paths, lock categories, copy/delete behavior, and item removal from the catalog. Add a category here, not in per-consumer lists.
  - `paths.js` — package root, source resolution, package version, ENOENT helper, and safe-destination (symlink/escape) checks.
  - `hash.js` — SHA-256 content hashing shared by the installer and doctor.
  - `ui.js` — dependency-free, color-aware status lines.
  - `doctor.js` — installation health checks.
  - `config/` — generated agent config: `opencode.js`, `tui.js`, `mcp.js`.
  - `install/` — installation engine: `index.js` (orchestration), `files.js` (copy/delete), `merge.js` (JSON/gitignore merging), `lock.js` (lock schema/IO), `env.js`, `templates.js`.
  - `cli/` — command line: `index.js` (entry), `args.js`, `plan.js` (diff/summary), `interactive.js`, `tui-preferences.js`, `clack-ui.js`.
- `bin/system-prompt.js` — CLI entry point. Keep it slim; delegate logic to `src/cli/index.js`.
- `framework/` — All framework content that the CLI installs (agents, skills, commands, MCPs, plugins, styles, and references).
- `package.json` — Package metadata with `"private": true`. Only `src/`, `bin/`, and `framework/` are published.

## Actions
- When adding new items to `framework/`, add a corresponding entry in `src/catalog.js` if flag to new.
- After making changes, add or update `tests/`.
- After making changes, update `CHANGELOG.md` under the `## Unreleased` section.
- On release:
  1. Move `## Unreleased` entries into a new dated `## [vX.Y.Z]` section.
  2. Add the flag to new items from this release.
  3. Bump version in `package.json` and `package-lock.json`.
  4. Run `npm test` and fix any failures.
  5. Commit the release metadata with `chore: release vX.Y.Z` and tag with `git tag -a vX.Y.Z -m "Release version X.Y.Z"`.

## Build & Test

- No build step. Plain Node.js ESM.
- Write test for you changes.

## Engineering Conduct

1. **Safety before speed** — file operations validate paths; never overwrite without confirmation.
2. **Design before code** — understand the CLI flow before modifying prompts or installer logic.
3. **Prefer simplicity** — zero build tools, zero bundlers, minimal dependencies.
4. **Verify before concluding** — run syntax checks and integration tests after every change.
5. **Small, reversible changes** — keep commits focused on one concern.

## Related

- `framework/references/standards/` — Engineering standards used in generated configs.
