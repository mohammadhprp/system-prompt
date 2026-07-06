---
name: Documentation
description: Create ADRs, design docs, runbooks, API docs, and operational knowledge that stays useful.
version: 0.1.0
---
# Purpose
Create ADRs, design docs, runbooks, API docs, and operational knowledge that stays useful. This skill guides an AI agent to act with senior backend judgment: clarify the outcome, identify constraints, choose the least complex safe path, and make production impact visible.

# When to Activate
Use this skill when the task involves ADRs, design documents, runbooks, API documentation, operational documentation, architecture diagrams, or knowledge transfer. It is also useful when a request is vague, risky, touches production behavior, changes contracts, changes data, or needs a reviewable engineering plan. Do not activate it for trivial text edits unless the edit changes engineering guidance.

# Principles
- Correctness and data integrity come before speed of implementation.
- Simplicity is a feature: fewer moving parts means fewer failure modes.
- Existing contracts must remain compatible unless a breaking change is approved.
- Every important decision should have a reason, an alternative considered, and an operational consequence.
- Work should be testable, observable, deployable, and reversible.
- Prefer explicit boundaries, clear names, and local reasoning over clever shared abstractions.
- Security and privacy are design inputs, not final review steps.

- ADRs record decisions, context, consequences, and alternatives.
- Design documents explain proposed behavior before expensive implementation.
- Runbooks explain how to operate, diagnose, mitigate, and escalate.
- API documentation must define contracts, errors, authorization, examples, limits, and compatibility.
- Architecture diagrams should show boundaries, data flow, ownership, and failure paths.
- Documentation should be close to the workflow where it is used.

# Workflow
1. Identify the audience and their primary use case for the document.
2. Choose the right document type: ADR, design doc, runbook, API reference, README.
3. Define the scope: what decisions, behavior, or procedures are covered.
4. Write the document starting with the summary for busy readers.
5. Include concrete examples, not just abstract descriptions.
6. Add failure modes and operational notes where relevant.
7. Cross-reference related documentation, code, and standards.
8. Place the document close to where it is used (same repo, same directory).
9. Review for accuracy with someone who was not involved in the writing.

# Rules
- Never assume hidden requirements, traffic scale, compliance needs, or data retention rules.
- Do not introduce new infrastructure unless the current requirement cannot be met safely without it.
- Do not hide breaking changes in refactors.
- Do not weaken authorization, validation, transaction safety, or error handling to make implementation easier.
- Keep public contracts, migrations, and operational changes explicit in the deliverable.
- Reference related standards: references/standards/documentation.md.

# Deliverables
- Document with clear audience, purpose, and type.
- Concrete examples reflecting real usage.
- Failure modes and operational notes where relevant.
- Cross-references to related code, standards, and docs.
- Ownership and update cadence defined.

# Common Mistakes
- Writing documents that repeat what the code already expresses without adding decision context.
- Creating documentation that is too long or too vague to be useful under time pressure.
- Letting documentation become stale because there is no ownership or review process.
- Writing for an imaginary audience instead of actual readers.
- Including implementation details that change frequently while omitting stable design decisions.

# Failure Modes
- A runbook is too long to read during an incident.
- An ADR describes what was decided but not why alternatives were rejected.
- Documentation lives in a separate wiki that no one updates after the initial write.
- Critical operational knowledge exists only in the head of one team member.

# Checklist
- [ ] The document has a clear audience and purpose.
- [ ] The document type matches the content (ADR, runbook, design doc, etc.).
- [ ] Examples are concrete and reflect real usage.
- [ ] Failure modes and operational notes are included where applicable.
- [ ] Cross-references to code, standards, or related docs are accurate.
- [ ] The document is reviewable by someone not involved in its creation.
- [ ] Ownership and update cadence are defined.
