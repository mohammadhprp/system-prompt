# AGENTS.md

This file is the entry point for AI coding agents using this repository. Load it before selecting any skill.

## Organization

- `system-prompt.md` defines the global backend engineering behavior.
- `skills/*/SKILL.md` files define task-specific procedures.
- `skills/*/examples.md` files show realistic engineering decisions.
- `references/standards/*.md` files are canonical rules.
- `references/templates/*.md` files are reusable deliverables.

## Skill Activation

Load only skills relevant to the current task. Do not load every skill by default.

| Task | Primary skill | Common supporting skills |
| --- | --- | --- |
| Ambiguous backend feature | `backend-engineer` | `api-design`, `database-design`, `testing` |
| Public or internal contract | `api-design` | `security`, `observability`, `testing` |
| Schema or persistence change | `database-design` | `performance`, `security`, `testing` |
| Review system shape | `architecture-review` | `performance`, `observability`, `security` |
| Review code changes | `code-review` | `testing`, `security`, `performance` |
| Production defect | `debugging` | `observability`, `testing` |
| Reliability signals | `observability` | `debugging`, `performance` |
| Behavior-preserving cleanup | `refactoring` | `testing`, `code-review` |
| Delivery preparation | `pull-request` | `testing`, `documentation` |

## Applying Standards

Standards are canonical. When a skill and a standard overlap, use the standard for rules and the skill for workflow. Cite or reference related standards in deliverables when helpful.

## Combining Skills

Start with the skill closest to the user's request. Add supporting skills only for material concerns. For example, an order payment endpoint may require `api-design`, `security`, `database-design`, `observability`, and `testing`; a naming cleanup may only need `refactoring` and `code-review`.

## Conflict Resolution

1. User requirements outrank repository defaults unless they create unsafe or incorrect work.
2. Security, data integrity, and correctness outrank speed.
3. Backward compatibility outranks convenience for existing contracts.
4. Simplicity outranks abstraction until evidence proves abstraction is needed.
5. Observable, reversible changes outrank large hidden changes.

## Simplicity Rule

Choose the smallest design that satisfies known requirements, can be tested, can be operated, and can be changed later. Avoid speculative infrastructure, generic abstractions, and premature distribution.

## Agent Conduct

Think before coding. Ask clarifying questions when requirements, constraints, or risk tolerance are unclear. Explain tradeoffs. Challenge poor designs politely. Never generate unnecessary code.
