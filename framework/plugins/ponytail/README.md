# Ponytail Plugin

## Overview

Ponytail makes your AI agent think like the laziest senior dev in the room. Before writing code, the agent climbs a ladder of checks: YAGNI first, then reuse what exists, reach for stdlib, native features, installed deps, one-liners, and only then the minimum code that works. The result is less code, lower cost, and faster sessions without cutting safety.

Official source:

- [GitHub: DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
- [npm: @dietrichgebert/ponytail](https://www.npmjs.com/package/@dietrichgebert/ponytail)

## Features

- **Lazy senior dev ladder**: seven-rung decision tree the agent climbs before writing code.
- **Slash commands**: `/ponytail [lite|full|ultra|off]`, `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help`.
- **Mode switching**: four intensity levels (off, lite, full, ultra) persisted across sessions.
- **Bundled skills**: review, audit, debt, gain, and help skills included.
- **Always-on injection**: ruleset appended to the system prompt every turn.
- **Agent-portable**: works with 16+ agent platforms via rules files, AGENTS.md, or plugins.

## When to Use

Use this plugin in any coding session where the agent tends to over-engineer, write unnecessary abstractions, or reach for dependencies instead of simpler solutions.

Good fits:
- Reducing code bloat and unnecessary complexity.
- Lowering token usage and API costs.
- Enforcing YAGNI and reuse-first discipline.
- Reviewing diffs for over-engineering.

Avoid when the task explicitly needs complex scaffolding, heavy abstractions, or framework boilerplate.

## Requirements

- OpenCode >= 1.17.0 (for plugin loading).
- Node.js on PATH (for lifecycle hooks).

## Related Skills

Relevant skills in this repository:

- [`code-review`](../../skills/code-review/SKILL.md): review backend changes for correctness and maintainability, complementary to ponytail's over-engineering focus.
- [`backend-best-practices`](../../skills/backend-best-practices/SKILL.md): backend best practices for refactoring and behavior-preserving cleanup.
- [`pull-request`](../../skills/pull-request/SKILL.md): prepare small, reviewable changes aligned with ponytail's minimal-diff philosophy.
