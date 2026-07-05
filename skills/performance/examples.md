# Performance Examples

## Example 1: Slow Query Optimization

Profile and optimize a dashboard query that joins 6 tables and takes 12 seconds. Good agent behavior:

- Run `EXPLAIN ANALYZE` to identify Seq Scans on large tables; add indexes on the join and filter columns.
- Evaluate denormalization: add a materialized view pre-joining the most-used columns; refresh every 5 minutes.
- Consider query splitting: run the heavy aggregation asynchronously and serve the dashboard from a cache or summary table.
- Validate the fix by running the optimized query under load and comparing execution plans.
- Add a regression test that fails if the query exceeds 200ms on the CI dataset.

## Example 2: Caching Strategy

Add caching for a GET /products endpoint that serves 2000 req/s with price and stock lookup. Good agent behavior:

- Use cache-aside with Redis: on read, check cache first; on miss, load from DB and populate cache with a TTL of 60 seconds.
- Invalidate cache entries immediately when price or stock changes, not on TTL expiry alone.
- Implement stale-while-revalidate: serve the stale cached value and refresh in the background to keep p99 low.
- For hot products, use write-through cache to absorb read spikes during flash sales.
- Monitor cache hit ratio and set an alert if it drops below 90%.

## Example 3: Bottleneck Analysis

Diagnose a gRPC service that is CPU-bound under 500 concurrent requests. Good agent behavior:

- Profile with `pprof` or `flamegraph` to identify the hottest code path—likely JSON serialization, regex, or a hot loop.
- Check whether the CPU is spent on application logic or GC; reduce allocations by reusing buffers and avoiding per-request objects.
- If serialization is the bottleneck, switch to a faster codec (protobuf is already in use, but verify reflection or proto marshaling overhead).
- Add CPU and goroutine metrics, correlated with request rate, to a dashboard for ongoing monitoring.
- Verify the fix by running a load test at 500 concurrent requests and confirming CPU saturation drops below 80%.
