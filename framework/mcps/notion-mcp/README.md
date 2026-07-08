# Notion MCP

## Overview

Notion MCP is a hosted, officially maintained MCP server by Notion that lets AI agents search, read, and write content in a Notion workspace. It uses OAuth authentication and communicates over Streamable HTTP — no API tokens or local infrastructure required.

Official source:

- [Notion MCP get-started guide](https://developers.notion.com/guides/mcp/get-started-with-mcp)
- [Tool reference](https://developers.notion.com/guides/mcp/mcp-supported-tools)
- [GitHub: makenotion/notion-mcp-server](https://github.com/makenotion/notion-mcp-server) (open-source server, no longer actively maintained)

## Features

- Search across Notion workspace and connected tools (Slack, Google Drive, Jira).
- Fetch page and database content by URL or ID.
- Create, update, move, and duplicate pages.
- Create and update databases, data sources, and views (table, board, list, calendar, timeline, gallery, form, chart, map, dashboard).
- Query databases with SQL or using pre-defined views.
- Query meeting notes for the current user.
- Add and list comments and discussions.
- Get workspace teams and users.
- Async support for long-running create and update operations.
- OAuth authentication — no manual token management.

## Supported AI Clients

Notion MCP officially documents setup for Claude Code, Cursor, VS Code (GitHub Copilot), Claude Desktop, Windsurf, ChatGPT, Codex, and Antigravity.

- OpenCode

## When to Use

Use Notion MCP when an AI coding agent needs to read or write content in a Notion workspace.

Good fits:

- Creating project documentation pages from code context.
- Searching for existing notes, specs, or meeting notes.
- Updating task statuses, tracking work, or filing bugs.
- Querying databases for structured data.
- Managing comments and discussions on pages.
- Fetching user and team information from the workspace.

Avoid using it for fully automated or headless workflows — Notion MCP requires interactive OAuth authentication.

## Requirements

- A Notion workspace with appropriate permissions.
- An MCP-compatible AI client that supports remote HTTP (Streamable HTTP or SSE) MCP servers.
- For some tools (search, query, meeting notes): a Business plan or higher with Notion AI.

## Related Skills

Relevant skills in this repository:

- [`backend-engineer`](../../skills/backend-engineer/SKILL.md): creating and updating project documentation in Notion.
- [`backend-best-practices`](../../skills/backend-best-practices/SKILL.md): backend best practices for API design, testing, and debugging.