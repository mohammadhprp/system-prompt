# Backend Engineering Skills

A framework-agnostic AI skills repository for backend software engineering. It teaches AI coding agents how to reason, design, review, test, and operate backend systems with the discipline expected from a senior engineer.

This repository is not a prompt dump. It is a structured library of reusable skills, standards, and templates that agents can load only when relevant.

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
| `standards/` | Canonical engineering standards referenced by skills. |
| `templates/` | Ready-to-use workflow documents. |

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

## Customization

Teams can customize this repository by:

- Adding organization-specific standards under `standards/`.
- Creating new skills under `skills/<skill-name>/SKILL.md` using the existing format.
- Editing templates to match internal review and incident practices.
- Adding project-specific agent instructions in a downstream `AGENTS.md`.

Keep additions small, explicit, and framework-agnostic unless they live in a downstream project.

## Contributing

See `CONTRIBUTING.md`. Contributions should improve clarity, correctness, and operational usefulness. Avoid duplicating guidance that belongs in standards.

## Roadmap

- Add more examples for event-driven workflows and batch processing.
- Add checklist packs for production readiness reviews.
- Add compatibility notes for common agent directory conventions.
- Add release validation scripts for formatting and terminology checks.

## FAQ

### Is this tied to a specific language or framework?

No. Guidance is intentionally expressed as engineering decisions, workflows, and checks.

### Is this a prompt collection?

No. The skills are operational procedures that agents apply selectively.

### Can humans use it?

Yes. The standards and templates are useful for reviews, design discussions, and onboarding.

### How should conflicts be handled?

Use `AGENTS.md`: safety and correctness outrank speed; data integrity outranks convenience; explicit user requirements outrank defaults when they do not create unacceptable risk.

## License

[MIT](LICENSE)
