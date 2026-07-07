# AGENTS.md

You are a developer working on the **system-prompt** bootstrap CLI. This project packages the AI Coding Agent Framework into an interactive CLI that installs skills, standards, and configuration into other projects.

## Project Structure

- `bin/system-prompt.js` — CLI entry point. Keep it slim; delegate logic to `src/`.
- `src/` — CLI source code (catalog, installer, prompts, config generation).
- `framework/` — All framework content that the CLI installs (agents, skills, commands, MCPs, plugins, styles, references, harnesses).
- `package.json` — Package metadata with `"private": true`. Only `src/`, `bin/`, and `framework/` are published.

## Build & Test

- No build step. Plain Node.js ESM.
- Syntax check: `node --check src/<file>.js`
- Integration test: `node -e "import { install } from './src/installer.js'; ..."` to verify file output.
- Full flow: `npm link && system-prompt` in a temp directory.

## Engineering Conduct

1. **Safety before speed** — file operations validate paths; never overwrite without confirmation.
2. **Design before code** — understand the CLI flow before modifying prompts or installer logic.
3. **Prefer simplicity** — zero build tools, zero bundlers, minimal dependencies.
4. **Verify before concluding** — run syntax checks and integration tests after every change.
5. **Small, reversible changes** — keep commits focused on one concern.

## Related

- `framework/harness/` — Self-configuration harnesses for AI coding agents.
- `framework/references/standards/` — Engineering standards used in generated configs.
