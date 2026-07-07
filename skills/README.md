# Skill Catalog

A curated catalog of task-specific procedures for AI coding agents.

This catalog is framework-agnostic: each skill defines when to activate, a step-by-step workflow, and the engineering judgment expected of the agent.

## Available Skills

| Skill | Purpose | Best fit |
| --- | --- | --- |
| [API Design](./api-design/SKILL.md) | Design stable resource contracts, validation, compatibility, and operational behavior. | Designing new APIs, extending existing contracts, or reviewing API compatibility. |
| [Architecture Review](./architecture-review/SKILL.md) | Evaluate system boundaries, coupling, cohesion, complexity, reliability, and scalability. | Reviewing system design, identifying architectural debt, or planning large changes. |
| [Backend Engineer](./backend-engineer/SKILL.md) | Analyze backend requirements, risks, and implementation plans before coding. | General problem solving, requirements analysis, and risk management. |
| [Brainstorming](./brainstorming/SKILL.md) | Turn ideas into fully formed designs and specs through collaborative dialogue before any implementation. | Starting a new feature, component, or project; any work that benefits from design before code. |
| [Brand Guidelines](./brand-guidelines/SKILL.md) | Apply Anthropic's official brand colors and typography to artifacts for company look-and-feel. | Styling artifacts with brand colors, typography, or visual design standards. |
| [Chrome DevTools](./chrome-devtools/SKILL.md) | Expert-level browser automation, debugging, and performance analysis using Chrome DevTools MCP. | Web page debugging, performance profiling, screenshot capture, and network analysis. |
| [Code Review](./code-review/SKILL.md) | Review backend changes for correctness, readability, maintainability, tests, performance, and security. | Reviewing pull requests, evaluating code quality, or mentoring. |
| [Database Design](./database-design/SKILL.md) | Design data models, constraints, transactions, indexes, and migrations. | Schema design, migration planning, or query optimization. |
| [Debugging](./debugging/SKILL.md) | Find root causes through reproduction, isolation, logs, metrics, traces, and controlled experiments. | Production defects, performance regressions, or hard-to-reproduce bugs. |
| [Design Like Damien](./design/SKILL.md) | Apply premium, editorial-quality UI design philosophy and Lovable prompting system to produce interfaces that never look &ldquo;AI-generated.&rdquo; | Building apps, landing pages, or dashboards in Lovable; UI/UX design for premium SaaS, dark mode, typography, and scroll animations. |
| [Documentation](./documentation/SKILL.md) | Create ADRs, design docs, runbooks, API docs, and operational knowledge that stays useful. | Writing documentation, post-incident reviews, or onboarding guides. |
| [GitLab MCP](./gitlab-mcp/SKILL.md) | Work with the GitLab MCP server tools for merge requests, issues, repositories, pipelines, and CI/CD workflows. | Any project hosted on GitLab (SaaS or self-hosted). |
| [Jira MCP](./jira-mcp/SKILL.md) | Work with the Jira MCP server tools for issue management, JQL search, comments, and project inspection. | Any project using self-hosted Jira for issue tracking. |
| [Laravel Best Practices](./laravel-best-practices/SKILL.md) | Apply Laravel PHP patterns for Eloquent, validation, security, testing, caching, and architecture. | Writing, reviewing, or refactoring Laravel PHP code. |
| [Lavish](./lavish/SKILL.md) | Turn complex or visual agent responses into rich, reviewable HTML artifacts the user can annotate and send feedback on. | Plans, comparisons, diagrams, tables, code diffs, or any output easier to grasp visually than as prose. |
| [Notion MCP](./notion-mcp/SKILL.md) | Work with the Notion MCP server tools for pages, databases, comments, search, and workspace management. | Any project that uses Notion for documentation, tracking, or collaboration. |
| [Observability](./observability/SKILL.md) | Design logs, metrics, traces, health checks, dashboards, and alerts for production operations. | Designing observability strategy, reviewing signals, or debugging reliability issues. |
| [Performance](./performance/SKILL.md) | Diagnose and improve CPU, memory, network, storage, caching, and query behavior using evidence. | Performance profiling, bottleneck analysis, or capacity planning. |
| [Pull Request](./pull-request/SKILL.md) | Prepare small, reviewable changes with clear evidence, risk, deployment, and rollback notes. | Preparing PRs, writing descriptions, or planning safe deployments. |
| [Refactoring](./refactoring/SKILL.md) | Improve code structure safely while preserving behavior through small verified steps. | Behavior-preserving cleanup, reducing technical debt, or improving testability. |
| [Security](./security/SKILL.md) | Apply practical security review across identity, access, secrets, data handling, and abuse resistance. | Security reviews, threat modeling, or implementing auth/authorization. |
| [Skill Creator](./skill-creator/SKILL.md) | Create new skills, modify and improve existing skills, and measure skill performance. | Designing new skills, optimizing existing skills, or running evals. |
| [Skills CLI](./skills-cli/SKILL.md) | Discover, install, and manage agent skills using the `npx skills` CLI from Vercel Labs. | Finding new skills, installing from registry, or managing installed skills. |
| [Testing](./testing/SKILL.md) | Design deterministic unit, integration, contract, and end-to-end testing strategies. | Writing tests, designing test strategies, or reviewing test coverage. |
| [Web Artifacts Builder](./web-artifacts-builder/SKILL.md) | Create elaborate, multi-component HTML artifacts using React, Tailwind CSS, and shadcn/ui. | Building complex frontend artifacts requiring state management or UI component libraries. |

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
2. Write a clear `description` in the frontmatter — this determines when agents activate the skill.
3. Define when to activate, a step-by-step workflow, standards references, and expected outcomes.
4. Add 3+ realistic examples in `examples.md` showing good agent behavior.
5. Add the skill to the table in this README.

## Related Repository Areas

- [`mcps/`](../mcps/) contains the MCP (Model Context Protocol) server catalog.
- [`plugins/`](../plugins/) contains the OpenCode plugin catalog.
- [`references/standards/`](../references/standards/) contains canonical engineering rules.
- [`references/templates/`](../references/templates/) contains reusable engineering deliverables.
