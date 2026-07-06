---
name: jira-mcp
description: Use this skill when working with the Jira MCP server tools for issue management, project management, comments, search, and related Jira workflows.
---

# jira-mcp

Jira MCP server providing 12 tools for interacting with your self-hosted Jira instance via the REST API v2.

## Tools

| Category           | Tools                                                                                                                                          | Default |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| Issues (9 tools)   | `create_issue`, `get_issue`, `update_issue`, `delete_issue`, `search_issues`, `assign_issue`, `get_issue_types`, `add_comment`, `get_comments` | yes     |
| Projects (2 tools) | `get_projects`, `get_project`                                                                                                                  | yes     |
| Users (1 tool)     | `get_current_user`                                                                                                                             | yes     |

All tools are available by default — there are no opt-in toolsets for this server.

## Key Workflows

### Issue Lifecycle

`search_issues` → `get_issue` → `update_issue` / `assign_issue`

### Create Issue (see reference/issues.md)

`get_project` → `get_issue_types` → `create_issue`

### Comment Thread (see reference/comments.md)

`add_comment` → `get_comments`

### Project Discovery (see reference/projects.md)

`get_projects` → `get_project` → `get_issue_types`

## Parameter Hints

- **projectKey**: uppercase project key (e.g., `PROJ`, `SCRUM`, `SUP`). Use `get_projects` to discover available keys.
- **issueKey**: format `PROJECT-123` (e.g., `CHI-42`, `DEV-1337`)
- **issueType**: varies by project — use `get_issue_types` to list valid types before creating. Common types: `Bug`, `Task`, `Story`, `Epic`, `Sub-task`
- **search_issues**: uses JQL (Jira Query Language). Complex values (spaces, special chars) must be quoted: `status = "In Progress"`, `project = PROJ`
- **Jql**: provide a raw JQL query string (not single-quoted — use double quotes inside for string values)
- **maxResults**: `search_issues` defaults to 50. Increase for larger result sets.
- **assignee**: Jira username (not display name or email). Use `get_current_user` to find your own username.
- **Custom fields**: Pass custom field values directly as parameters (e.g., `customfield_10211: "Sprint 1"`). Discover field IDs via Jira REST API.

## Destructive Tools

`delete_issue` — permanently deletes an issue. Cannot be undone.

## Advanced

- **JQL Search**: full Jira Query Language support — combine operators (`AND`, `OR`, `NOT`), functions (`currentUser()`, `now()`, `startOfDay()`), and ordering (`ORDER BY created DESC`)
- **Status transitions**: use `update_issue` with `status` to transition issues (e.g., `"In Progress"`, `"Done"`, `"Closed"`). Valid statuses depend on the project's workflow configuration.
- **Custom fields**: map Jira custom field IDs to values via the `customFields` object or direct parameter names
