# OpenCode Harness

## Overview

This harness configures the OpenCode AI agent to work effectively in this repository. It defines which MCPs, plugins, skills, and commands the agent should load, and provides the configuration files (`opencode.json`, `tui.json`) needed to enable them.

## Features

- **Self-configuration**: guides the agent through loading the correct skills, installing MCPs, adding plugins, and registering commands.
- **Curated MCP selection**: pre-configured MCPs for browser devtools, Notion, and more from the [`mcps/`](../../mcps/) catalog.
- **Plugin support**: goal-tracking plugin enabled by default via [`tui.json`](./tui.json) and [`opencode.json`](./opencode.json).
- **Skill library**: 20+ task-specific skills in [`skills/`](../../skills/) for backend engineering, API design, testing, debugging, and more.
- **Slash commands**: reusable workflows in [`commands/`](../../commands/) for architecture review, changelogs, commits, PRs, and code review.

## When to Use

Use this harness at the start of any OpenCode session in this repository. It ensures the agent has the context, tools, and procedures it needs.

Good fits:

- Starting a new feature, refactor, or debugging session.
- Running a code review or architecture review.
- Preparing a pull request or changelog entry.
- Any task that benefits from repository-specific MCPs, plugins, or skills.

## Requirements

- OpenCode installed and configured.
- `AGENTS.md` at the repository root (loaded via `opencode.json`).

## Related Skills

- [`backend-engineer`](../../skills/backend-engineer/SKILL.md): primary skill for most tasks.
- [`code-review`](../../skills/code-review/SKILL.md): reviewing changes.
- [`pull-request`](../../skills/pull-request/SKILL.md): creating PRs.
- Any skill listed in the [skill catalog](../../skills/README.md).