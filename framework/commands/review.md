---
description: Perform comprehensive code quality review
agent: plan
---

Review $ARGUMENTS

Perform comprehensive code quality review.

## Process

1. **Review conversation and diff** - Read conversation history, run `git diff` for staged/unstaged changes, identify the problem being solved and the behavior being modified. Read related standards: [`references/standards/naming.md`](../references/standards/naming.md), [`references/standards/testing.md`](../references/standards/testing.md), [`references/standards/security.md`](../references/standards/security.md), [`references/standards/performance.md`](../references/standards/performance.md).

2. **Check correctness** - Edge cases, concurrency, error handling, state transitions, backward compatibility. Read contracts and interfaces before implementation.

3. **Check maintainability** - Naming reflects business meaning, structure matches project conventions, comments explain why not what.

4. **Check testing** - Do tests prove the behavior change? Missing edge cases or failure paths? Tests should verify behavior, not mirror implementation.

5. **Check performance** - N+1 queries, unbounded loops, unnecessary allocations, caching opportunities.

6. **Check security** - Input validation, authentication enforcement, secrets exposure, least privilege.

7. **Present findings** - Distinguish blockers from suggestions, explain reasoning for each, summarize overall risk and production readiness.
