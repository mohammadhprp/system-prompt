# Memory

Persistent agent memory files that maintain context across sessions.

Memory files are installed to `.opencode/memory/` and auto-included in the
agent's `instructions` via the glob pattern `.opencode/memory/*.md`.

## Files

- `codebase-insights.md` — Non-obvious facts, gotchas, past decisions, and architecture quirks.
- `user-preferences.md` — Coding style, naming conventions, and architectural preferences.

## Behavior

Memory files are **only written on first install**. Re-running the installer
will not overwrite them — preserving any edits made by the user or agent
across sessions.
