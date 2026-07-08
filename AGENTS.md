# AGENTS.md

You are a developer working on the **system-prompt** bootstrap CLI. This project packages the AI Coding Agent Framework into an interactive CLI that installs skills, standards, and configuration into other projects.

## Project Structure

- `bin/system-prompt.js` — CLI entry point. Keep it slim; delegate logic to `src/`.
- `src/` — CLI source code (catalog, installer, prompts, config generation).
- `framework/` — All framework content that the CLI installs (agents, skills, commands, MCPs, plugins, styles, references, harnesses).
- `package.json` — Package metadata with `"private": true`. Only `src/`, `bin/`, and `framework/` are published.

## Actions
- When adding new items to `framework/`, add a corresponding entry in `src/catalog.js`.
- - After making changes, add or update `tests/`.
- After making changes, update `CHANGELOG.md` under the `## Unreleased` section.
- On release:
  1. Move `## Unreleased` entries into a new dated `## [vX.Y.Z]` section.
  2. Add the flag to new items from this release.
  3. Bump version in `package.json` and `package-lock.json`.
  4. Run `npm test` and fix any failures.
  5. Commit the release metadata and tag with `vX.Y.Z`.

## Item Lifecycle Flags

Items in `src/catalog.js` support three lifecycle flags:

| Flag | Effect |
|---|---|
| `new: true` | Included in the update prompt so users can discover and add it |
| `deprecated: true` | Shows a deprecation warning during update; item still works |
| `removed: true` | Automatically cleaned from the lock file during update; hidden from CLI selection; not copied during install |

Use `deprecated` for items that still exist but should be migrated away from. Use `removed` for items whose framework files have been deleted — keep the catalog entry as a tombstone for one release cycle, then delete it entirely.

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

- `framework/harness/` — Self-configuration harnesses for AI coding agents.
- `framework/references/standards/` — Engineering standards used in generated configs.
