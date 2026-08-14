# Technical Design Doc Creator Examples

## Payment integration design doc

User: "Create a TDD for integrating Stripe payments into our subscription system."

Good agent behavior:

- Ask about project size and type before generating, then size the document to the answer.
- Detect the user's language and generate all headers and prose in it.
- Enforce the mandatory sections: problem statement, scope, technical solution, risks, and implementation plan.
- Make the Security section mandatory because this is a payment system, and collect PCI DSS, encryption, and PII handling details.
- Keep the document at the architectural level: API contracts, data flow, and rollback strategy, not CLI commands or code snippets.

## Small feature design doc

User: "Write a design doc for adding user profile pictures."

Good agent behavior:

- Recognize this as a small feature and produce a streamlined TDD with only the essential sections.
- Ask for the basic information needed: problem statement, scope, and technical approach.
- Include an implementation plan with owner, status, and estimate columns.
- Skip suggested sections like Migration Plan and Approval when they don't apply.

## Migrating a database

User: "Crie um TDD para migração do banco de dados PostgreSQL para MongoDB"

Good agent behavior:

- Detect Portuguese and generate the TDD in Portuguese with translated section headers.
- Identify this as a data migration project and add a migration plan covering strategy, phases, and rollback.
- Ask for the migration strategy, data mapping, and rollback plan before writing.
- Note data integrity validation as a first-class concern rather than an afterthought.
