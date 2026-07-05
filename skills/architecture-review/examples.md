# Architecture Review Examples

## Example 1: Monolith to Modules

Review a proposal to split a monolith into domain modules. Good agent behavior:

- Check that modules are organized by business capability, not technical layer, with high cohesion and low coupling.
- Verify dependency direction: modules may depend on shared kernel but not on each other's internals.
- Review shared data access—every table should be owned by exactly one module; cross-module reads go through an API or event.
- Identify cyclic dependencies between modules and propose extraction of a shared kernel or domain event.
- Assess whether the module boundaries match team ownership boundaries to minimize coordination overhead.

## Example 2: Event-Driven Addition

Review adding an event bus between Order Service and Inventory Service. Good agent behavior:

- Evaluate coupling: events should carry domain meaning, not internal implementation details, so consumers stay stable.
- Confirm at-least-once delivery with idempotent consumers so duplicate events are safe.
- Assess failure modes: if the event bus is down, does the producer queue locally or fail the request?
- Check observability: every event publication and consumption should emit logs, metrics (lag, throughput), and trace context.
- Verify the schema is versioned and backward-compatible so consumers can be deployed independently.

## Example 3: Third-Party Integration

Review integrating an external payment provider into the checkout flow. Good agent behavior:

- Require a bulkhead pattern (dedicated thread pool or circuit breaker) so provider latency does not exhaust the main request pool.
- Recommend a timeout and retry policy with exponential backoff and jitter; cap total retry duration.
- Specify a fallback: if the provider is unavailable, surface a clear error to the user rather than hanging or crashing.
- Ensure idempotency keys are passed so retries don't double-charge; verify the provider supports them.
- Add a kill switch (feature flag) to disable the integration without deploying code.
