# Testing Standard

## Purpose

Define reusable backend engineering rules for testing decisions across projects. This standard is canonical guidance for related skills.

## Rules

- Unit tests cover domain logic in isolation: mock or stub every out-of-process dependency (database, network, filesystem); run in < 1ms per test.
- Integration tests cover real adapter behavior: use test containers or ephemeral databases for repositories, message producers, and HTTP clients; run against a real instance.
- Contract tests verify provider-consumer API agreements: use Pact or Spring Cloud Contract for producer-side; run in CI as a blocking check.
- E2E tests cover critical user journeys only: happy path for the top 3-5 business flows; never attempt comprehensive e2e coverage.
- All tests must be deterministic: no shared mutable state, no sleep/retry for timing, no dependency on test execution order.

## Best Practices

- Name tests following `Given_When_Then` or `UnitOfWork_StateUnderTest_ExpectedBehavior`: `GivenEmptyCart_WhenCheckout_ThrowsValidationError`.
- Follow the Test Pyramid: 70% unit, 20% integration, 10% contract/e2e; CI must run unit and integration on every push, e2e on merge to main.
- Use dependency injection to support test doubles at the port boundary; prefer fakes (in-memory implementations) over mocks for ports that have simple in-memory versions.
- Write a test for every bug fix before applying the fix; the added test proves the bug exists and prevents regression.
- Aim for > 80% line coverage on domain logic and > 60% on adapters; coverage is a floor, not a target — test for correctness, not percentages.

## Anti-patterns

- Testing framework internals (e.g., mocking the ORM and asserting SQL strings) instead of testing behavior through the public API.
- Flaky tests that pass intermittently due to timing, ordering, or shared state; tag them and fix immediately or remove them — they erode trust in the suite entirely.
- Writing e2e tests for every code path; e2e is for validation of critical flows only — most bugs are caught by unit and integration tests at a fraction of the cost.
- Tests that share fixtures or database state across test files; each test must set up and tear down its own state.
- Asserting implementation details (private methods, internal state) instead of observable behavior; tests should break when behavior changes, not when code is refactored.

## Checklist

- [ ] Unit tests isolate domain logic with mocked/stubbed dependencies.
- [ ] Integration tests run against real infrastructure (test containers or ephemeral instances).
- [ ] Contract tests exist for all provider-consumer API boundaries.
- [ ] No flaky tests — verified by running the suite 10 times locally.
- [ ] Coverage meets thresholds: >80% domain, >60% adapters.

## Related Skills

- `skills/backend-engineer/SKILL.md`
- `skills/code-review/SKILL.md`
- `skills/testing/SKILL.md`
