# Pull Request Examples

## Example 1: Small Focused PR

Prepare a PR adding a single POST /webhooks endpoint with signature verification. Good agent behavior:

- Write a concise description: what the endpoint does, why it's needed, and the delivery method.
- Include test evidence: link to CI output showing unit, integration, and e2e tests passing.
- List rollback steps: revert this commit; also note that webhook configs created during the window will 404 and must be recreated.
- Keep the diff small: one endpoint, one model, one migration, no unrelated refactoring or renames.
- Add a changelog entry under "Added" and tag the PR with the `feature` label.

## Example 2: Breaking Change PR

Prepare a PR that renames `order_total` to `total_amount` in the public API response. Good agent behavior:

- Include the old field in the response with a `Deprecated` annotation and a `sunset` date 3 releases from now.
- Write a migration guide showing before/after response diffs and a codemod for client-side rename.
- Document the deprecation in the API changelog with the migration window and the planned removal date.
- Add a compatibility test that calls the old field name and asserts it still returns the correct value.
- Mark the PR as `breaking-change` and request reviews from all consuming team leads.

## Example 3: Refactor PR

Prepare a PR that extracts payment processing from the orders controller into a dedicated module. Good agent behavior:

- Split into two commits: commit 1 is pure extraction (identical behavior, no new logic), commit 2 is the new integration point.
- Run the full test suite between commits to prove no behavior changed during extraction.
- In the description, state that this is a refactor only—no API or behavior changes are included.
- Add characterization tests if coverage was missing before the extract.
- Label the PR as `refactor` and set a `do-not-merge` label until the dependent service is also deployed.
