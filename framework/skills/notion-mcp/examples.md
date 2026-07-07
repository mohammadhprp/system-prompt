# Notion MCP Examples

## Example 1: Create Project Documentation

A new feature needs documentation in the team's Notion workspace. Good agent behavior:

- Use `notion-get-teams` to verify which team space the project docs live in.
- Use `notion-search` to find the existing project folder page.
- Use `notion-fetch` on the folder page to understand its structure and available templates.
- Use `notion-create-pages` with the parent, title, properties, and content matching the folder's page template.
- Use `notion-create-comment` to notify the team about the new documentation.

## Example 2: Track Bug Reports

A production bug needs to be filed in the team's bug tracking database. Good agent behavior:

- Use `notion-search` to find the bug tracking database.
- Use `notion-fetch` on the database to see its schema, properties, and available templates.
- Use `notion-create-pages` with the database parent, filling in title, severity, status, assignee, and reproduction steps.
- Use `notion-get-users` to look up the correct assignee's user ID.
- Use `notion-create-comment` on the new bug page to add environment details.

## Example 3: Query Tasks and Update Status

Review all in-progress tasks and update their status. Good agent behavior:

- Use `notion-fetch` on the tasks database to see its views and schema.
- Use `notion-query-database-view` on the "In Progress" view to filter active tasks.
- Use `notion-fetch` on each task page URL to review full details.
- Use `notion-update-page` to transition completed tasks to "Done" with a summary of what was completed.
- Use `notion-create-comment` on blocked tasks to document the blocker.