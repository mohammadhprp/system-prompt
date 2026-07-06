# AI Coding Agent Framework

A framework-agnostic system for AI coding agents. It combines reusable skills, engineering standards, templates, and MCP server documentation so agents can reason, design, review, test, operate, and connect to project-aware tools with senior engineering discipline.

This repository is not just a prompt dump or a skill library. It is a structured, extensible operating framework for AI-assisted software engineering.

## Philosophy

Backend work is mostly judgment: choosing simple boundaries, protecting data integrity, designing for failure, and making changes safely. These skills are intentionally opinionated:

- Design before coding because implementation should follow a clear operating model.
- Prefer the simplest solution that satisfies current requirements and leaves safe extension points.
- Treat data, security, reliability, and observability as first-class design concerns.
- Make tradeoffs explicit so humans can approve risks.
- Produce small, reversible changes with evidence.

## Goals

- Help AI agents act like senior backend engineers, architects, reviewers, and mentors.
- Provide canonical standards that apply across programming languages and platforms.
- Keep skills practical, navigable, consistent, and extensible.
- Support Claude Code, OpenAI Codex, OpenCode, and similar coding agents.

## Repository Structure

| Path | Purpose |
| --- | --- |
| `AGENTS.md` | Entry point for agents: loading rules, skill map, conflict resolution. |
| `system-prompt.md` | Global behavior contract for backend engineering work. |
| `skills/` | Procedural skills used for specific tasks. |
| `mcps/` | Curated MCP catalog with install, configuration, capability, and troubleshooting documentation. |
| `plugins/` | Curated OpenCode plugin catalog with install, capabilities, and troubleshooting documentation. |
| `references/standards/` | Canonical engineering standards referenced by skills. |
| `references/templates/` | Ready-to-use workflow documents. |


## MCP Catalog

The [`mcps/`](mcps/) directory is a curated catalog of Model Context Protocol servers for AI coding agents. Each entry explains what the MCP does, when to use it, how to install it, how to configure it across common AI clients, and how to troubleshoot it.

MCPs are useful because they let agents connect to project-aware tools through a standard protocol instead of relying only on static files or generic model knowledge. A good MCP can expose documentation search, runtime inspection, logs, schema information, or other controlled capabilities that make agent output more accurate and easier to verify.

### How to Choose an MCP

Before adding an MCP to a project, check:

- **Fit**: the server should match the framework, platform, or workflow being worked on.
- **Authority**: prefer first-party or officially documented MCPs.
- **Permissions**: understand whether the MCP can read secrets, query databases, execute code, or modify state.
- **Client support**: confirm the target AI client supports the MCP transport and configuration format.
- **Operational value**: install MCPs that materially improve context, safety, or verification.

## Plugin Catalog

The [`plugins/`](plugins/) directory is a curated catalog of OpenCode plugins for AI coding agents. Each entry explains what the plugin does, when to use it, how to install it, how to configure it, and how to troubleshoot it.

Plugins extend OpenCode with custom commands, agent tools, TUI elements, and lifecycle hooks that the base agent does not provide.

### How to Choose a Plugin

Before adding a plugin to a project, check:

- **Compatibility**: does the plugin support your OpenCode version?
- **Capabilities**: does it add commands, tools, or UI that improve your workflow?
- **Permissions**: does it read or write files outside the project directory?
- **Maintenance**: is the plugin actively maintained and documented?

## How AI Agents Should Use This Repository

1. Read `AGENTS.md` first.
2. Load `system-prompt.md` as the global behavior baseline when supported.
3. Select only the skills relevant to the current task.
4. Apply standards as canonical rules, not optional advice.
5. Use templates when producing engineering artifacts.
6. If requirements are unclear, ask concise clarifying questions before implementation.

## Skills

- `backend-engineer`: general problem solving, requirements analysis, risk management.
- `api-design`: resource contracts, compatibility, validation, errors, idempotency.
- `database-design`: modeling, constraints, transactions, indexes, migrations.
- `architecture-review`: boundaries, coupling, cohesion, scaling, reliability.
- `code-review`: readability, correctness, testing, maintainability, security.
- `security`: authentication, authorization, secrets, input handling, least privilege.
- `performance`: profiling, caching, query optimization, CPU, memory, network.
- `testing`: unit, integration, contract, end-to-end, deterministic tests.
- `debugging`: reproduction, isolation, root cause analysis, evidence gathering.
- `observability`: logs, metrics, traces, health checks, alerts.
- `refactoring`: safe behavior-preserving improvements.
- `documentation`: ADRs, design docs, runbooks, operational docs.
- `pull-request`: small changes, clear evidence, deployment and rollback notes.
- `chrome-devtools`: browser automation, debugging, performance analysis, screenshots.
- `gitlab-mcp`: merge requests, issues, pipelines, repositories, CI/CD workflow.
- `jira-mcp`: issue management, JQL search, comments, project inspection.
- `laravel-best-practices`: Laravel PHP patterns, Eloquent, validation, security, testing.
- `lavish`: rich HTML artifacts, visual reviews, annotated feedback loops.
- `notion-mcp`: pages, databases, comments, search, workspace management.
- `skill-creator`: skill design, iteration, evaluation, and performance benchmarking.

## Customization

Teams can customize this repository by:

- Adding organization-specific standards under `references/standards/`.
- Creating new skills under `skills/<skill-name>/SKILL.md` using the existing format.
- Editing templates to match internal review and incident practices.
- Adding project-specific agent instructions in a downstream `AGENTS.md`.

Keep additions small, explicit, and framework-agnostic unless they live in a downstream project.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md). Contributions should improve clarity, correctness, and operational usefulness. Avoid duplicating guidance that belongs in standards.

## FAQ

### Is this tied to a specific language or framework?

> No. Guidance is intentionally expressed as engineering decisions, workflows, and checks.

### Is this a prompt collection?

> No. The skills are operational procedures that agents apply selectively.

### Can humans use it?

> Yes. The standards and templates are useful for reviews, design discussions, and onboarding.

### How should conflicts be handled?

> Use [AGENTS.md](AGENTS.md): safety and correctness outrank speed; data integrity outranks convenience; explicit user requirements outrank defaults when they do not create unacceptable risk.

## License

[MIT](LICENSE)
