# OpenCode Goal Plugin

## Overview

OpenCode Goal Plugin adds Codex-style long-running goal mode to OpenCode. It gives AI coding agents a `/goal` slash command, persistent goal state, completion evidence, idle continuation, and a terminal UI goal indicator so an OpenCode session can keep working toward one explicit objective until it is complete, blocked, or cleared.

Official source:

- [GitHub: prevalentWare/opencode-goal-plugin](https://github.com/prevalentWare/opencode-goal-plugin)
- [npm: @prevalentware/opencode-goal-plugin](https://www.npmjs.com/package/@prevalentware/opencode-goal-plugin)

## Features

- `/goal <objective>` as an OpenCode command for TUI, desktop, and web.
- Sidebar goal indicator with status, elapsed time, and objective.
- Agent tools: `get_goal`, `get_goal_history`, `create_goal`, `set_goal`, `update_goal_objective`, `update_goal`, and `clear_goal`.
- Goal close evidence: `complete` requires verified evidence, `unmet` requires a concrete blocker.
- Persistent per-session goal state with history, checkpoints, budgets, and owner-only file permissions.
- Optional automatic continuation on idle, with no-progress pause and budget wrap-up safeguards.
- Plan-mode safety: goals created from the `plan` agent stay paused; auto-continue never escapes Plan mode.
- Compaction context so active goals are preserved when OpenCode summarizes a long session.

## When to Use

Use this plugin when you want OpenCode to behave more like a goal-driven coding agent instead of a one-prompt assistant.

Good fits:

- Long refactors, migrations, or test-fixing sessions.
- Tracking one explicit objective across TUI, desktop, and web OpenCode surfaces.
- Requiring completion evidence before a goal is marked done.
- Preserving the current goal when OpenCode compacts a long conversation.

Avoid using it for simple one-shot prompts that do not need goal tracking.

## Requirements

- OpenCode >= 1.17.1.

## Related Skills

Relevant skills in this repository:

- [`backend-best-practices`](../../skills/backend-best-practices/SKILL.md): backend best practices for refactoring, debugging, and testing.