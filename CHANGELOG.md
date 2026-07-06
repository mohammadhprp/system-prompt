# Changelog

All notable changes to this project are documented here.

## Unreleased

### Added

- Added Excalidraw MCP entry (`mcps/excalidraw/`) with README, install, capabilities, troubleshooting, and OpenCode config for streaming hand-drawn Excalidraw diagrams via MCP Apps.

## 0.2.0 - 2026-07-06

### Added

- Added a framework-agnostic MCP catalog under `mcps/` with contribution guidance, naming conventions, and a required directory structure for future MCP entries.
- Added the Laravel Boost MCP catalog entry with overview, installation, capabilities, troubleshooting, and client-specific configuration examples.
- Added `references/standards/debugging.md` for root cause analysis, evidence preservation, and regression prevention.
- Added missing OpenCode setup section in `mcps/laravel-boost/install.md`.
- Added MCP catalog entries for Figma MCP Go (`mcps/figma-mcp-go/`), GitLab MCP (`mcps/gitlab-mcp/`), Jira MCP (`mcps/jira-mcp/`), Chrome DevTools MCP (`mcps/chrome-devtools/`), and Notion MCP (`mcps/notion-mcp/`), each with README, install, capabilities, troubleshooting, and OpenCode config.
- Added a framework-agnostic plugin catalog under `plugins/` with the OpenCode Goal Plugin entry (`plugins/opencode-goal-plugin/`) including README, install, capabilities, and troubleshooting.
- Updated the main README to present the repository as an AI coding agent framework that includes skills, standards, templates, and MCP documentation.
- Added `skills/skills-cli/` entry with SKILL.md, examples.md, and README update for Vercel Labs `npx skills` CLI.
- Created `skills/README.md` skill catalog with full table of 21 skills, How to Choose, and contribution guide. Replaced inline skill list in main README with brief overview + How to Choose a Skill section.
- Created `commands/` catalog with `commands/changelog.md`, `commands/architecture_review.md`, `commands/review.md`, `commands/pr.md`, and `commands/README.md`. Added Command Catalog section to main README.
- Added `agents/security-auditor.md` subagent for REST API security audits covering authentication, authorization, input validation, secrets, data protection, rate limiting, headers, and logging.
- Added `agents/backend-architect.md` subagent for scalable, secure backend system design covering API design, database architecture, system architecture, security, performance, and DevOps.
- Created `agents/README.md` agent catalog with table of 4 agents, permission conventions, and contribution guide. Added Agent Catalog section to main README with How to Choose guidance.

### Changed

- Moved `standards/` and `templates/` into `references/` and updated all 28 cross-references across AGENTS.md, README.md, CONTRIBUTING.md, CHANGELOG.md, mcps/README.md, plugins/README.md, and all 13 skill SKILL.md files.
- Rewrote all 11 standards (`api.md`, `architecture.md`, `database.md`, `documentation.md`, `logging.md`, `naming.md`, `observability.md`, `performance.md`, `pull-requests.md`, `security.md`, `testing.md`) from generic boilerplate into domain-specific content with concrete rules, best practices, anti-patterns, and checklists.
- Tailored Workflow, Common Mistakes, Failure Modes, Checklist, and Deliverables sections in all 13 skill `SKILL.md` files to match each skill's domain (e.g., review skills no longer have implementation workflows).
- Rewrote all 13 skill `examples.md` files with unique, domain-specific scenarios replacing the previous identical generic examples.
- Rewrote all 8 templates (`adr.md`, `api-spec.md`, `design-document.md`, `incident-report.md`, `postmortem.md`, `pull-request.md`, `runbook.md`, `task.md`) with type-specific sections instead of the shared generic shell.
- Differentiated `references/standards/logging.md` (structured JSON logging, levels, correlation, sensitive data) from `references/standards/observability.md` (SLOs, metrics types, tracing, dashboards, alerting).

### Fixed

- Fixed `references/standards/api.md` capitalization: "Api Standard" → "API Standard".
- Fixed `references/standards/pull-requests.md` grammar: "pull requests decisions" → "pull request decisions".

### Removed

- Removed duplicate `references/templates/architecture-decision.md` (identical to `references/templates/adr.md`).

## 0.1.0 - 2026-07-05

### Added

- Initial backend engineering skills library.
- Agent entry point and global system prompt.
- Canonical standards for architecture, APIs, data, naming, security, logging, observability, testing, performance, documentation, and pull requests.
- Practical templates for design, operations, incidents, and delivery.
