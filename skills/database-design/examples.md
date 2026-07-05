# Database Design Examples

## Example 1: Multi-Tenant Schema

Design a schema for a SaaS app where each tenant has its own customers and orders. Good agent behavior:

- Add a `tenant_id` column to every tenant-scoped table and include it in all queries via middleware; never trust client-supplied tenant_id alone.
- Discuss shared vs. separate database: start with shared+isolated (row-level security or tenant_id in PK) to keep ops simple; move to separate databases only if regulatory or noise-neighbor issues arise.
- Create a composite PK (tenant_id, id) or a UUID that encodes the tenant to avoid cross-tenant joins.
- Index tenant_id first in composite indexes so tenant-scoped queries use index seeks.
- Write a migration that backfills tenant_id for existing rows and validates no row is orphaned.

## Example 2: Order Status Migration

Add a `status` column to the orders table with a backfill for 1M existing rows. Good agent behavior:

- Write the migration in three steps: (1) add the column as nullable, (2) backfill in batches of 1000 with a sleep to avoid replication lag, (3) make it NOT NULL only after backfill completes.
- Provide a rollback script that reverses all three steps; test rollback on a staging copy first.
- Include a validation step that counts NULL rows after backfill and fails the migration if any remain.
- Emit a metric for migration progress (rows updated / total rows) and alert on stall.
- Lock the table only during the final NOT NULL step, not during the backfill.

## Example 3: Index Strategy

Design indexes for an orders table queried by user_id, status, and date range. Good agent behavior:

- Create a composite index on (user_id, status, created_at DESC) to cover the most common filtered-and-sorted query.
- Keep index columns selective first: user_id filters hard, status further narrows, created_at handles ordering without a filesort.
- Add a separate index on (created_at) if there are dashboard-style queries without a user_id filter.
- Drop unused indexes to reduce write amplification; validate with `pg_stat_user_indexes` or `sys.dm_db_index_usage_stats`.
- Document the index purpose in the migration so future developers know the query pattern being optimized.
