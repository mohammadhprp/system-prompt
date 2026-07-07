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
| `harness/` | Harness configurations for this repository. |
| `agents/` | Specialized subagents for security audits, architecture, code review, and research. |
| `skills/` | Curated skill catalog with definitions, workflows, and examples. |
| `commands/` | Slash command catalog with repeatable agent workflows. |
| `mcps/` | Curated MCP catalog with install, configuration, capability, and troubleshooting documentation. |
| `plugins/` | Curated OpenCode plugin catalog with install, capabilities, and troubleshooting documentation. |
| `styles/` | Curated design system catalog from Refero Styles — colors, typography, spacing, and component references. |
| `references/standards/` | Canonical engineering standards referenced by skills. |
| `references/templates/` | Ready-to-use workflow documents. |


## MCP

The [`mcps/`](mcps/) directory is a curated catalog of Model Context Protocol servers for AI coding agents. Each entry explains what the MCP does, when to use it, how to install it, how to configure it across common AI clients, and how to troubleshoot it.

MCPs are useful because they let agents connect to project-aware tools through a standard protocol instead of relying only on static files or generic model knowledge. A good MCP can expose documentation search, runtime inspection, logs, schema information, or other controlled capabilities that make agent output more accurate and easier to verify.

### How to Choose an MCP

Before adding an MCP to a project, check:

- **Fit**: the server should match the framework, platform, or workflow being worked on.
- **Authority**: prefer first-party or officially documented MCPs.
- **Permissions**: understand whether the MCP can read secrets, query databases, execute code, or modify state.
- **Client support**: confirm the target AI client supports the MCP transport and configuration format.
- **Operational value**: install MCPs that materially improve context, safety, or verification.

## Agents

The [`agents/`](agents/) directory is a catalog of specialized subagents for AI coding agents. Each subagent handles a specific domain and returns findings to the orchestrating agent.

See the full [agent catalog](agents/README.md) for available agents, their purposes, and permissions.

### How to Choose an Agent

Before invoking a subagent, check:

- **Fit**: does the agent's domain match the current need (security audit, architecture, code review, research)?
- **Permissions**: agents are read-only by design — they investigate and report, they do not modify files.
- **Scope**: agents are narrow and specialized. Use them alongside skills for comprehensive coverage.

## Skills

The [`skills/`](skills/) directory is a curated catalog of task-specific procedures for AI coding agents. Each entry has a `SKILL.md` defining triggers, workflow, and standards references, plus `examples.md` with realistic usage examples.

See the full [skill catalog](skills/README.md) for the complete list of available skills, their purposes, and when to use them.

### How to Choose a Skill

Before activating a skill, check:

- **Fit**: does the skill's purpose match the current task?
- **Scope**: general skills (Backend Engineer) cover broad reasoning; narrow skills (Laravel Best Practices) go deep on one topic.
- **Combination**: complex tasks may need multiple skills (e.g., API Design + Security + Testing).
- **Sequence**: some skills pair naturally (Architecture Review before Database Design).

## Plugin

The [`plugins/`](plugins/) directory is a curated catalog of OpenCode plugins for AI coding agents. Each entry explains what the plugin does, when to use it, how to install it, how to configure it, and how to troubleshoot it.

Plugins extend OpenCode with custom commands, agent tools, TUI elements, and lifecycle hooks that the base agent does not provide.

### How to Choose a Plugin

Before adding a plugin to a project, check:

- **Compatibility**: does the plugin support your OpenCode version?
- **Capabilities**: does it add commands, tools, or UI that improve your workflow?
- **Permissions**: does it read or write files outside the project directory?
- **Maintenance**: is the plugin actively maintained and documented?

## Styles

The [`styles/`](styles/) directory is a curated catalog of design system references from [Refero Styles](https://styles.refero.design/). Each entry provides a complete breakdown of colors, typography, spacing, components, and design tokens ready for AI coding agents.

See the full [style catalog](styles/README.md) for the complete list of available styles and their descriptions.

### How to Choose a Style

Before using a style reference, check:

- **Fit**: does the design language match the product's aesthetic and brand direction?
- **Platform**: some styles target specific platforms (dark product UI, marketing sites, developer tools).
- **Tokens**: each style includes CSS custom properties and Tailwind v4 theme configuration for direct use.
- **Constraints**: pay attention to the do's and don'ts — they encode important design decisions.

## Command

The [`commands/`](commands/) directory is a catalog of slash commands for AI coding agents. Each command defines a repeatable workflow that agents execute on demand.

See the full [command catalog](commands/README.md) for available commands, their purposes, and what skills they load.

## FAQ

### Is this tied to a specific language or framework?

> No. Guidance is intentionally expressed as engineering decisions, workflows, and checks.

### Is this a prompt collection?

> No. The skills are operational procedures that agents apply selectively.

### Can humans use it?

> Yes. The standards and templates are useful for reviews, design discussions, and onboarding.

### How AI Agents should install and config this repository?

> Read `harness/README.md`

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md). Contributions should improve clarity, correctness, and operational usefulness. Avoid duplicating guidance that belongs in standards.

## License

[MIT](LICENSE)
