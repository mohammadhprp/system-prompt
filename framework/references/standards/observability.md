# Observability Standard

## Purpose

Define reusable backend engineering rules for observability decisions across projects. This standard is canonical guidance for related skills.

## Rules

- Every service must expose three endpoint types: `/healthz` (liveness — is the process alive?), `/readyz` (readiness — can it serve traffic?), and `/metrics` (prometheus format).
- Define at least one SLI per service dependency (latency, error rate, throughput, saturation) with an SLO target; record SLO compliance as a metric.
- Every production alert must have a runbook link and be actionable; pages for symptoms, not causes, and must fire before the SLO burn rate violates the error budget.
- Use three metric types: Counter (cumulative, only increases), Gauge (point-in-time value), Histogram (latency/size distributions with configurable buckets).
- Trace every request from ingress to egress with OpenTelemetry; sample at head (consistent per trace_id) with a minimum 5% rate in production.

## Best Practices

- Keep metric cardinality bounded: label values must have a known, finite set (e.g., `status_code`, `endpoint`, `region`); never put user IDs, request IDs, or unbounded values in labels.
- Build dashboards in tiers: Tier 1 (on-call, red/green, ~5 graphs), Tier 2 (team, weekly review, ~15 graphs), Tier 3 (deep-dive, ad-hoc).
- Use RED metrics for request-driven services (Rate, Errors, Duration) and USE metrics for resources (Utilization, Saturation, Errors).
- Set up synthetic probes from outside the cluster to measure real user-facing latency independently of internal metrics.
- Conduct a quarterly SLO review: adjust targets, retire unused alerts, validate runbooks against actual incidents.

## Anti-patterns

- Alerting on every 5xx without aggregation or burn-rate logic; one noisy alert trains everyone to ignore it.
- Dashboards with dozens of unrelated graphs that nobody looks at; prefer focused views owned by specific teams.
- Adding high-cardinality labels (user_id, email, session_id) to metrics; use logging for individual entities, metrics for aggregates.
- Deploying without metrics or tracing, then trying to add observability retroactively during an incident.
- Using liveness probes that depend on downstream services; a failing database should cause readiness to fail, but the process should stay alive.

## Checklist

- [ ] `/healthz`, `/readyz`, and `/metrics` endpoints exist and are tested.
- [ ] SLOs are defined per service dependency and recorded as metrics.
- [ ] Alerts use burn-rate logic, have runbook links, and are pager-worthy.
- [ ] Metric label cardinality is bounded and reviewed for explosion risk.
- [ ] Distributed tracing is configured with consistent sampling across services.

## Related Skills

- `skills/code-review/SKILL.md`
- `skills/backend-best-practices/references/observability.md`
