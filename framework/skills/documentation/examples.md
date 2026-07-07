# Documentation Examples

## Example 1: ADR for Cache Strategy

Write an ADR documenting the decision to add Redis caching for product catalog reads. Good agent behavior:

- State the context: product catalog reads are 500 req/s, each takes 50ms from PostgreSQL, and latency spikes during flash sales.
- List alternatives considered: in-memory cache (lost on restart, per-node inconsistency), read replicas (cost, replication lag), CDN (static data only).
- Describe the decision: Redis cache-aside with 5-minute TTL and immediate invalidation on price or stock changes.
- Record consequences: increased operational complexity (need Redis cluster, monitoring), cache hit ratio must be >90% to justify cost.
- Link to related ADRs for deployment topology and monitoring setup.

## Example 2: Runbook for Payment Failure

Write a runbook for diagnosing payment processing failures. Good agent behavior:

- Start with the alert trigger (e.g., >5% payment failures in 5 minutes) and the severity level.
- Provide step-by-step diagnosis: check the payment provider status page, then look at the circuit breaker state, then inspect dead-letter queue.
- List the dashboards and log queries needed (payment error rate by provider, latency p95, DLQ count).
- Include remediation steps: toggle the kill switch to fallback provider, reset circuit breaker after provider recovers, replay DLQ messages.
- End with escalation contacts and a post-mortem template link for the follow-up.

## Example 3: API Docs for Public Endpoint

Document a public POST /orders endpoint for external developers. Good agent behavior:

- Show a complete request example with all fields, including `Idempotency-Key` in the header and `X-Api-Version`.
- Show success (201), validation error (422), and conflict (409) response bodies with annotated fields.
- Document authentication: `Bearer` token in the `Authorization` header with required scopes.
- Note rate limits (100 req/min per token) and include `X-RateLimit-Remaining` in the response.
- List every error code with a human-readable message, a likely cause, and a recovery action.
