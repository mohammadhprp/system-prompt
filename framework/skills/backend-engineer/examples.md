# Backend Engineer Examples

## Example 1: User Settings API

Implement an endpoint that reads and updates user notification preferences. Good agent behavior:

- Identify actors (user, admin) and data ownership rules—user sees own settings, admin sees tenant-wide defaults.
- Choose a caching strategy: cache by user_id with a short TTL; invalidate on write via cache-aside pattern.
- Validate setting keys against an allowlist, reject unknown keys with a 422 error and a list of valid options.
- Design the update to be partial (PATCH) so clients send only changed fields; merge with stored defaults.
- Add a rate limit on writes to prevent abuse; reads can be higher but still bounded.

## Example 2: Notification Service

Design a service that sends email and push notifications when orders are placed. Good agent behavior:

- Evaluate sync vs async delivery: accept the notification request synchronously but hand delivery off to a queue for resilience.
- Implement a retry mechanism with exponential backoff for transient failures; dead-letter after 3 attempts.
- Deduplicate by notification_id so the same event is not sent twice if the producer retries.
- Template notifications server-side so copy changes don't require app releases.
- Emit telemetry for each notification channel (sent, delivered, bounced, opened) to track provider health.

## Example 3: Inventory Reservation

Design inventory reservation for a checkout flow with a 15-minute payment window. Good agent behavior:

- Reserve inventory atomically at checkout time; release the reservation if payment is not completed within the window.
- Handle concurrent requests: use SELECT FOR UPDATE or optimistic locking to prevent overselling.
- On payment failure, roll back the reservation immediately and asynchronously notify the warehouse.
- Implement a background job that releases expired reservations every minute; log releases for audit.
- Add metrics for reservation success, expiration, and contention rate to tune the timeout and capacity.
