# Documentation Standard

## Purpose

Define reusable backend engineering rules for documentation decisions across projects. This standard is canonical guidance for related skills.

## Rules

- Every architectural decision that is non-obvious, costly to reverse, or has tradeoffs must have an ADR in `docs/adr/` following the MADR template.
- API endpoints must have a machine-readable specification (OpenAPI 3.x) that is the single source of truth; keep it in the same repository as the implementation.
- Every service must have a runbook in `docs/runbooks/` covering startup, health checks, common failure modes, and recovery steps.
- Documentation lives as close to code as possible: inline comments explain "why not what", module-level docs explain purpose, and README explains how to run/test/deploy.
- Review documentation in the same PR as the code change; docs that ship separately are never written.

## Best Practices

- Write design docs before building non-trivial features; include context, proposed solution, alternatives considered, and open questions.
- Keep README files structured: title, description, quick start, configuration, deployment, and links to detailed docs.
- Use diagrams in ADRs and design docs (Mermaid or PlantUML) to communicate system relationships visually.
- Document failure modes and their mitigation in runbooks, including step-by-step commands and expected output.
- Set a 30-day freshness SLA for runbooks; stale runbooks must be surfaced by a scheduled review.

## Anti-patterns

- README files that are outdated, have no structure, or list dead commands and obsolete environment variables.
- Writing design docs after implementation; the doc should guide the build, not describe what was built.
- Documenting obvious code behavior ("this function adds two numbers") instead of the rationale and constraints.
- Scattering documentation across wikis, Notion, Google Docs, and the repo with no single source of truth.
- ADRs that describe only the chosen solution without documenting the alternatives considered and rejected.

## Checklist

- [ ] Code changes include or update relevant documentation in the same PR.
- [ ] ADRs exist for every significant architectural decision.
- [ ] API spec (OpenAPI) is in the repo and matches the implementation.
- [ ] Runbook is up to date and tested against a staging environment.
- [ ] README reflects the current state of the project.

## Related Skills

- `skills/backend-engineer/SKILL.md`
- `skills/code-review/SKILL.md`
- `skills/documentation/SKILL.md`
