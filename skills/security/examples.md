# Security Examples

## Example 1: Input Validation

Review an endpoint that accepts a `product_code` and passes it directly into a SQL query. Good agent behavior:

- Flag the SQL injection vulnerability immediately: interpolating user input into a query string allows arbitrary SQL execution.
- Replace with parameterized queries or an ORM that handles escaping—never trust string concatenation for SQL.
- Add input validation: reject `product_code` values that contain non-alphanumeric characters before they reach the database layer.
- Apply the same scrutiny to all other user-supplied fields in the same endpoint (sort, filter, page).
- Write a regression test that sends a malicious payload (e.g., `' OR 1=1--`) and asserts a 400 error instead of returning all rows.

## Example 2: Secret Exposure

Find an AWS API key hardcoded in an example configuration file committed to git. Good agent behavior:

- Flag that the key has been exposed in the git history and must be rotated immediately, not just removed from the file.
- Move the key to a secrets manager (AWS Secrets Manager, Vault) and reference it via environment variable at runtime.
- Add a `.gitignore` entry for config files that contain secrets and add a pre-commit hook to scan for credentials.
- Check git history for any other secrets committed in the same or related files.
- Document the secret rotation process in the runbook so future incidents are handled consistently.

## Example 3: Authorization Flaw

Review a multi-tenant endpoint where `GET /api/orders/{id}` returns order details. Good agent behavior:

- Spot the flaw: the endpoint loads the order by ID without checking that the authenticated user's tenant matches the order's tenant.
- Fix by adding a `WHERE tenant_id = ?` clause to the query or filtering in the service layer after loading.
- Add a test that creates orders for two different tenants and verifies tenant A cannot access tenant B's orders.
- Check all other endpoints in the same controller for the same pattern; copy the fix to every one.
- Review the API design: prefer APIs that scope resources under the tenant (e.g., `/api/tenants/{id}/orders/{id}`) to make authorization harder to miss.
