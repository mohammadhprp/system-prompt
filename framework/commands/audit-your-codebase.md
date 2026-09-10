---
description: Audit the codebase for materially useful simplifications in data structures, state, control flow, algorithms, and ownership
agent: plan
---

Audit this entire codebase for materially useful simplifications in its data structures, state representation, control flow, algorithms, and ownership.

This is an audit-only exercise. Do not edit files, run tests, implement recommendations, commit, or push. Read-only inspection commands are allowed.

You are the coordinator. Continue until the complete codebase has been reviewed and the final audit is validated.

## Process

1. **Establish the coverage contract**
   - Inspect the repository and inventory every identifiable subsystem, including frontend, backend, shared infrastructure, platform bridges, generated-contract ownership, and test/tooling infrastructure where materially relevant.
   - Give each subsystem a stable ID, descriptive name, exact ownership boundary, key implementation files, public interfaces, major call sites, tests, and a status: `queued`, `in review`, `recommend`, or `skip`.
   - Create one canonical scratchpad or report containing the subsystem inventory, confirmed opportunities, explicit skip decisions, cross-cutting patterns, duplicates and superseded findings, final priorities and dependencies, and an audit log.
   - Treat this inventory as the coverage contract. Do not assume broad catch-all rows prove coverage.

2. **Run bounded subsystem reviews**
   - Use fresh, read-only agents where available. Give every worker one distinct subsystem with an exact, non-overlapping ownership boundary.
   - Keep concurrency bounded to the number of lanes you can actively coordinate. Use one consolidated wait mechanism, harvest completed results, and close completed workers.
   - Give every worker this brief:

     > Review the assigned subsystem for at most two materially useful simplifications in its data structures, state representation, or organizing model. Inspect its implementation, public interfaces, major call sites, and existing tests. Stay within the assigned ownership boundary. You may identify cross-subsystem concerns, but do not expand the scope to solve them.
     >
     > Look for scattered booleans or nullable fields that permit invalid combinations; repeated object-shape assumptions needing a shared typed model; duplicated branching removable by a small map, registry, reducer, or command model; unclear ownership boundaries; repeated scans or lookups needing a more appropriate collection; and lifecycle, concurrency, or async states that permit stale or contradictory state.
     >
     > Do not force an abstraction. Prefer boring local code when it is already clear. Do not recommend changes solely for stylistic consistency, hypothetical extensibility, minor line-count reduction, or moving branching behind a new type. Return at most two opportunities. If nothing clearly meets the threshold, return `skip`.

   - Require each worker recommendation to include: verdict (`recommend` or `skip`), exact evidence, current complexity or invalid states, proposed representation and why it is simpler, smallest credible implementation scope, regression risks and migration concerns, existing and additional validation, and confidence (`high`, `medium`, or `low`).

3. **Validate and synthesize**
   - Independently verify every finding against the current repository before accepting it.
   - Reject, narrow, or demote vague, duplicate, misunderstood, or merely relocated complexity. Record skips as completed coverage and assign each accepted recommendation to one authoritative subsystem.
   - Continue bounded review batches until every inventory row is complete.

4. **Audit the audit**
   - Run fresh independent passes for repository coverage and missing subsystem boundaries, duplication and ownership overlap, materiality and over-abstraction, schema completeness, and dependency-aware priority ranking.
   - If the coverage pass finds a real omission, add an explicit subsystem row and audit it rather than broadening a completed boundary.
   - Rank recommendations by concrete impact, confidence, implementation effort, blast radius, and prerequisites. Identify the best first implementation slices.

5. **Validate the final report**
   - Confirm every identifiable subsystem has been reviewed or explicitly skipped.
   - Confirm every finding has complete evidence, scope, risk, and validation fields.
   - Confirm duplicates and weak abstractions have been removed and priorities and dependencies are internally consistent.
   - Confirm the repository remains unchanged.
