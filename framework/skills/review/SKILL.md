---
name: review
description: Perform a comprehensive code quality review of changes. Use this skill whenever the user asks to review code, inspect a diff, find bugs, assess production readiness, or perform a code review.
---

# `review` skill instructions

Perform comprehensive code quality review.

## Process

1. **Review conversation and diff** - Read conversation history, run `git diff` for staged/unstaged changes, identify the problem being solved and the behavior being modified. Read related standards: [`references/standards/naming.md`](../../references/standards/naming.md), [`references/standards/testing.md`](../../references/standards/testing.md), [`references/standards/security.md`](../../references/standards/security.md), [`references/standards/performance.md`](../../references/standards/performance.md).
2. **Check correctness** - Edge cases, concurrency, error handling, state transitions, and backward compatibility. Read contracts and interfaces before implementation.
3. **Check maintainability** - Naming reflects business meaning, structure matches project conventions, and comments explain why rather than what.
4. **Check testing** - Do tests prove the behavior change? Identify missing edge cases or failure paths. Tests should verify behavior, not mirror implementation.
5. **Check performance** - Look for N+1 queries, unbounded loops, unnecessary allocations, and caching opportunities.
6. **Check security** - Check input validation, authentication enforcement, secrets exposure, and least privilege.
7. **Present findings** - Distinguish blockers from suggestions, explain the reasoning for each, and summarize overall risk and production readiness.
