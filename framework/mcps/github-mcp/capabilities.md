# GitHub MCP Capabilities

## What It Can Do

The server provides toolsets across the following categories:

### Context

Tools that provide information about the authenticated user and organization membership.

### Repositories

Browse repository code, files, directory trees, commits, and branches. Search code across repositories.

### Issues

Create, read, update issues. Add comments, manage labels, assignees, and milestones.

### Pull Requests

Create, review, update, and merge pull requests. Add review comments, request changes, approve. List changed files and review diffs.

### Actions

List workflows, trigger workflow runs. Get workflow run details, job logs, and artifacts.

### Code Security

List and read code scanning alerts, Dependabot alerts.

### Discussions

Read and create discussions, manage comments.

### Gists

Create, read, update gists.

### Users & Organizations

Read user profiles, list teams, list organization members.

### Additional Toolsets (remote server)

- Copilot — assign Copilot to issues, request Copilot review.
- Copilot Spaces — manage Copilot spaces.
- GitHub Support Docs Search — answer GitHub product and support questions.

## What It Cannot Do

- It cannot operate without a valid GitHub token or OAuth session.
- It cannot access repositories the token does not have permissions for.
- It cannot directly execute code or deploy to production.
- It does not provide real-time notifications or webhook management.
- Some toolsets are only available on the remote server (Copilot, Support Docs Search).

## Best Practices

- Use a fine-grained PAT scoped to the minimum repositories and permissions needed.
- Store the PAT in `.env` (under `.opencode/`) and never commit it to version control.
- Use `GITHUB_TOOLSETS` environment variable (when running locally) to enable only the tool groups needed.
- For read-only workflows, limit the PAT to read-only scopes.
- Prefer the remote HTTP server for simplicity; use the local Docker server only when remote HTTP is not supported.

## Common Workflows

### Review a pull request

1. Let the agent browse the PR diff and changed files.
2. The agent can post review comments, approve, or request changes.
3. Merge when ready.

### Investigate a CI failure

1. Ask the agent to list recent Actions workflow runs.
2. The agent can read job logs to find the failure.
3. Use the findings to propose a fix.

### Manage issues

1. List open issues with filtering by label, assignee, or state.
2. Read issue details and comments.
3. Create or update issues with labels, assignees, and milestones.
