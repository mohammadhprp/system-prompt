# Debugging Examples

## Example 1: Payment Timeout

Investigate intermittent payment processing timeouts affecting 2% of transactions. Good agent behavior:

- Correlate request logs, application traces, and payment provider response times to find the common thread in failures.
- Narrow down the timeout window: is the provider slow to respond (upstream), or is the service queuing internally (thread pool exhaustion)?
- Check whether the timeout correlates with deployment events or traffic spikes; overlay deploy times on the latency chart.
- Review retry configuration: are retries stacking on the same degraded provider, amplifying the problem?
- Recommend a circuit breaker with a dedicated thread pool so a degraded provider does not block healthy requests.

## Example 2: Data Discrepancy

Debug a dashboard that shows 12% lower revenue than the payments database. Good agent behavior:

- Binary search through the data pipeline: compare raw payment events, the aggregation job output, and the dashboard query result.
- Check for dropped events in the ingestion pipeline—compare event counts at producer and consumer.
- Verify the aggregation query includes all statuses (e.g., refunds may be excluded unintentionally).
- Look for timezone mismatches: the dashboard may filter by UTC while payments are stored in local time.
- Pinpoint the exact first date where numbers diverged and inspect the deployment that happened closest to that time.

## Example 3: Memory Leak

Debug a Go service that OOMs after 48 hours of steady traffic. Good agent behavior:

- Enable pprof heap profiling and take snapshots at regular intervals to chart memory growth.
- Use the goroutine profile to check for goroutine leaks—a blocked goroutine holding a reference prevents GC.
- Binary search git history: deploy the last-known-good commit and bisect forward to find the exact change that introduced the leak.
- Focus on slices, maps, and channels that are never trimmed or closed; look for caches without eviction.
- Confirm the fix by running the service under production-like load for 48 hours and verifying the heap graph plateaus.
