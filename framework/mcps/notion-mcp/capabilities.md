# Notion MCP Capabilities

## What It Can Do

18 tools for searching, reading, and writing content in a Notion workspace.

### Search & Fetch

| Tool | Description |
| --- | --- |
| `notion-search` | Search across workspace and connected tools (Slack, Drive, Jira); requires Notion AI for cross-tool search |
| `notion-fetch` | Fetch content from a page, database, or data source by URL or ID; pass `self` to get workspace and user identity |

### Create

| Tool | Description |
| --- | --- |
| `notion-create-pages` | Create one or more pages with properties, content, icons, and covers; supports database templates and async mode |
| `notion-create-database` | Create a new database with specified properties, initial data source, and initial view |
| `notion-create-view` | Create a view on a database (table, board, list, calendar, timeline, gallery, form, chart, map, dashboard) |
| `notion-create-comment` | Add a comment to a page, block-level content, or reply to an existing discussion |

### Update

| Tool | Description |
| --- | --- |
| `notion-update-page` | Update page properties, content, icon, or cover; supports database templates and async mode |
| `notion-update-data-source` | Update a data source's properties, name, description |
| `notion-update-view` | Update a view's name, filters, sorts, display configuration |

### Move & Duplicate

| Tool | Description |
| --- | --- |
| `notion-move-pages` | Move one or more pages or databases to a new parent |
| `notion-duplicate-page` | Duplicate a page within the workspace (async) |

### Query

| Tool | Description |
| --- | --- |
| `notion-query-data-sources` | Query data sources with SQL across multiple databases; requires Business plan or higher with Notion AI |
| `notion-query-database-view` | Query a database using a pre-defined view's filters and sorts; requires Business plan or higher with Notion AI |
| `notion-query-meeting-notes` | Query the current user's meeting notes; requires Business plan or higher with Notion AI |

### Comments

| Tool | Description |
| --- | --- |
| `notion-get-comments` | List all comments and discussions on a page, including resolved threads |

### Workspace

| Tool | Description |
| --- | --- |
| `notion-get-teams` | List teams (teamspaces) in the current workspace |
| `notion-get-users` | List workspace members and guests with search by name or email; pass `self` for current user |

### Async Tasks

| Tool | Description |
| --- | --- |
| `notion-get-async-task` | Check the status of an async task (duplicate, large create/update) |

### OpenAI Client Note

When connecting from an OpenAI-based client (ChatGPT), `notion-fetch` and `notion-search` appear without the `notion-` prefix as `fetch` and `search`.

## What It Cannot Do

- It cannot work without interactive OAuth authentication — no PAT or bearer token support.
- It cannot upload images or file attachments (on the roadmap).
- It cannot access Notion content outside the authenticated user's permissions.
- Some tools require a Business plan or higher with Notion AI (search, query tools).
- It cannot operate fully headless or automated — a human must complete the OAuth flow.
- It cannot be self-hosted (use the deprecated open-source server for that).

## Best Practices

- Use `notion-fetch` with `self` to verify the workspace and user identity after connecting.
- Use `notion-fetch` with a page URL to understand its structure before making changes.
- Use `notion-search` first to find relevant pages, then `notion-fetch` to read details.
- Use `allow_async: true` for large page create/update operations, then poll with `notion-get-async-task`.
- Fetch a database first to see available templates before creating pages with them.
- Use `notion-get-users` to look up user IDs before assigning or mentioning users.
- Stay within rate limits: 180 requests/min average (shared across all tools), 30 requests/min for search.

## Common Workflows

### Search and read content

1. Call `notion-search` to find pages matching a topic.
2. Call `notion-fetch` with a page URL to read its full content.
3. Call `notion-get-comments` to see discussions on the page.

### Create a page from a template

1. Call `notion-fetch` on a database to see available templates.
2. Call `notion-create-pages` with the template reference and desired properties.
3. Optionally set an icon and cover image.

### Update a task status

1. Call `notion-fetch` with the page URL to get the current properties.
2. Call `notion-update-page` to change the status property.
3. Call `notion-create-comment` to leave a note about the change.

### Query a database

1. Call `notion-fetch` on the database URL to see its schema and views.
2. Call `notion-query-database-view` with a view name to get filtered results.
3. Or call `notion-query-data-sources` with SQL for custom queries.

### Duplicate and populate a template

1. Call `notion-duplicate-page` on a template page.
2. Poll with `notion-get-async-task` until complete.
3. Call `notion-update-page` on the new copy to fill in properties.