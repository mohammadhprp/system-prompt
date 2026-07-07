# Testing Examples

## Example 1: Unit Test for Discount Logic

Write deterministic unit tests for a `calculateDiscount` function. Good agent behavior:

- Cover the standard case: 10% discount on orders over $100 returns the correct amount.
- Cover edge cases: zero order amount (discount is 0), negative amounts (error or 0), maximum discount cap (e.g., $50 max).
- Cover boundary: order exactly $100 should qualify; $99.99 should not.
- Make tests deterministic: use fixed dates and avoid randomness; stub any time or currency conversion calls.
- Name tests clearly: `test_zero_discount_for_small_orders`, `test_discount_capped_at_50_dollars`.

## Example 2: Integration Test for Order Creation

Write an integration test that creates an order end-to-end with a test database. Good agent behavior:

- Set up the database with known inventory: insert a product with stock=5 before the test.
- Call the create-order endpoint and verify it returns 201 with the correct order ID and total.
- Assert inventory was deducted: query the product stock and confirm it is now 4.
- Assert the payment event was enqueued: check the outbox table or message queue.
- Clean up by rolling back the transaction or truncating test data so tests are repeatable.

## Example 3: Contract Test for API Client

Write a contract test for the integration with an external payment provider. Good agent behavior:

- Stub the HTTP client with WireMock or similar: define expected request shapes (headers, body, idempotency key).
- Define response stubs for success (200 with `payment_id` and `status: captured`) and failure (422 with validation errors, 500).
- Verify the client parses the success response correctly and returns a typed result.
- Verify the client surfaces provider error details when the provider returns a 422.
- Run contract tests in CI without the real provider—fail the build if the provider API contract changes unexpectedly.
