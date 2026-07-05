# API Design Examples

## Example 1: Order Creation Endpoint

Design a POST /orders endpoint for an e-commerce API. Good agent behavior:

- Define the request schema with required and optional fields; validate at the contract boundary with clear error messages.
- Require an idempotency key so retries do not create duplicate orders.
- Check authorization: verify the authenticated user owns the payment method and shipping address.
- Return 201 with the created order and a Location header; return 422 for validation failures and 409 for duplicate idempotency keys.
- Include a request example covering full, minimal, and invalid payloads.

## Example 2: Pagination Design

Design cursor-based pagination for a GET /products endpoint with 10k+ items. Good agent behavior:

- Use opaque cursor tokens (base64-encoded sort values) instead of offset/limit to avoid drift from inserts.
- Enforce a maximum page size (e.g., 100) and document the default (e.g., 20).
- Sort by a stable composite key (e.g., created_at + id) so items don't shift between pages.
- Return next_cursor only when more results exist; omit it on the last page.
- Add tests for empty results, exactly one page, exact page boundaries, and concurrent inserts during pagination.

## Example 3: API Versioning

Add a required `currency` field to the existing GET /orders response without breaking mobile clients. Good agent behavior:

- Add the field to the response body immediately; clients that ignore unknown fields continue working.
- Make the new field required, but only for API version 2025-03 and later; keep it optional in older versions.
- Document the deprecation date for the old version and include a `Sunset` header on deprecated endpoints.
- Add a migration guide showing the response diff before and after.
- Add a test that calls both versions and verifies the contract for each.
