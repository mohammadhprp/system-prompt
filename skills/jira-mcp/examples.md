# Jira MCP Examples

## Example 1: Create and Assign a Bug

A production bug is discovered and needs to be tracked. Good agent behavior:

- Use `jira_get_projects` to find the correct project key.
- Use `jira_get_issue_types` to confirm valid types for the project.
- Use `jira_create_issue` with project key, summary, description, priority, and labels.
- Use `jira_assign_issue` to assign the bug to the responsible developer.
- Use `jira_add_comment` to include reproduction steps and environment details.

## Example 2: Find and Update Issues

Search for all high-priority unresolved issues assigned to the user. Good agent behavior:

- Use `jira_search_issues` with a JQL query like `assignee = currentUser() AND priority = High AND status != Done`.
- Use `jira_get_issue` on each result to review full details.
- Use `jira_update_issue` to transition the status to "In Progress".
- Use `jira_add_comment` to log what work is being started.
- Summarize the findings in a structured report grouped by status.

## Example 3: Close a Sprint Task

A task is complete and ready to close. Good agent behavior:

- Use `jira_get_current_user` to verify authentication is working.
- Use `jira_search_issues` to find the task by key or summary.
- Use `jira_get_issue` to review current status, assignee, and description.
- Use `jira_update_issue` to set status to "Done" and add a resolution note.
- Use `jira_add_comment` to document what was completed and any follow-ups.