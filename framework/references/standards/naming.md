# Naming Standard

## Purpose

Define reusable backend engineering rules for naming decisions across projects. This standard is canonical guidance for related skills.

## Rules

- Follow language conventions: Go uses `camelCase` for exported, `camelCase` for unexported; Python/JS uses `snake_case` for everything; Java/C#/TypeScript uses `PascalCase` for types and `camelCase` for methods/variables; SQL uses `snake_case`.
- File names match the primary export: `user_repository.go`, `order_handler.py`, `PaymentService.ts`.
- Boolean variables and parameters must use a predicate prefix: `is_`, `has_`, `can_`, `should_`, `was_` (e.g., `is_active`, `has_permission`).
- Classes/types must be nouns or noun phrases; functions/methods must be verbs or verb phrases.
- Abbreviations must be in the project glossary; avoid ambiguous or non-standard abbreviations (`cust` for customer, `addr` for address, `calc` for calculate).

## Best Practices

- Name things by what they mean in the business domain, not by their implementation: `InvoiceRepository` not `MySQLInvoiceRepo`, `calculateDiscount` not `applyFormula`.
- Use consistent suffixes for similar concerns: `Factory`, `Repository`, `Service`, `Controller`, `DTO`, `Mapper`.
- Keep names proportional to scope: short names for small scopes (`i` for loop index), descriptive names for wide scopes (`calculateMonthlySubscriptionRevenue`).
- Rename aggressively when code reveals a clearer abstraction; naming debt compounds faster than any other technical debt.
- Group related constants and enums with a shared prefix: `OrderStatus.Pending`, `OrderStatus.Shipped`, `OrderStatus.Delivered`.

## Anti-patterns

- Hungarian notation or type-encoding in names (`strName`, `intCount`, `objUser`); use the type system instead.
- Name stuttering: `OrderService.getOrder()`, `UserEntity.getId()`, `Invoice.invoiceNumber`.
- Single-letter names outside of loop variables, throwaway lambdas, or mathematical contexts.
- Naming things after the person who wrote it or inside jokes; names must be meaningful to any future reader.
- Using the same term for different concepts (`Account` for both user accounts and financial accounts in the same system).

## Checklist

- [ ] Names follow the language-appropriate casing convention consistently.
- [ ] Boolean variables use `is_`/`has_`/`can_` prefix.
- [ ] No stuttering or Hungarian notation in the codebase.
- [ ] All abbreviations are in the project glossary.
- [ ] Renames are applied when code evolves; naming debt is not accumulated.

## Related Skills

- `skills/backend-engineer/SKILL.md`
- `skills/code-review/SKILL.md`
- `skills/backend-best-practices/references/refactoring.md`
