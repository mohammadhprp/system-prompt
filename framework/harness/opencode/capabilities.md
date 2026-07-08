# OpenCode Harness Capabilities

After full installation, the OpenCode agent gains the following capabilities.

## Repository Awareness

| Capability | Source |
| --- | --- |
| Understand the repository structure, conventions, and standards. | [`AGENTS.md`](../../AGENTS.md) |
| Select and load task-specific skills for engineering, review, testing, and more. | [`skills/`](../../skills/) catalog |
| Access project documentation via the `references.docs` path. | [`opencode.json`](./configs/opencode.json) |

## MCP Tools

| Tool | Source | Purpose |
| --- | --- | --- |
| Chrome DevTools MCP | [`chrome-devtools`](../../mcps/chrome-devtools/README.md) | Control Chrome – traces, debugging, screenshots, automation. |
| Notion MCP | [`notion`](../../mcps/notion-mcp/README.md) | Read and write Notion pages and databases. |

## Plugin Features

| Feature | Source | Purpose |
| --- | --- | --- |
| `/goal` command | [`opencode-goal-plugin`](../../plugins/opencode-goal-plugin/README.md) | Long-running goal tracking with completion evidence. |
| Goal sidebar indicator | `tui.json` | Visual goal status in the terminal UI. |
| Goal persistence | Plugin | Survives session compaction and restarts. |

## Slash Commands

| Command | Purpose |
| --- | --- |
| `/changelog` | Create, add, or update CHANGELOG.md. |
| `/commit` | Create atomic commits with conventional messages. |
| `/learn` | Distill a reusable skill from any source. |
| `/pr` | Create a GitHub PR or GitLab MR. |
| `/review` | Perform comprehensive code quality review. |
| `/summarize-changes` | Summarize uncommitted changes. |

## Skills

24 task-specific skills are available in [`skills/`](../../skills/README.md), covering:

- Backend engineering and architecture
- API and database design
- Code review and security auditing
- Debugging and performance analysis
- Testing and documentation
- Pull request preparation
- Framework-specific skills (Laravel, Jira, GitLab, Notion, Chrome DevTools)
- Refactoring and skill creation
