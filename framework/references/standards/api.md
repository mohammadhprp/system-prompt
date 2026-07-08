# API Standard

## Purpose

Define reusable backend engineering rules for API decisions across projects. This standard is canonical guidance for related skills.

## Rules

- Use HTTP methods by semantic meaning: GET for reads, POST for creates, PUT for full replacement, PATCH for partial update, DELETE for removal.
- Version the API via URL prefix (`/v1/`) or accept header; never break a published version without a deprecation cycle.
- Return standard HTTP status codes: 200 for success, 201 for created, 204 for deleted, 400 for bad request, 401 for unauthenticated, 403 for forbidden, 404 for not found, 409 for conflict, 422 for validation, 429 for rate limited, 5xx for server errors.
- All errors use a consistent JSON envelope: `{"error": {"code": "...", "message": "...", "details": {...}}}`.
- Paginate list endpoints using cursor-based pagination; return `next_cursor` and `has_more` in the response body.
- Use request IDs on mutating endpoints and return them in responses for idempotency guarantees.

## Best Practices

- Design resources around business nouns, not actions; use sub-resources for relationships (`/orders/{id}/items`).
- Make response bodies backward-compatible: never remove fields, never change field types; add fields as optional.
- Rate limit by client (API key or IP); return `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` headers and 429 with `Retry-After`.
- Validate all input at the boundary using a schema (JSON Schema, protobuf, or equivalent); reject unknown fields.
- Use idempotency keys (`Idempotency-Key` header) for POST endpoints that create resources.

## Anti-patterns

- Using GET for mutating operations or POST for pure reads.
- Returning 200 with an error body instead of the appropriate 4xx status code.
- Changing a field's meaning or type within the same API version.
- Exposing internal IDs or database identifiers when opaque public IDs are feasible.
- Nesting resources deeper than two levels; flatten or use query parameters.

## Checklist

- [ ] HTTP method matches the operation's semantics.
- [ ] Error responses follow the standard envelope with actionable messages.
- [ ] Pagination uses cursor-based tokens, not page numbers.
- [ ] Rate limiting headers are present on all endpoints.
- [ ] New fields are optional or have sensible defaults; no breaking changes.

## Related Skills

- `skills/backend-engineer/SKILL.md`
- `skills/code-review/SKILL.md`
- `skills/backend-best-practices/references/api-design.md`
