# Observability Examples

## Example 1: Order Processing Pipeline

Instrument an event-driven order processing pipeline for observability. Good agent behavior:

- Add structured logs at every stage: order received, payment authorized, inventory reserved, shipment queued—each with order_id, tenant_id, and duration.
- Emit metrics: orders received per second, orders completed per second, error rate by stage, and p50/p95/p99 latency per stage.
- Create a dashboard with panels for throughput (rate graph), errors (stacked bar by error type), latency (heatmap), and queue depth.
- Add tracing with a shared trace_id propagated across services so a single failed order can be followed end-to-end.
- Write a synthetic health check that places a test order every minute and alerts if it does not complete within 30 seconds.

## Example 2: Health Check Design

Design liveness and readiness endpoints for a service backed by PostgreSQL and RabbitMQ. Good agent behavior:

- Liveness endpoint (`GET /healthz`): return 200 if the process is alive and the HTTP server is accepting connections; no dependency checks.
- Readiness endpoint (`GET /ready`): check PostgreSQL connectivity with a `SELECT 1` and RabbitMQ with a queue declare; fail if either is down.
- Add a /startup endpoint that returns 200 only after initial migrations and warmup complete; used by orchestrator to delay traffic.
- Set probe intervals: liveness every 10s (failure timeout 30s), readiness every 5s (failure timeout 10s) for fast pod removal.
- Log every health check transition (ready -> not ready) with the failing dependency for quick triage.

## Example 3: Alert Tuning

Reduce alert noise for a high-traffic GET /products endpoint that pages the on-call team 20 times a day. Good agent behavior:

- Analyze the p99 latency over the past 30 days; set the alert threshold at p99 + 20% rather than a fixed 500ms that fires on every spike.
- Add a burn-rate approach: alert only if elevated latency persists for 5+ consecutive minutes, not on single blips.
- Introduce a dashboard panel with the alert threshold overlaid on the latency graph so on-call can see the margin.
- Write a runbook inline with the alert: first step is to check the database connection pool and query cache hit ratio.
- Add a separate, less urgent warning at 2x the threshold to catch gradual degradation before it pages anyone.
