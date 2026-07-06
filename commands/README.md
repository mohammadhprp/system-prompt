# Command Catalog

A catalog of slash commands for AI coding agents.

Commands define repeatable workflows that agents execute on demand, triggered by a slash command and optional arguments. Each command describes the process steps, references the relevant skill and standards, and produces a structured deliverable.

## Available Commands

| Command | Purpose | Loads |
| --- | --- | --- |
| [`/architecture-review`](./architecture-review.md) | Review and improve system architecture. | architecture-review skill, architecture standard |
| [`/changelog`](./changelog.md) | Create, add, or update CHANGELOG.md entries. | — |
| [`/commit`](./commit.md) | Create atomic git commits with conventional messages. | — |
| [`/pr`](./pr.md) | Create a GitHub PR or GitLab MR for the current branch. | pull-request skill, pull-requests standard |
| [`/review`](./review.md) | Perform comprehensive code quality review. | code-review skill, naming/testing/security/performance standards |
| [`/summarize-changes`](./summarize-changes.md) | Summarize uncommitted changes and flag risky patterns. | — |

## Command Entry Structure

```text
commands/<command-name>.md
```

Each command file uses frontmatter with a `description` field, the command signature with `$ARGUMENTS` placeholder, and a `## Process` section with numbered steps.

## How to Contribute a New Command

1. Create `commands/<command-name>.md` following the existing format.
2. Write a clear `description` in the frontmatter.
3. Define the command signature with `$ARGUMENTS` for optional arguments.
4. Break the workflow into numbered steps under `## Process`.
5. Reference related skills and standards with relative links.
6. Add the command to the table in this README.

## Related Repository Areas

- [`skills/`](../skills/) contains skill definitions loaded by commands.
- [`mcps/`](../mcps/) contains the MCP server catalog.
- [`plugins/`](../plugins/) contains the OpenCode plugin catalog.
- [`references/standards/`](../references/standards/) contains canonical engineering rules.
- [`references/templates/`](../references/templates/) contains reusable engineering deliverables.
