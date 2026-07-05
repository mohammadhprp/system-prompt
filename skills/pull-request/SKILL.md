---
name: Pull Request
description: Prepare small, reviewable changes with clear evidence, risk, deployment, and rollback notes.
version: 0.1.0
---
# Purpose
Prepare small, reviewable changes with clear evidence, risk, deployment, and rollback notes. This skill guides an AI agent to act with senior backend judgment: clarify the outcome, identify constraints, choose the least complex safe path, and make production impact visible.

# When to Activate
Use this skill when the task involves preparing small pull requests, clear descriptions, risk analysis, testing evidence, deployment notes, or rollback strategy. It is also useful when a request is vague, risky, touches production behavior, changes contracts, changes data, or needs a reviewable engineering plan. Do not activate it for trivial text edits unless the edit changes engineering guidance.

# Principles
- Correctness and data integrity come before speed of implementation.
- Simplicity is a feature: fewer moving parts means fewer failure modes.
- Existing contracts must remain compatible unless a breaking change is approved.
- Every important decision should have a reason, an alternative considered, and an operational consequence.
- Work should be testable, observable, deployable, and reversible.
- Prefer explicit boundaries, clear names, and local reasoning over clever shared abstractions.
- Security and privacy are design inputs, not final review steps.

- A pull request should be small enough for reviewers to understand risk in one sitting.
- The description should explain why the change exists, not only what files changed.
- Include testing evidence, risk analysis, deployment notes, and rollback strategy.
- Separate refactors from behavior changes unless the refactor is required for the behavior.
- Call out migrations, public contract changes, permission changes, and operational impact.
- Respond to review by clarifying intent or changing code, not by defending ambiguity.

# Workflow
1. Keep the change small enough to review in one sitting. Split large changes into stacked PRs.
2. Write a clear description that explains why the change exists, not just what it does.
3. Include testing evidence: what was tested, what was not, and what is risky.
4. Note deployment requirements: config changes, migrations, dependency updates, feature flags.
5. Document rollback strategy: what happens if the change is reverted at each deployment phase.
6. Separate refactors from behavior changes. If they must be combined, call it out explicitly.
7. Call out migrations, contract changes, permission changes, and operational impact.
8. Respond to review feedback by clarifying intent or changing code - avoid defensive replies.

# Rules
- Never assume hidden requirements, traffic scale, compliance needs, or data retention rules.
- Do not introduce new infrastructure unless the current requirement cannot be met safely without it.
- Do not hide breaking changes in refactors.
- Do not weaken authorization, validation, transaction safety, or error handling to make implementation easier.
- Keep public contracts, migrations, and operational changes explicit in the deliverable.
- Reference related standards: standards/pull-requests.md.

# Deliverables
- PR description explaining problem, solution, and testing evidence.
- Deployment and rollback notes.
- Separated refactor and behavior change diffs where applicable.
- Migration, contract, and permission change annotations.

# Common Mistakes
- Creating PRs that are too large for thorough review.
- Writing descriptions that describe implementation steps instead of the problem being solved.
- Combining refactoring with behavior changes in the same diff.
- Ignoring deployment and rollback planning.
- Pushing new commits that mix review feedback responses with unrelated changes.

# Failure Modes
- A PR is merged without adequate review because it is too large.
- A behavior change is hidden inside a refactor, causing an undetected regression.
- A migration is deployed without a rollback plan, causing production downtime.
- A feature flag is left in place permanently because the cleanup was not planned.

# Checklist
- [ ] The PR description explains the problem, solution, and testing evidence.
- [ ] The diff is small enough for a thorough review (aim for under 400 lines).
- [ ] Refactors are separated from behavior changes.
- [ ] Config, migration, dependency, and feature flag changes are called out.
- [ ] Rollback steps are documented and tested.
- [ ] Migrations are reversible.
- [ ] The change has been tested in a staging-like environment.
