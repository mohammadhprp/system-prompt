# GitLab MCP

## Overview

GitLab MCP is a comprehensive GitLab MCP server for AI clients. Manage projects, merge requests, issues, pipelines, wiki, releases, tags, milestones, and more through stdio, SSE, and Streamable HTTP transports. Supports PAT, OAuth, read-only mode, dynamic API URLs, and remote authorization.

Official source:

- [GitHub: zereight/gitlab-mcp](https://github.com/zereight/gitlab-mcp)
- [Documentation](https://zereight.github.io/gitlab-mcp/)

## Features

- Broad GitLab coverage — 117+ tools for projects, repository browsing, merge requests, issues, pipelines, wiki, releases, tags, labels, milestones, and more.
- Flexible auth — Personal Access Token, local OAuth2 browser flow, MCP OAuth proxy, and per-request remote authorization.
- Multiple transports — stdio for local clients, SSE for legacy clients, and Streamable HTTP for modern remote deployments.
- Client-friendly setup — examples for Claude Code, Codex, OpenCode, Copilot, Cline, Roo Code, Cursor, and more.
- Self-hosted ready — works with custom GitLab instances, proxy settings, and dynamic API URL routing.
- Permission modes — `readonly`, `modify` (no delete), or `full`; tool filtering by toolset groups, allow-list, and deny-list.

## Supported AI Clients

GitLab MCP officially documents setup for Claude Code, VS Code, GitHub Copilot, Codex, Cursor, and JSON-based MCP clients.

- OpenCode

## When to Use

Use GitLab MCP when an AI coding agent needs to interact with a GitLab instance.

Good fits:

- Reviewing, approving, and merging merge requests.
- Browsing repositories, files, and commit history.
- Creating and managing issues and to-do items.
- Inspecting CI/CD pipelines and job logs.
- Managing wiki pages, milestones, labels, and releases.
- Automating GitLab workflows from an AI agent.

Avoid using it outside of GitLab-related workflows.

## Requirements

- Node.js >= 18 and npm (for `npx` or global install), or Homebrew (for `brew install`).
- A GitLab account with API access.
- A Personal Access Token with appropriate scopes, or OAuth2 credentials.

## Related Skills

Relevant skills in this repository:

- [`backend-engineer`](../../skills/backend-engineer/SKILL.md): feature work in projects hosted on GitLab.
- [`api-design`](../../skills/api-design/SKILL.md): designing APIs and reviewing MRs.
- [`code-review`](../../skills/code-review/SKILL.md): reviewing merge request diffs.
- [`testing`](../../skills/testing/SKILL.md): verifying CI pipeline results.
- [`debugging`](../../skills/debugging/SKILL.md): diagnosing failures with pipeline logs and job output.
- [`performance`](../../skills/performance/SKILL.md): reviewing performance-sensitive MRs.
- [`security`](../../skills/security/SKILL.md): reviewing security-sensitive MRs and secret exposure.