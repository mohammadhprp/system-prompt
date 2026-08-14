# Architecture Standard

## Purpose

Define reusable backend engineering rules for architecture decisions across projects. This standard is canonical guidance for related skills.

## Rules

- Enforce strict layering: presentation depends on application depends on domain; infrastructure depends on abstractions, not concrete types.
- Dependencies must point inward: inner layers (domain) define interfaces; outer layers (infrastructure) implement them.
- A module must have a single reason to change; group code by business domain, not by technical role.
- Public API surfaces must be small and explicit; hide internal details behind package/module boundaries.
- No circular dependencies between modules, packages, or layers; enforce with build-time checks.

## Best Practices

- Use the Ports & Adapters pattern: business logic depends on interfaces (ports), external systems plug in via adapters.
- Communicate between bounded contexts through asynchronous messages or a published anti-corruption layer; never share internal types.
- Keep domain logic free of framework annotations, serialization concerns, and database primitives.
- Draw architectural decisions as C4 diagrams (Context, Container, Component, Code) and review them before building.
- Each module should be testable in isolation by swapping real adapters with test doubles at the port boundary.

## Anti-patterns

- Anemic domain model where business logic leaks into services and the domain layer is just getters and setters.
- Using dependency injection to wire everything together while still calling concrete classes directly.
- Big Ball of Mud: no clear boundaries, arbitrary cross-module references, mixed concerns in a single package.
- Leaking infrastructure concepts (HTTP request objects, database connections, serialization formats) into domain logic.
- Premature microservices: extracting services before understanding the bounded context, adding network overhead without cohesion benefit.

## Checklist

- [ ] Dependency direction is verified: domain depends on nothing, infrastructure depends on domain.
- [ ] Each module has a well-defined public API and internal package is hidden.
- [ ] No circular dependencies exist (verified by tooling).
- [ ] Domain code is framework-independent and testable without infrastructure.
- [ ] Architecture decision record (ADR) exists for any significant structural choice.

## Related Skills

- `skills/code-review/SKILL.md`
- `skills/backend-best-practices/references/architecture-review.md`
