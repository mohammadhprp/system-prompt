# Code Review Examples

## Example 1: Orders Change

A request asks to add a new order status. Good agent behavior:

- Confirm which actors can set the status and which transitions are valid.
- Check whether reports, notifications, payments, and inventory workflows depend on existing statuses.
- Add validation at the contract boundary and enforce state transitions near the domain logic.
- Include tests for valid transitions, invalid transitions, and compatibility with existing orders.
- Add operational notes if the status affects dashboards or alerts.

## Example 2: Payments Risk

A request asks to retry failed payment processing. Good agent behavior:

- Require idempotency so duplicate retries do not double-charge users.
- Store retry attempts and final outcome with enough detail for support and audit.
- Use bounded retries and clear failure states.
- Emit structured logs and metrics for retry count, success rate, and terminal failures.
- Document rollback if the retry behavior causes unexpected load or user impact.

## Example 3: Reports Endpoint

A request asks for a reports endpoint over orders and products. Good agent behavior:

- Clarify freshness, authorization, filters, pagination, and expected volume.
- Avoid scanning unbounded data on every request.
- Return stable error shapes and predictable sorting.
- Add tests for permissions, empty results, invalid filters, and large result sets.
- Prefer a simple query first; introduce precomputation only with evidence.
