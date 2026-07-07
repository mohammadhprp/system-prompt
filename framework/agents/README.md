# Agent Catalog

A catalog of specialized subagents for AI coding agents.

Subagents are focused AI agents that handle specific domains — security audits, architecture design, code review, research — and return findings to the orchestrating agent. Each subagent runs with restricted permissions suitable to its task.

## Available Agents

| Agent | Purpose | Permissions |
| --- | --- | --- |
| [Backend Architect](./backend-architect.md) | Design scalable, secure, and maintainable backend systems — APIs, databases, architecture, security, performance, DevOps. | read, bash, grep, glob, webfetch (no edit/write) |
| [Researcher](./researcher.md) | Fetch and analyze web content from URLs — external documentation, best practices, API docs, online resources. | read, write, grep, glob, webfetch (no bash, no edit) |
| [Reviewer](./reviewer.md) | Review code for correctness, maintainability, and best practices with focus on bugs. | read, bash, grep, glob (no edit/write) |
| [Security Auditor](./security-auditor.md) | Conduct security audits for REST APIs — authentication, authorization, input validation, secrets, data protection, rate limiting. | read, bash, grep, glob, webfetch (no edit/write) |

## Agent Entry Structure

```text
agents/<agent-name>.md
```

Each agent file uses YAML frontmatter with `description`, `mode`, `temperature`, and `permission` blocks, followed by markdown instructions defining the agent's behavior, workflow, and output format.

## Permission Convention

| Permission | Typical use |
| --- | --- |
| `read`, `grep`, `glob`, `list` | Allowed for most agents — needed to explore and understand code. |
| `bash` | Allowed where shell commands are needed for investigation or tooling. |
| `webfetch` | Allowed for research and security auditing agents only. |
| `edit`, `write`, `patch` | Denied for all subagents — they return findings to the orchestrator. |

## How to Contribute a New Agent

1. Create `agents/<agent-name>.md` following the existing format.
2. Write a clear `description` in the frontmatter — this determines when orchestrators invoke the agent.
3. Set `mode: subagent` and `temperature: 0.1`.
4. Define permissions matching the agent's domain (typically deny all mutation).
5. Write markdown instructions with scope, workflow, and output format.
6. Add the agent to the table in this README.

## Related Repository Areas

- [`skills/`](../skills/) contains skill definitions that agents may reference.
- [`commands/`](../commands/) contains slash commands for repeatable agent workflows.
- [`mcps/`](../mcps/) contains the MCP server catalog.
- [`plugins/`](../plugins/) contains the OpenCode plugin catalog.
- [`references/standards/`](../references/standards/) contains canonical engineering rules.
- [`references/templates/`](../references/templates/) contains reusable engineering deliverables.
