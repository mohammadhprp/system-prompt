# Performance Standard

## Purpose

Define reusable backend engineering rules for performance decisions across projects. This standard is canonical guidance for related skills.

## Rules

- Every endpoint must have a latency budget (p50, p95, p99) documented before implementation; any change that exceeds the budget must be justified and approved.
- Profile before optimizing: measure with production-representative load before any performance change; never optimize based on intuition alone.
- Cache only when measured latency or load is unacceptable; document the cache key, TTL, invalidation strategy, and failure behavior (cache miss degrades to origin).
- Prevent N+1 queries by eager-loading relationships; use batching for bulk operations; review all ORM-generated queries before shipping.
- Use connection pooling for databases and HTTP clients; configure pool sizes based on measured concurrency, not defaults.

## Best Practices

- Load test every new endpoint against a production-sized dataset before shipping; include ramp-up, peak, and sustained load phases.
- Choose caching layer by data characteristics: in-process for hot, rarely-changing data (config, feature flags); Redis/Memcached for shared, high-read data; CDN for static and cacheable API responses.
- Use lazy loading sparingly and only when the optional data is rarely accessed; prefer explicit fetch methods (e.g., `loadUserWithOrders`) over transparent proxies.
- Set read and write timeouts on every outbound call (HTTP, DB, queue, cache); a missing timeout is a production incident waiting to happen.
- Batch database writes in transactions (not per-row inserts); prefer bulk insert/upsert operations where the API supports them.

## Anti-patterns

- Adding a cache before measuring the actual performance problem; caching adds complexity, staleness risks, and invalidation bugs.
- Turning every field into a database index; indexes speed reads but slow writes and consume storage. Index based on query patterns, not speculation.
- Using eager loading for every relationship "just in case"; load only the data the current code path needs.
- Premature denormalization; normalize first, then denormalize only when profiling proves a performance need.
- Synchronous in-process computation of expensive results that could be precomputed or cached.

## Checklist

- [ ] Latency budgets are defined for every endpoint before implementation.
- [ ] Profiling data (not guesses) motivated each optimization decision.
- [ ] Caching strategy is documented including key structure, TTL, and invalidation.
- [ ] ORM queries are reviewed and no N+1 patterns exist.
- [ ] Connection pools and timeouts are configured on all outbound clients.

## Related Skills

- `skills/backend-engineer/SKILL.md`
- `skills/code-review/SKILL.md`
- `skills/backend-best-practices/references/performance.md`
