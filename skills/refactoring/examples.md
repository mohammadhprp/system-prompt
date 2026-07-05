# Refactoring Examples

## Example 1: Extract Method

Refactor a large `checkout` function where tax calculation is inlined across 40 lines. Good agent behavior:

- Extract the tax logic into a pure function `calculateTax(subtotal, customerLocation, discount)` that takes inputs and returns a result.
- Keep the extracted function deterministic with no side effects, DB calls, or external service dependencies.
- Write unit tests covering zero tax, maximum tax, bundled items, and edge-case locations before touching the calling code.
- Inline the extracted function call at the original site and verify the output matches exactly with a snapshot test.
- Ensure the function handles null/undefined defensively to match the original behavior.

## Example 2: Rename for Clarity

A module uses `x`, `d`, and `calc` throughout—rename to business terms. Good agent behavior:

- Rename step-by-step: `x` -> `exchangeRate`, `d` -> `discountPercent`, `calc` -> `computeOrderTotal`.
- Use the IDE or language tooling for rename (e.g., `gopls rename`, `ts-migrate`) to avoid missed references.
- Run the test suite after each rename to catch any name collisions or incorrect replacements.
- Update external documentation and API comments that reference the old names.
- Avoid renaming public API surface—if the module exposes `calc`, deprecate it first and introduce the new name in a separate step.

## Example 3: Reduce Duplication

Three query methods in the repository layer have almost identical SQL with different filters. Good agent behavior:

- Parameterize the query: `findOrders(status, userId, dateRange)` where each parameter is optional and combined with `WHERE 1=1` or a query builder.
- Write characterization tests first: capture the exact output of all three original methods for the same input to prove the refactor preserves behavior.
- Consolidate callers one by one, running tests after each change to catch regressions immediately.
- Keep the original method signatures as thin wrappers calling the unified method to minimize diff in the first pass.
- Delete the wrapper methods and rename the unified method only after all callers are migrated and tested.
