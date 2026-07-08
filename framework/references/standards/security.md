# Security Standard

## Purpose

Define reusable backend engineering rules for security decisions across projects. This standard is canonical guidance for related skills.

## Rules

- Authenticate every request except explicitly public endpoints; use OAuth 2.0 / OpenID Connect with short-lived access tokens (15-60 min) and refresh tokens.
- Authorize every action using RBAC or ABAC at the service layer, not just at the API gateway; enforce least privilege per operation.
- Never store secrets (API keys, DB passwords, signing keys) in code, config files committed to git, or environment variables on shared infrastructure; use a secrets manager (Vault, AWS Secrets Manager, GCP Secret Manager).
- Validate, sanitize, and type-check all input at the boundary; use an allowlist approach for permitted characters, values, and lengths where possible.
- Encrypt all data in transit with TLS 1.2 minimum (prefer 1.3); encrypt all sensitive data at rest with AES-256 and envelope encryption.

## Best Practices

- Output-encode all dynamic data rendered in HTML, JSON, or XML context to prevent injection (XSS, SSTI, LDAP injection); use context-aware encoders.
- Implement CSRF protection for cookie-authenticated endpoints; use SameSite=Strict cookies and CSRF tokens for state-changing operations.
- Run dependency scanning (OWASP Dependency-Check, Snyk, Dependabot) on every commit; fix critical and high-severity vulnerabilities before merging.
- Set security headers: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `X-Frame-Options: DENY`.
- Log all authentication failures and authorization denials for audit; never store plaintext passwords — use bcrypt, Argon2, or PBKDF2 with a work factor.

## Anti-patterns

- Relying on client-side validation alone; all security controls must be enforced server-side.
- Using JWTs without validating the signature, expiration (`exp`), issuer (`iss`), or audience (`aud`).
- Returning stack traces or internal error details in API responses; use generic messages and log the details internally.
- Hard-coded API keys or database passwords in any file, including test files and CI configuration.
- Implementing custom cryptography; use well-audited, standard libraries (Tink, libsodium, JCA, Bouncy Castle).

## Checklist

- [ ] Authentication and authorization are enforced at the service layer, not just the gateway.
- [ ] No secrets are in source code, config files, or CI variables; a secrets manager is used.
- [ ] All inputs are validated and sanitized at the boundary.
- [ ] TLS 1.2+ is enforced for all in-transit data; sensitive data at rest is AES-256 encrypted.
- [ ] Dependency scanning is integrated into CI and critical/high findings are resolved before merge.

## Related Skills

- `skills/backend-engineer/SKILL.md`
- `skills/code-review/SKILL.md`
- `skills/backend-best-practices/references/security.md`
