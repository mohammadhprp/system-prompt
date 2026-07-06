---
name: notion-mcp
description: Use this skill when working with the Notion MCP server tools for pages, databases, comments, search, users, and related Notion workflows.
---

# notion-mcp

Notion MCP server providing 14 tools for interacting with your Notion workspace via the Notion API.

## Tools

| Category         | Tools                                                                                                                                      | Default |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------|---------|
| Pages (6 tools)  | `fetch`, `create-pages`, `update-page`, `duplicate-page`, `move-pages`, `search`                                                          | yes     |
| Databases (4)    | `create-database`, `update-data-source`, `create-view`, `update-view`                                                                      | yes     |
| Comments (2)     | `create-comment`, `get-comments`                                                                                                           | yes     |
| Users & Teams (2)| `get-users`, `get-teams`                                                                                                                   | yes     |

All tools are available by default — there are no opt-in toolsets for this server.

## Key Workflows

### Page Lifecycle (see reference/pages.md)

`fetch` → `create-pages` → `update-page` / `duplicate-page` / `move-pages` → `search`

### Database Schema (see reference/databases.md)

`fetch` → `create-database` → `update-data-source` → `create-view` → `update-view`

### Comment Threads (see reference/comments.md)

`fetch` (with `include_discussions`) → `create-comment` → `get-comments`

### Search & Discovery

`search` → `fetch` → `get-users` / `get-teams`

## Parameter Hints

- **page_id / database_id**: UUID (with or without dashes) or full Notion URL. Extract from Notion page URLs or from `<page>` / `<database>` tags in fetch output.
- **data_source_id**: Found in `<data-source url="collection://...">` tags in fetch output. Used for `create-pages`, `update-data-source`, `create-view`.
- **Markdown content**: Notion-flavored Markdown. Supports inline formatting (bold, italic, code, links), inline math (`$Equation$`), and mention tags (`<mention-date>`, `<mention-user>`, `<mention-page>`, `<mention-database>`). Do not use `@today`, `@name`, `[[page]]` UI shortcuts.
- **Properties**: JSON map of property names to SQLite values. Date/place properties use expanded key format (e.g., `date:Due:start`, `place:Office:latitude`).
- **SQL DDL**: Used for `create-database` and `update-data-source` statements. Column names double-quoted, options single-quoted.

## Irreversible Tools

`move-pages` — permanently relocates pages. Cannot be undone programmatically. Use with caution.

## Advanced

- **Enhanced Markdown spec**: Read `notion://docs/enhanced-markdown-spec` through your MCP client's resource reader before writing page content.
- **View DSL spec**: Read `notion://docs/view-dsl-spec` through your MCP client's resource reader before configuring views.
- **Templates**: `create-pages` and `update-page` support applying page templates (template IDs shown in `<templates>` section of fetch output).
- **Multi-source databases**: Some databases have multiple data sources. Use `fetch` to identify the correct `data_source_id`.
- **Verification**: `update-page` with `update_verification` command supports verifying pages as reviewed (Business/Enterprise plan required).
