# Changelog

All notable changes to this project are documented here.

## Unreleased

### Added
- Show Me skill for explaining the current topic visually with diagrams, code-shape sketches, and focused HTML artifacts.
- Frontend Design skill for distinctive, intentional visual design that doesn't read as templated defaults.
- Humanizer skill for removing signs of AI-generated writing from text.
- CodeNavi skill for navigating unknown codebases with a persistent `.notebook/` knowledge base.
- Create ADR skill for documenting significant architectural choices and their rationale.

## [v0.11.1] - 2026-08-13

### Changed
- Split generic agent guidance from project-specific context instructions.

## [v0.11.0] - 2026-08-09

### Added
- Added package keywords for npm discovery.

### Changed
- Switched package publication from GitHub Packages to the public npm registry.

## [v0.10.1] - 2026-08-08

### Added
- Agent Browser skill for browser and Electron automation, exploratory testing, QA, screenshots, and data extraction.
- Find Skills skill for discovering, evaluating, and installing agent skills from the open skills ecosystem.
- Generated OpenCode `tui.json` and `.gitignore` files from the installer.

### Changed
- OpenCode installation now always targets `./.opencode`, configures the goal plugin in both OpenCode config files, and generates a minimal `/init`-ready `AGENTS.md`.

### Removed
- The obsolete `framework/harness/` directory and harness selection prompt.

## [v0.10.0] - 2026-08-06

### Added
- Supabase MCP: remote MCP server for Supabase project and data management.
- Diagram Design skill: create technical and product diagrams as standalone HTML files with inline SVG.

## [v0.9.0] - 2026-07-16

### Added
- Memory catalog: persistent agent memory files (codebase-insights, user-preferences) installed to `.opencode/memory/` with glob auto-included in opencode.json `instructions` array.
- Separate `mr` and `pr` slash commands for GitLab and GitHub respectively.

### Fixed
- GitLab, Jira, and Notion MCP config updates.

### Removed
- Unused pull-request skill.

## [v0.8.0] - 2026-07-09

### Added
- Re-install diff detection: when running the CLI in a directory with an existing config, shows what items will be added, removed, or unchanged before confirming. Removed items are deleted from disk on re-install.

### Fixed
- Updated GitHub token variable name.
- Removed graphify MCP from default installs.
- Updated GitHub MCP config path references.

## [v0.7.1] - 2026-07-08

### Added
- New consolidated `backend-best-practices` skill with 9 domain reference files (api-design, architecture-review, database-design, debugging, observability, performance, refactoring, security, testing).

### Changed
- Consolidated 9 backend skills into `backend-best-practices`.

### Fixed
- Removed unused `update` option from the CLI.
- Renamed test folder to be parallel.
- Removed unused `skills-cli` skill.
- Removed unused `web-artifacts-builder` skill.
- Removed Chrome DevTools MCP and skill.
- Removed unused `architecture-review` command.

## [v0.7.0] - 2026-07-08

### Added
- Auto-generation of `.opencode/.env` from MCP `.env.example` files when installing MCPs that declare env vars. Merge/preserve existing `.env` values on re-install.
- New GitHub MCP framework entry (`framework/mcps/github-mcp/`) — remote HTTP MCP for browse repos, manage issues/PRs, monitor Actions workflows. Auth via `GITHUB_TOKEN` env var.
- New Modes catalog (`framework/modes/`) and CLI category — behavior, tool, and prompt presets for different use cases. Initial entry: `audit` read-only high-scrutiny review mode.

## [v0.6.0] - 2026-07-08

### Added
- Added Ponytail plugin catalog entry (`framework/plugins/ponytail/`) — lazy senior dev mode with YAGNI-first ladder, slash commands, bundled skills, and cross-platform install guide.
- Replaced `new-framework-items.json` with `new`/`deprecated`/`removed` lifecycle flags on catalog items; update shows new items, warns on deprecated, auto-cleans removed.

### Changed
- Derived CLI category options dynamically from the catalog instead of hardcoding them.

### Fixed
- Stopped copying plugin source directories to output; plugins install via npm package names only.
- Made `opencode.json` `instructions` respect user's AGENTS.md/system-prompt.md choices.
- Preserved AGENTS.md during `system-prompt update` (no longer overwrites).

## [v0.5.2] - 2026-07-08

### Added
- Added Playwright MCP framework documentation and OpenCode config.
- Added dependency-free Node test coverage for catalog integrity, config generation, installer output, and update selection helpers.

## 0.5.1 - 2026-07-07

### Added
- Show CLI package version in the intro banner.
- Prompt for explicitly marked new framework components during `system-prompt update`.

### Fixed
- Register the `/release` command in the CLI catalog.

## 0.5.0 - 2026-07-07

### Added
- `/release` command for creating releases with tagging, changelog generation, and version bumping
- Made `AGENTS.md` and `system-prompt.md` optional in bootstrap flow

## 0.4.1 - 2026-07-07

### Added
- system-prompt update with system-prompt-lock.json
- GitHub Packages for @mohammadhprp/system-prompt

## 0.4.0 - 2026-07-07

### Added

- Interactive bootstrap CLI (`bin/system-prompt.js`, `src/`) with `@clack/prompts` prompt flow for installing skills, agents, commands, MCPs, plugins, styles, standards, and templates into any project.
- `npm link` support — run `system-prompt` locally after linking.
- MCP configs in generated `opencode.json` are read from `mcps/<name>/configs/opencode.json` instead of hardcoded.

### Changed

- Moved all framework content (`agents/`, `commands/`, `skills/`, `mcps/`, `plugins/`, `styles/`, `references/`, `harness/`) into `framework/` subdirectory.
- Rewrote root `README.md` for project installation and development instructions.
- Rewrote root `AGENTS.md` for development-oriented agent guidance.
- Updated `framework/harness/opencode/configs/opencode.json` reference paths after `framework/` move.
- Updated `.gitignore` with `node_modules/` and `*.log`.

## 0.3.0 - 2026-07-07

### Added

- Created `skills/design/examples.md` with 3 realistic examples for the Design Like Damien skill (Premium SaaS Landing Page, Converting Figma to Lovable, Fixing Generic AI-Generated UI).
- Added Design Like Damien skill entry to `skills/README.md` catalog table between Debugging and Documentation.
- Added `styles/` catalog with Linear and Raycast design system references from Refero Styles.
- Added new references (passport, pennant, pest-testing, pulse, scout, spatie-backup, spatie-permission, spatie-medialibrary, tailwindcss) to laravel-best-practices skill with 5 new sections (Feature Flags, Monitoring, Full-Text Search, Backup, Media Library).
- Created `styles/README.md` with style catalog table, usage guide, and source attribution.
- Created `styles/linear/README.md` with full Linear design token reference, components, and CSS/Tailwind snippets.
- Created `styles/raycast/README.md` with full Raycast design token reference, components, and CSS/Tailwind snippets.
- Added Style section to root README with catalog link and selection guidance.

## 0.2.1 - 2026-07-06

### Added

- Added `brand-guidelines` and `web-artifacts-builder` skills to `skills/README.md` catalog.
- Added `commands/learn.md` command (`/learn`) for distilling reusable skills from any source (directory, URL, workflow, or pasted notes) using the skill-creator skill.
- Added Excalidraw MCP entry (`mcps/excalidraw/`) with README, install, capabilities, troubleshooting, and OpenCode config for streaming hand-drawn Excalidraw diagrams via MCP Apps.
- Added `commands/summarize-changes.md` command for summarizing uncommitted changes and flagging risky patterns.

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
- Created `commands/` catalog with `commands/changelog.md`, `commands/architecture-review.md`, `commands/review.md`, `commands/pr.md`, and `commands/README.md`. Added Command Catalog section to main README.
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
