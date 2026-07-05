---
name: Security
description: Apply practical security review across identity, access, secrets, data handling, and abuse resistance.
version: 0.1.0
---
# Purpose
Apply practical security review across identity, access, secrets, data handling, and abuse resistance. This skill guides an AI agent to act with senior backend judgment: clarify the outcome, identify constraints, choose the least complex safe path, and make production impact visible.

# When to Activate
Use this skill when the task involves authentication, authorization, secrets, encryption, OWASP-style risks, injection, input validation, output encoding, rate limiting, abuse prevention, or least privilege. It is also useful when a request is vague, risky, touches production behavior, changes contracts, changes data, or needs a reviewable engineering plan. Do not activate it for trivial text edits unless the edit changes engineering guidance.

# Principles
- Correctness and data integrity come before speed of implementation.
- Simplicity is a feature: fewer moving parts means fewer failure modes.
- Existing contracts must remain compatible unless a breaking change is approved.
- Every important decision should have a reason, an alternative considered, and an operational consequence.
- Work should be testable, observable, deployable, and reversible.
- Prefer explicit boundaries, clear names, and local reasoning over clever shared abstractions.
- Security and privacy are design inputs, not final review steps.

- Treat all input as untrusted, including internal calls, background jobs, files, and message payloads.
- Enforce least privilege for users, services, tokens, storage, and operational access.
- Secrets must never appear in source, logs, errors, metrics, traces, or examples.
- Use encryption deliberately for data in transit and sensitive data at rest.
- Prevent injection by separating commands from data and validating allowed shapes.
- Output encoding and safe error responses prevent data disclosure.
- Abuse controls such as rate limits should protect expensive and sensitive actions.

# Workflow
1. Restate the user goal in concrete backend terms.
2. Identify actors, data, invariants, failure modes, and external dependencies.
3. Inspect existing project conventions before proposing changes.
4. Decide whether clarifying questions are required. Ask only questions that materially affect design or risk.
5. Produce a small plan: contract, data changes, behavior changes, tests, observability, deployment, and rollback.
6. Compare at least one simpler alternative when the proposed solution adds complexity.
7. Implement incrementally, preserving existing behavior where possible.
8. Verify with the narrowest meaningful tests first, then broader checks when risk justifies them.
9. Summarize tradeoffs, residual risks, and follow-up work that should not block the current change.

# Rules
- Never assume hidden requirements, traffic scale, compliance needs, or data retention rules.
- Do not introduce new infrastructure unless the current requirement cannot be met safely without it.
- Do not hide breaking changes in refactors.
- Do not weaken authorization, validation, transaction safety, or error handling to make implementation easier.
- Keep public contracts, migrations, and operational changes explicit in the deliverable.
- Reference related standards: standards/security.md.

# Deliverables
- A concise engineering plan or review summary.
- Explicit assumptions and clarifying questions when needed.
- Contract, data, test, observability, deployment, and rollback notes for production changes.
- Concrete risks with mitigations.
- A checklist showing completion evidence.

# Common Mistakes
- Starting with code before understanding invariants.
- Designing for imagined future scale while ignoring present correctness.
- Treating validation, authorization, logging, and tests as optional polish.
- Creating generic abstractions after seeing only one use case.
- Optimizing without measurement or failing to define the target metric.
- Writing documents that describe implementation but omit failure handling.

# Failure Modes
- A simple request becomes a broad rewrite.
- A change works locally but cannot be safely deployed or rolled back.
- Data becomes inconsistent because constraints or transactions were skipped.
- Operators cannot diagnose incidents because logs and metrics are missing.
- Reviewers cannot evaluate risk because decisions and assumptions are implicit.

# Checklist
- [ ] Goal, scope, and non-goals are clear.
- [ ] Simpler alternatives were considered.
- [ ] Data integrity and compatibility are protected.
- [ ] Security and authorization impact is reviewed.
- [ ] Tests cover important behavior and edge cases.
- [ ] Logs, metrics, traces, or health signals are included when operationally relevant.
- [ ] Deployment and rollback are understood.
- [ ] The final answer explains reasoning and evidence.
