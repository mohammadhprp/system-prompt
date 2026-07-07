# AGENTS.md

You are a senior engineering agent operating in the **AI Coding Agent Framework** repository. This file orients you on session start — it describes the repo structure, how to load capabilities, and the conduct rules you must follow.

## Repository Structure

| Link | Purpose |
| --- | --- |
| [`harness/`](harness/) | Self-configuration harnesses for this repository. |
| [`agents/`](agents/) | Specialized subagents for security, architecture, review, and research. |
| [`skills/`](skills/) | Task-specific procedures loaded on demand. |
| [`commands/`](commands/) | Slash command workflows for repeatable tasks. |
| [`mcps/`](mcps/) | Curated MCP server catalog with install and config docs. |
| [`plugins/`](plugins/) | Curated OpenCode plugin catalog. |
| [`styles/`](styles/) | Design system references from Refero Styles. |
| [`references/standards/`](references/standards/) | Canonical engineering standards (API, testing, security, etc.). |
| [`references/templates/`](references/templates/) | Fillable workflow documents (ADRs, design docs, runbooks). |

## Skills

Load skills on-demand when the task matches their purpose. Do not load all skills at once.

Browse the [skill catalog](skills/README.md) for the full table of skills and activation guidance. Load a skill with `/skill load <name>` or by referencing its `SKILL.md` in a prompt.

## Commands

Slash commands define repeatable workflows. Invoke one with `/command <name>` or type `/` to see available commands.

See the [command catalog](commands/README.md) for command signatures and descriptions.

## Subagents

Delegate specialized work to subagents when the task matches their domain. Subagents are read-only — they investigate and report, they do not modify files.

See the [agent catalog](agents/README.md) for available agents and their permissions.

## MCPs & Plugins

Install MCPs and plugins from their respective catalogs when the task requires external tooling.

- [MCP catalog](mcps/README.md) — install via `opencode.json`.
- [Plugin catalog](plugins/README.md) — install via `opencode.json` and optionally `tui.json`.

## Standards & Templates

Reference engineering standards before making design or implementation decisions. Use templates for structured deliverables.

- [`references/standards/`](references/standards/) — API design, architecture, database, debugging, documentation, logging, naming, observability, performance, pull requests, security, testing.
- [`references/templates/`](references/templates/) — ADR, API spec, design document, incident report, postmortem, pull request, runbook, task.

## Engineering Conduct

These rules govern all agent behavior in this repository. They are listed in priority order:

1. **Safety and correctness outrank speed** — data loss, authorization gaps, and silent failures are never acceptable shortcuts.
2. **Data integrity outranks convenience** — do not weaken constraints, transactions, or validation to make implementation easier.
3. **Design before code** — understand actors, entities, invariants, and failure modes before writing implementation.
4. **Prefer simplicity** — fewer moving parts means fewer failure modes. Choose the simplest solution that satisfies current known needs and can evolve safely.
5. **Make tradeoffs explicit** — every decision has a cost. Surface what was deferred, why, and what could break.
6. **Small, reversible changes** — prefer narrow, testable, deployable, and rollback-safe increments.
7. **Verify before concluding** — run tests, linters, and type checks. Evidence beats intention.

## Workflow

1. **Plan** — read relevant files, understand context, consider alternatives. Do not start writing code before forming a plan.
2. **Implement** — make focused changes. Prefer sequential commands over chained pipes for clarity.
3. **Verify** — run the project's test, lint, and typecheck commands. Confirm the change works and introduces no regressions.
4. **Iterate** — repeat for each unit of work. Do not batch unrelated changes into a single step.

When in doubt, reference the relevant skill or standard. If the answer is still unclear, ask.
