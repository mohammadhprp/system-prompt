# Jira MCP Capabilities

## What It Can Do

12 tools for interacting with self-hosted Jira instances.

### Issues

| Tool | Description |
| --- | --- |
| `jira_get_issue` | Get details of a specific issue by key (e.g. "PROJ-123") |
| `jira_search_issues` | Search for issues using JQL with optional max results |
| `jira_create_issue` | Create a new issue with project, summary, type, description, priority, assignee, labels, components, and custom fields |
| `jira_update_issue` | Update an existing issue — summary, description, assignee, priority, labels, status, and custom fields |
| `jira_delete_issue` | Delete an issue permanently |
| `jira_assign_issue` | Assign an issue to a user |

### Comments

| Tool | Description |
| --- | --- |
| `jira_add_comment` | Add a comment to an issue |
| `jira_get_comments` | Get all comments from an issue |

### Projects

| Tool | Description |
| --- | --- |
| `jira_get_projects` | List all available projects |
| `jira_get_project` | Get details of a specific project |
| `jira_get_issue_types` | Get available issue types for a project |

### User

| Tool | Description |
| --- | --- |
| `jira_get_current_user` | Get information about the currently authenticated user |

## What It Cannot Do

- It does not work with Jira Cloud (SaaS) — designed for self-hosted instances only.
- It cannot authenticate with OAuth, API tokens, or cookie-based auth — PAT only.
- It cannot create, update, or delete Jira projects.
- It cannot manage Jira users, groups, or permissions.
- It cannot access Jira boards, sprints, or agile features.
- It cannot attach files to issues.
- It cannot operate without a valid PAT and accessible Jira instance.

## Best Practices

- Never commit your PAT to version control. Use environment variables or client config files with restricted permissions.
- Use tokens with minimal required permissions.
- Set expiration dates for tokens and rotate them regularly.
- Use `jira_get_issue_types` before creating issues to confirm valid types for the project.
- Use `jira_get_current_user` first to verify authentication is working.
- Use JQL with specific project keys to scope searches and reduce response size.
- For Jira instances behind SSO proxies, set `JIRA_USER_AGENT` to a whitelisted value.

## Common Workflows

### Find and update issues

1. Call `jira_search_issues` with a JQL query to find relevant issues.
2. Call `jira_get_issue` on a specific key to read full details.
3. Call `jira_update_issue` to change status, assignee, or priority.
4. Call `jira_add_comment` to leave a note about the change.

### Create a new issue

1. Call `jira_get_projects` to list available projects.
2. Call `jira_get_issue_types` for the target project.
3. Call `jira_create_issue` with project key, summary, issue type, and optional fields.
4. Call `jira_assign_issue` to assign it to a team member.

### Track work progress

1. Call `jira_search_issues` with `assignee = currentUser() AND status != Done`.
2. Call `jira_get_issue` on each key to review details.
3. Call `jira_update_issue` to transition statuses as work progresses.