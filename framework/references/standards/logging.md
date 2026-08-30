# Logging Standard

## Purpose

Define reusable backend engineering rules for logging decisions across projects. This standard is canonical guidance for related skills.

## Rules

- All logs must be structured JSON: every event has `timestamp`, `level`, `logger`, `message`, `trace_id`, and `correlation_id`.
- Log levels follow strict semantics: ERROR for definite failures, WARN for unexpected-but-recoverable situations, INFO for significant lifecycle events, DEBUG for troubleshooting details, TRACE for step-by-step execution paths.
- Every request must carry a `correlation_id` generated at the ingress boundary and propagated to all downstream calls; include it in every request-scoped log line.
- Never log sensitive data: passwords, tokens, API keys, PII (email, phone, SSN), or payment card numbers; use a scrubber at the log sink level as a safety net.
- Production log level must be INFO or higher; DEBUG and TRACE must be toggleable at runtime without restart.

## Best Practices

- Log at entry and exit of every service boundary with duration: `"handling request"` / `"request complete (12ms)"`.
- Use structured key-value pairs instead of string interpolation: `{"event": "payment_failed", "amount": 5000, "currency": "USD"}` instead of `"payment failed for $50.00"`.
- Include actionable context in ERROR logs: the operation attempted, the input that caused the failure, and the error type; never log just the stack trace.
- Set log sampling at the trace level (not per-line) to preserve correlation; log the sample rate in the log metadata so consumers can adjust counts.
- Use asynchronous, non-blocking log appenders to avoid log writes from blocking application threads.

## Anti-patterns

- Logging in tight loops or hot paths (every database query, every iteration); log at operation granularity, not per-element.
- Using `print()` or `console.log()` instead of a structured logger; they bypass routing, formatting, and correlation.
- Logging the same event at multiple levels (both INFO and DEBUG for the same call).
- Including stack traces in INFO or WARN logs; stack traces belong in ERROR logs only.
- Sending debug-level logs to production with no runtime toggle; they bury signal in noise.

## Checklist

- [ ] All logs are structured JSON with standard fields (`timestamp`, `level`, `message`, `trace_id`).
- [ ] Correlation IDs are propagated from ingress through all downstream calls.
- [ ] No sensitive data (PII, secrets, tokens) appears in any log line.
- [ ] Production log level is configured to INFO; DEBUG/TRACE is toggleable at runtime.
- [ ] Hot paths have been reviewed to avoid logging in tight loops.

## Related Skills

- `skills/backend-best-practices/references/observability.md`
