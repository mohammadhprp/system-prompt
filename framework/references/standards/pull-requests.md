# Pull Requests Standard

## Purpose

Define reusable backend engineering rules for pull request decisions across projects. This standard is canonical guidance for related skills.

## Rules

- PRs must be smaller than 400 lines of changed code (excluding generated files, lockfiles, and tests for the change); split larger changes into stacked or sequential PRs.
- Branch names follow `<type>/<description>`: `feat/add-invoice-export`, `fix/null-pointer-on-login`, `refactor/order-service`, `chore/upgrade-go-1.21`.
- Title must follow Conventional Commits: `type(scope): description` (e.g., `feat(payments): add idempotency key support`).
- Description must include: what problem this solves, how it solves it, any breaking changes or migration steps, and links to related issues/ADRs.
- Separate behavior changes from refactors into distinct commits within the same PR or into separate PRs; a single commit must not mix both.

## Best Practices

- Self-review your PR before requesting review: check for TODOs, debug code, missing error handling, and correct test coverage.
- Request specific types of review: "focus on error handling in the payment flow" or "check the migration script for backward compatibility".
- Blocking changes (API contract changes, schema migrations, security fixes) require two approvals; non-blocking changes require one.
- Respond to every review comment; mark resolved discussions with a brief explanation of the resolution.
- Squash-merge into the main branch, using the PR title as the commit message; preserve co-author attribution.

## Anti-patterns

- PRs that refactor a codebase while adding a feature in the same diff; they cannot be reviewed or reverted independently.
- Review comments left unaddressed for more than 24 hours without communication; they block the author and the team.
- Requesting review before CI passes; reviewers should not waste time on code that fails tests.
- Leaving "LGTM" or approval without actually reading through the diff; code review catches bugs, not rubber stamps.
- Merging PRs with failing CI or unresolved conversations; every merge commit to main must be green.

## Checklist

- [ ] PR is under 400 lines (excluding generated files and tests).
- [ ] Title follows Conventional Commits format.
- [ ] Description includes problem, solution, migration steps, and issue links.
- [ ] CI is green before requesting review.
- [ ] Refactors and behavior changes are in separate commits or PRs.

## Related Skills

- `skills/code-review/SKILL.md`
- `commands/pr.md`
