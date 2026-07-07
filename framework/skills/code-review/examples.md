# Code Review Examples

## Example 1: Missing Validation

Review a PR that adds a POST /transfer endpoint with no input validation or auth. Good agent behavior:

- Point out every input field (amount, source, target) should be validated for type, range, and format before reaching business logic.
- Flag the missing authorization check: the caller must own the source account or have delegated permission.
- Identify injection risk if any input is interpolated into SQL or rendered to HTML.
- Recommend standard validation middleware and a consistent error shape rather than ad-hoc checks.
- Request tests for invalid amounts, nonexistent accounts, and unauthenticated callers.

## Example 2: N+1 Query

Review a PR that fetches orders and then loops to load line items individually. Good agent behavior:

- Identify the N+1 pattern: `SELECT * FROM orders` followed by `N` queries of `SELECT * FROM line_items WHERE order_id = ?`.
- Recommend eager loading with a single batch query: `SELECT * FROM line_items WHERE order_id IN (?)`.
- If using an ORM, point out the specific method that enables eager loading and note the performance difference.
- Suggest pagination on orders to bound the total query volume.
- Verify the fix with a test that asserts exactly 2 queries run (orders + line items) regardless of page size.

## Example 3: Concurrency Bug

Review a PR that updates account balances without locking. Good agent behavior:

- Explain the race: two concurrent requests can read the same balance, subtract different amounts, and the second write clobbers the first.
- Recommend optimistic locking with a version column: `UPDATE accounts SET balance = ?, version = version + 1 WHERE id = ? AND version = ?`.
- If the ORM supports it, suggest using row-level locks (`SELECT FOR UPDATE`) inside a transaction.
- Verify the update query itself is atomic: `UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?` avoids the read-then-write gap.
- Add a concurrency test that fires 10 parallel transfers and asserts the final balance matches the expected total.
