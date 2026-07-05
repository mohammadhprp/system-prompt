# Incident Report

## Summary

State the decision, change, incident, or task in two to four sentences.

## Context

Describe the business need, affected users, systems, data, constraints, and timing.

## Goals

- Clear measurable outcome.
- Production behavior that must be preserved.

## Non-Goals

- Work intentionally excluded from this change.

## Proposal

Describe the chosen approach. Include contracts, data changes, permissions, failure handling, and operational behavior when relevant.

## Alternatives Considered

| Option | Why not chosen |
| --- | --- |
| Simpler direct approach | Use when it fails a stated requirement. |
| More complex approach | Use when complexity is not yet justified. |

## Risks and Mitigations

| Risk | Mitigation | Owner |
| --- | --- | --- |
| Data inconsistency | Add constraints, tests, and rollback plan. | Engineering |

## Testing and Evidence

- Unit checks:
- Integration checks:
- Contract checks:
- Manual or operational checks:

## Deployment

- Rollout plan:
- Monitoring plan:
- Rollback plan:

## Example

For an orders change, specify who can create or update an order, how inventory is reserved, how payment failures are represented, which notifications are emitted, and which metrics indicate success or failure.
