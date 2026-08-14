# Jira MCP

## Overview

Jira MCP is a Model Context Protocol (MCP) server for interacting with self-hosted Jira instances using Personal Access Token (PAT) authentication. It provides tools for creating, reading, updating, and deleting issues, searching with JQL, managing comments and assignments, and inspecting projects.

Official source:

- [GitHub: edrich13/mcp-jira-server](https://github.com/edrich13/mcp-jira-server)

## Features

- Personal Access Token authentication for self-hosted Jira.
- Create, read, update, and delete Jira issues.
- Search issues using JQL (Jira Query Language).
- Add and view comments.
- Manage issue assignments.
- List projects and issue types.
- Transition issues between statuses.
- Get current user information.

## Supported AI Clients

Jira MCP works with any MCP-compatible AI client. The server is started via `npx` and communicates over stdio.

- OpenCode

## When to Use

Use Jira MCP when an AI coding agent needs to interact with a self-hosted Jira instance.

Good fits:

- Creating and updating Jira issues from an AI agent.
- Searching for issues with JQL queries.
- Adding comments and managing issue assignments.
- Inspecting project metadata and issue types.
- Tracking work and status transitions.

Avoid using it with Jira Cloud (SaaS) — this server is designed for self-hosted Jira instances only.

## Requirements

- Node.js 18 or higher available on `PATH`.
- A self-hosted Jira instance (e.g., `https://jira.domain.com`).
- A Jira Personal Access Token with appropriate permissions.

## Related Skills

Relevant skills in this repository:

- [`backend-best-practices`](../../skills/backend-best-practices/SKILL.md): backend best practices for debugging and testing.