# Skill Catalog

A curated catalog of task-specific procedures for AI coding agents.

This catalog is framework-agnostic: each skill defines when to activate, a step-by-step workflow, and the engineering judgment expected of the agent.

## Available Skills

| Skill | Purpose | Best fit |
| --- | --- | --- |
| [backend-best-practices](./backend-best-practices/SKILL.md) | Consolidated backend engineering practices for API design, architecture, data, security, testing, observability, performance, debugging, and refactoring. | Any backend task that benefits from structured domain guidance across multiple backend disciplines. |
| [backend-engineer](./backend-engineer/SKILL.md) | Analyze backend requirements, risks, and implementation plans before coding. | General problem solving, requirements analysis, and risk management. |
| [brainstorming](./brainstorming/SKILL.md) | Turn ideas into fully formed designs and specs through collaborative dialogue before any implementation. | Starting a new feature, component, or project; any work that benefits from design before code. |
| [brand-guidelines](./brand-guidelines/SKILL.md) | Apply Anthropic's official brand colors and typography to artifacts for company look-and-feel. | Styling artifacts with brand colors, typography, or visual design standards. |
| [code-review](./code-review/SKILL.md) | Review backend changes for correctness, readability, maintainability, tests, performance, and security. | Reviewing pull requests, evaluating code quality, or mentoring. |
| [design-like-damien](./design/SKILL.md) | Apply premium, editorial-quality UI design philosophy and Lovable prompting system to produce interfaces that never look &ldquo;AI-generated.&rdquo; | Building apps, landing pages, or dashboards in Lovable; UI/UX design for premium SaaS, dark mode, typography, and scroll animations. |
| [diagram-design](./diagram-design/SKILL.md) | Create technical and product diagrams as standalone HTML files with inline SVG and an opinionated editorial design system. | Architecture, data, process, and other diagrams that communicate more clearly than prose or tables. |
| [documentation](./documentation/SKILL.md) | Create ADRs, design docs, runbooks, API docs, and operational knowledge that stays useful. | Writing documentation, post-incident reviews, or onboarding guides. |
| [find-skills](./find-skills/SKILL.md) | Discover, evaluate, and install skills from the open agent skills ecosystem. | Finding an installable skill for a specialized task or extending an agent's capabilities. |
| [gitlab-mcp](./gitlab-mcp/SKILL.md) | Work with the GitLab MCP server tools for merge requests, issues, repositories, pipelines, and CI/CD workflows. | Any project hosted on GitLab (SaaS or self-hosted). |
| [jira-mcp](./jira-mcp/SKILL.md) | Work with the Jira MCP server tools for issue management, JQL search, comments, and project inspection. | Any project using self-hosted Jira for issue tracking. |
| [laravel-best-practices](./laravel-best-practices/SKILL.md) | Apply Laravel PHP patterns for Eloquent, validation, security, testing, caching, and architecture. | Writing, reviewing, or refactoring Laravel PHP code. |
| [lavish](./lavish/SKILL.md) | Turn complex or visual agent responses into rich, reviewable HTML artifacts the user can annotate and send feedback on. | Plans, comparisons, diagrams, tables, code diffs, or any output easier to grasp visually than as prose. |
| [notion-mcp](./notion-mcp/SKILL.md) | Work with the Notion MCP server tools for pages, databases, comments, search, and workspace management. | Any project that uses Notion for documentation, tracking, or collaboration. |
| [pull-request](./pull-request/SKILL.md) | Prepare small, reviewable changes with clear evidence, risk, deployment, and rollback notes. | Preparing PRs, writing descriptions, or planning safe deployments. |
| [skill-creator](./skill-creator/SKILL.md) | Create new skills, modify and improve existing skills, and measure skill performance. | Designing new skills, optimizing existing skills, or running evals. |

## How Skills Are Organized

Each skill entry follows this structure:

```text
skills/<skill-name>/
├── SKILL.md       # Full skill definition: triggers, workflow, standards references (Required)
├── examples.md    # Example output showing expected format (Required)
├── references/    # Docs loaded into context as needed (Optinal)
│   └── schemas.md      
└── scripts/      # Executable code (bash/node/python) for deterministic/repetitive tasks (Optinal)
    └── validate.sh
```

## How to Choose a Skill

Use the skill table above to find the entry closest to the task at hand. Skills are activated based on the `description` field in their frontmatter, which defines when an AI agent should load them.

Before activating a skill, check:

- **Fit**: does the skill's purpose match the current task?
- **Scope**: some skills are general (Backend Engineer), others are narrow (Laravel Best Practices).
- **Combination**: complex tasks may need multiple skills (e.g., API Design + Security + Testing).
- **Sequence**: some skills are best used in order (e.g., Architecture Review before Database Design).

## How to Contribute a New Skill

1. Create `skills/<skill-name>/` with `SKILL.md` and `examples.md`.
2. The `name` in the frontmatter must be **kebab-case** and match the directory name (e.g., `name: my-skill` for `skills/my-skill/`).
3. Write a clear `description` in the frontmatter — this determines when agents activate the skill.
4. Define when to activate, a step-by-step workflow, standards references, and expected outcomes.
5. Add 3+ realistic examples in `examples.md` showing good agent behavior.
6. Add the skill to the table in this README.

## Related Repository Areas

- [`mcps/`](../mcps/) contains the MCP (Model Context Protocol) server catalog.
- [`plugins/`](../plugins/) contains the OpenCode plugin catalog.
- [`references/standards/`](../references/standards/) contains canonical engineering rules.
- [`references/templates/`](../references/templates/) contains reusable engineering deliverables.
