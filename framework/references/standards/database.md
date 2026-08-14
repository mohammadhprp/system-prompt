# Database Standard

## Purpose

Define reusable backend engineering rules for database decisions across projects. This standard is canonical guidance for related skills.

## Rules

- Every table must have a single-column, auto-incrementing or UUID primary key named `id`.
- All columns must be `NOT NULL` unless there is an explicit business reason for nullability; model optionality through separate tables where appropriate.
- Define foreign key constraints for all relationships; use `ON DELETE RESTRICT` by default, `ON DELETE CASCADE` only after documented reasoning.
- Index every column that appears in a `WHERE`, `JOIN`, `ORDER BY`, or `GROUP BY` clause; use composite indexes when filtering on multiple columns.
- All migrations must be reversible (provide `down` migration); never alter or drop a column without a zero-downtime rollout plan.

## Best Practices

- Name tables as plural nouns (`orders`, `users`) and columns as snake_case descriptive names (`created_at`, `order_status`).
- Use database-level CHECK constraints for business invariants (e.g., `amount > 0`, `status IN ('pending', 'paid')`).
- Keep transactions short; never hold a transaction open across network calls or user interaction.
- Use `EXPLAIN ANALYZE` on every new or modified query before deploying; aim for sequential scans on tables under 10k rows, index scans on larger tables.
- Pool connections with a max of `(2 × CPU cores) + 1` per service instance; configure statement timeouts at the connection level.

## Anti-patterns

- Using a database as a message queue (polling tables for work); use a dedicated message broker instead.
- Storing JSON blobs that are queried or joined on; promote queryable fields to proper columns with indexes.
- Running application logic in triggers or stored procedures; keep business logic in application code.
- SELECT * in production code; always list explicit columns.
- Schema changes (migrations) applied at application startup; use a separate migration tool with gated rollout.

## Checklist

- [ ] Every table has an `id` primary key, proper indexes, and foreign keys with explicit `ON DELETE` behavior.
- [ ] All queries are reviewed with `EXPLAIN ANALYZE`; no sequential scans on hot paths.
- [ ] Connection pool limits and statement timeouts are configured.
- [ ] Migrations are reversible and have been tested against production-sized data.
- [ ] No sensitive data (passwords, tokens, PII) is stored without encryption or hashing consideration.

## Related Skills

- `skills/code-review/SKILL.md`
- `skills/backend-best-practices/references/database-design.md`
