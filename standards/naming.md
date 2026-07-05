# Naming Standard

## Purpose

Define reusable backend engineering rules for naming decisions across projects. This standard is canonical guidance for related skills.

## Rules

- Make ownership, boundaries, and invariants explicit.
- Prefer simple, compatible changes over broad rewrites.
- Protect correctness, security, and data integrity before optimizing convenience.
- Require evidence for performance, reliability, and complexity claims.
- Document operational impact when behavior changes in production.

## Best Practices

- Use clear names that describe business meaning.
- Keep changes small enough to review and roll back.
- Validate inputs at boundaries and enforce invariants where data changes.
- Include tests for normal paths, edge cases, and failure paths.
- Add logs, metrics, traces, or runbooks when operators need them.

## Anti-patterns

- Hidden breaking changes.
- Premature abstraction or speculative scaling.
- Unbounded queries, retries, payloads, or background work.
- Authorization or validation performed only in user-interface assumptions.
- Comments or documents that repeat code without explaining decisions.

## Checklist

- [ ] The decision is necessary and scoped.
- [ ] Compatibility and migration risk are understood.
- [ ] Failure modes are handled deliberately.
- [ ] Tests and operational evidence are sufficient.
- [ ] Rollback or mitigation is possible.

## Related Skills

- `skills/backend-engineer/SKILL.md`
- `skills/code-review/SKILL.md`
- `skills/refactoring/SKILL.md`
