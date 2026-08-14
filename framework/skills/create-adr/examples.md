# Create ADR Examples

## Record a finalized database decision

User: "Write an ADR for using PostgreSQL as our primary database."

Good agent behavior:

- Detect the user's language and generate the ADR in it, keeping technical terms like "ADR" and "API" in English.
- Gather the mandatory fields: decision title, date, status, context, decision, and consequences.
- Scan the ADR directory for the next sequential number before assigning one.
- Default to the MADR format with a structured comparison of the options considered.
- Include honest trade-offs in the consequences, not just positives.

## Capture a decision that supersedes an old one

User: "We're replacing Jenkins with GitHub Actions. Document why."

Good agent behavior:

- Create a new ADR with status "Accepted" rather than editing the old one.
- Link it as superseding the Jenkins decision, and note that the old ADR should be marked "Superseded by ADR-{NNN}".
- Explain the forces behind the change and why the new choice wins given the current constraints.
- Follow the file naming convention with a zero-padded sequential number.

## The decision hasn't been made yet

User: "I'm trying to decide whether to adopt GraphQL."

Good agent behavior:

- Recognize this is an RFC situation, not an ADR: the decision is not yet made.
- Point the user to `create-rfc` to drive the decision process first.
- Explain that ADRs record decisions that are finalized, while RFCs are proposals seeking input.
- Offer to create the RFC instead of forcing an ADR before the decision exists.
