---
name: Code Review
description: Review backend changes for correctness, readability, maintainability, tests, performance, and security.
version: 0.1.0
---
# Purpose
Review backend changes for correctness, readability, maintainability, tests, performance, and security. This skill guides an AI agent to act with senior backend judgment: clarify the outcome, identify constraints, choose the least complex safe path, and make production impact visible.

# When to Activate
Use this skill when the task involves reviewing readability, correctness, naming, maintainability, testing, performance, security, or documentation. It is also useful when a request is vague, risky, touches production behavior, changes contracts, changes data, or needs a reviewable engineering plan. Do not activate it for trivial text edits unless the edit changes engineering guidance.

# Principles
- Correctness and data integrity come before speed of implementation.
- Simplicity is a feature: fewer moving parts means fewer failure modes.
- Existing contracts must remain compatible unless a breaking change is approved.
- Every important decision should have a reason, an alternative considered, and an operational consequence.
- Work should be testable, observable, deployable, and reversible.
- Prefer explicit boundaries, clear names, and local reasoning over clever shared abstractions.
- Security and privacy are design inputs, not final review steps.

- Readability is production safety: reviewers must understand intent, invariants, and error paths.
- Correctness includes edge cases, concurrency, compatibility, and failure behavior.
- Naming should reveal business meaning rather than implementation mechanics.
- Tests should prove behavior, not mirror implementation details.
- Documentation is required when code alone cannot explain a decision or operational procedure.

# Workflow
1. Understand the change: what problem it solves, what behavior it modifies.
2. Read the diff starting with contracts and interfaces before implementation.
3. Check correctness: edge cases, concurrency, error handling, state transitions.
4. Check maintainability: naming reflects business meaning, structure matches conventions, comments explain why not what.
5. Check testing: do tests prove the behavior change? Are there missing edge cases or failure paths?
6. Check performance: are there N+1 queries, unbounded loops, unnecessary allocations?
7. Check security: are inputs validated, auth enforced, secrets exposed?
8. Provide feedback: distinguish blockers from suggestions, explain reasoning.
9. Summarize overall risk and readiness for production.

# Rules
- Never assume hidden requirements, traffic scale, compliance needs, or data retention rules.
- Do not introduce new infrastructure unless the current requirement cannot be met safely without it.
- Do not hide breaking changes in refactors.
- Do not weaken authorization, validation, transaction safety, or error handling to make implementation easier.
- Keep public contracts, migrations, and operational changes explicit in the deliverable.
- Reference related standards: references/standards/naming.md, references/standards/testing.md.

# Deliverables
- Reviewed diff with per-section comments.
- Blocker issues vs suggestions, clearly separated.
- Overall risk assessment and readiness recommendation.
- Summary of missing tests, docs, or operational signals.

# Common Mistakes
- Commenting on code style while missing correctness or security issues.
- Requesting changes without explaining why they matter for production safety.
- Approving changes that lack tests for failure paths and edge cases.
- Ignoring operational concerns like logging, metrics, and error handling.
- Treating reviewer feedback as blocking when it is a suggestion.

# Failure Modes
- A subtle correctness issue passes review because the reviewer focused on style.
- A change is approved without test coverage for the main risk area.
- Security vulnerabilities are missed because auth and input validation were not reviewed.
- The review becomes a blocking gate rather than a quality collaboration.

# Checklist
- [ ] The change solves the stated problem without unnecessary scope.
- [ ] Contracts and public APIs remain backward compatible or the breaking change is approved.
- [ ] Edge cases, concurrency, and failure paths are handled.
- [ ] Naming reveals business meaning, not implementation mechanics.
- [ ] Tests exist for normal paths, edge cases, and failure modes.
- [ ] No secrets, credentials, or sensitive data in the diff.
- [ ] Logs, metrics, or traces are added for new operational concerns.
