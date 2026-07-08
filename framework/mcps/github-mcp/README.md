# GitHub MCP

## Overview

The GitHub MCP Server connects AI tools directly to GitHub. Browse code, manage issues and PRs, analyze commits, monitor Actions workflows, and automate development workflows through natural language.

Official source:

- [GitHub: github/github-mcp-server](https://github.com/github/github-mcp-server)

## Features

- Repository browsing — read files, search code, explore directory trees, analyze commits.
- Issue & PR management — create, update, comment, review, and merge pull requests.
- CI/CD intelligence — monitor workflow runs, analyze build failures, manage releases.
- Code Analysis — examine security findings, review Dependabot alerts, understand code patterns.
- Team collaboration — access discussions, manage notifications, analyze team activity.

## Supported AI Clients

GitHub MCP officially documents setup for Claude Code, VS Code, GitHub Copilot, Cursor, Windsurf, Zed, and OpenCode.

- OpenCode

## When to Use

Use GitHub MCP when an AI coding agent needs direct access to GitHub.

Good fits:

- Browsing repository code, commits, and branches.
- Creating, reviewing, and merging pull requests.
- Managing issues, labels, and milestones.
- Monitoring Actions workflows and debugging CI failures.
- Analyzing Dependabot alerts and code scanning results.
- Managing GitHub releases and gists.

Avoid using it outside of GitHub-related workflows.

## Requirements

- A GitHub Personal Access Token with appropriate scopes (`repo` for private repos, `read:org` for org access).
- An MCP-compatible AI client that supports remote HTTP MCP servers.

## Related Skills

Relevant skills in this repository:

- [`code-review`](../../skills/code-review/SKILL.md): reviewing pull request diffs.
- [`backend-best-practices`](../../skills/backend-best-practices/SKILL.md): backend best practices for testing, debugging, and security review.
- [`pull-request`](../../skills/pull-request/SKILL.md): preparing and submitting pull requests.
