export const categories = {
  skills: {
    title: 'Skills',
    description: 'Task-specific procedures for AI coding agents',
    sourceDir: 'framework/skills',
    items: [
      { id: 'agent-browser', name: 'Agent Browser', description: 'Automate browser and Electron workflows for navigation, testing, screenshots, and data extraction' },
      { id: 'backend-best-practices', name: 'Backend Best Practices', description: 'Consolidated backend engineering practices across API, data, security, testing, and operations' },
      { id: 'brainstorming', name: 'Brainstorming', description: 'Turn ideas into fully formed designs through dialogue' },
      { id: 'code-review', name: 'Code Review', description: 'Review backend changes for correctness and maintainability' },
      { id: 'codenavi', name: 'CodeNavi', description: 'Navigate unknown codebases with precision, a persistent .notebook knowledge base, and surgical implementation' },
      { id: 'create-adr', name: 'Create ADR', description: 'Create Architecture Decision Records documenting significant architectural choices and rationale' },
      { id: 'design', name: 'Design Like Damien', description: 'Premium UI design philosophy and Lovable prompting' },
      { id: 'diagram-design', name: 'Diagram Design', description: 'Create technical and product diagrams as standalone HTML with inline SVG' },
      { id: 'docs-writer', name: 'Docs Writer', description: 'Write, review, and edit documentation files with consistent structure, tone, and technical accuracy' },
      { id: 'effective-html', name: 'Effective HTML', description: 'Create self-contained HTML artifacts with routed guidance for design, wireframes, prototypes, plans, and diagrams' },
      { id: 'find-skills', name: 'Find Skills', description: 'Discover, evaluate, and install agent skills for specialized tasks' },
      { id: 'frontend-design', name: 'Frontend Design', description: 'Distinctive, intentional visual design for new UI or reshaping existing UI' },
      { id: 'glab', name: 'Glab', description: 'Work with GitLab via the glab CLI for MRs, issues, and pipelines' },
      { id: 'great-interface', name: 'Great Interface', description: 'Build, explain, review, and refine product interfaces across accessibility, layout, writing, typography, color, and UI polish' },
      { id: 'humanizer', name: 'Humanizer', description: 'Remove signs of AI-generated writing to make text sound more natural and human' },
      { id: 'improve', name: 'Improve', description: 'Audit repositories and produce prioritized, read-only implementation plans for another agent' },
      { id: 'jira-cli', name: 'Jira CLI', description: 'Work with Jira via the jira CLI for issues, sprints, and epics' },
      { id: 'laravel-best-practices', name: 'Laravel Best Practices', description: 'Laravel patterns for Eloquent, validation, testing' },
      { id: 'learning-opportunities', name: 'Learning Opportunities', description: 'Facilitate deliberate skill development during AI-assisted coding with short, interactive exercises' },
      { id: 'notion-mcp', name: 'Notion MCP', description: 'Work with Notion MCP for pages, databases, search' },
      { id: 'perf-web-optimization', name: 'Web Performance Optimization', description: 'Optimize web performance: bundle size, images, caching, lazy loading, and overall page speed' },
      { id: 'security-best-practices', name: 'Security Best Practices', description: 'Language and framework specific security best-practice reviews and secure-by-default coding help' },
      { id: 'sentry', name: 'Sentry', description: 'Inspect Sentry issues, summarize production errors, and pull health data via the Sentry API' },
      { id: 'show-me', name: 'Show Me', description: 'Explain the current topic visually with diagrams, code-shape sketches, and focused HTML artifacts' },
      { id: 'skill-creator', name: 'Skill Creator', description: 'Create and evaluate new agent skills' },
      { id: 'spec-driven-eval', name: 'Spec-Driven Eval', description: 'Score how completely an implementation fulfills a PRD/spec, case by case, into a single comparable grade' },
      { id: 'technical-design-doc-creator', name: 'Technical Design Doc Creator', description: 'Create comprehensive Technical Design Documents with mandatory and optional sections through interactive discovery' },
      { id: 'taste', name: 'Taste', description: 'Unified design-quality skill spanning anti-slop frontend, image generation and image-to-code, brand kits, minimalist and industrial UI, and Google Stitch design systems' },
      { id: 'tlc-spec-driven', name: 'TLC Spec-Driven', description: 'Feature planning and implementation with adaptive phases, EARS testable requirements, atomic commits, and independent verification' },
      { id: 'web-design-guidelines', name: 'Web Design Guidelines', description: 'Review UI code for Web Interface Guidelines compliance: accessibility, interaction patterns, and design best practices' }
    ],
  },

  agents: {
    title: 'Subagents',
    description: 'Specialized subagents for security, architecture, review, and research',
    sourceDir: 'framework/agents',
    items: [
      { id: 'backend-architect', name: 'Backend Architect', description: 'Design scalable, secure backend systems' },
      { id: 'researcher', name: 'Researcher', description: 'Fetch and analyze web content from URLs' },
      { id: 'reviewer', name: 'Reviewer', description: 'Review code for correctness and best practices' },
      { id: 'security-auditor', name: 'Security Auditor', description: 'Conduct security audits for REST APIs' },
    ],
  },

  commands: {
    title: 'Slash Commands',
    description: 'Slash command workflows for repeatable tasks',
    sourceDir: 'framework/commands',
    items: [
      { id: 'changelog', name: 'Changelog', description: 'Create, add, or update CHANGELOG.md entries' },
      { id: 'commit', name: 'Commit', description: 'Create atomic git commits with conventional messages' },
      { id: 'learn', name: 'Learn', description: 'Distill a reusable skill from any source' },
      { id: 'pr', name: 'PR', description: 'Create a GitHub PR for the current branch' },
      { id: 'mr', name: 'MR', description: 'Create a GitLab MR for the current branch' },
      { id: 'release', name: 'Release', description: 'Tag releases, update changelog, and bump versions' },
      { id: 'review', name: 'Review', description: 'Perform comprehensive code quality review' },
      { id: 'summarize-changes', name: 'Summarize Changes', description: 'Summarize uncommitted changes and flag risks' },
    ],
  },

  mcps: {
    title: 'MCPs',
    description: 'Model Context Protocol servers for AI coding agents',
    sourceDir: 'framework/mcps',
    items: [
      { id: 'excalidraw', name: 'Excalidraw MCP', description: 'Stream hand-drawn diagrams with interactive editing' },
      { id: 'figma-mcp-go', name: 'Figma MCP Go', description: 'Read/write access to Figma designs via plugin bridge' },
      { id: 'github-mcp', name: 'GitHub MCP', description: 'Browse repos, manage issues/PRs, monitor Actions' },
      { id: 'laravel-boost', name: 'Laravel Boost MCP', description: 'Laravel application context and ecosystem docs' },
      { id: 'notion-mcp', name: 'Notion MCP', description: 'Search, read, and write Notion content' },
      { id: 'playwright-mcp', name: 'Playwright MCP', description: 'Cross-browser automation with accessibility snapshots' },
      { id: 'supabase-mcp', name: 'Supabase MCP', description: 'Manage Supabase projects, SQL, Edge Functions, Auth, Storage, and Realtime' },
    ],
  },

  plugins: {
    title: 'Plugins',
    description: 'OpenCode plugins that extend the core agent',
    sourceDir: 'framework/plugins',
    items: [
      { id: 'opencode-goal-plugin', name: 'OpenCode Goal Plugin', description: 'Goal-driven long-running tasks with persistence' },
      { id: 'ponytail', name: 'Ponytail', description: 'Lazy senior dev mode — YAGNI-first, reuse-first ladder that reduces code bloat and cost' },
    ],
  },

  styles: {
    title: 'Styles',
    description: 'Design system references from Refero Styles',
    sourceDir: 'framework/styles',
    items: [
      { id: 'factory', name: 'Factory', description: 'Terminal war room design system' },
      { id: 'huly', name: 'Huly', description: 'Midnight observatory design system' },
      { id: 'linear', name: 'Linear', description: 'Midnight precision instrument design system' },
      { id: 'notion', name: 'Notion', description: 'Warm paper notebook design system' },
      { id: 'raycast', name: 'Raycast', description: 'Midnight command center design system' },
    ],
  },

  modes: {
    title: 'Modes',
    description: 'Behavior, tool, and prompt presets for different use cases',
    sourceDir: 'framework/modes',
    items: [
      { id: 'audit', name: 'Audit', description: 'Read-only high-scrutiny review mode for evaluating artifacts' },
    ],
  },

  memory: {
    title: 'Memory',
    description: 'Persistent agent memory files for cross-session context',
    sourceDir: 'framework/memory',
    items: [
      { id: 'codebase-insights', name: 'Codebase Insights', description: 'Non-obvious facts, gotchas, past decisions, and architecture quirks' },
      { id: 'user-preferences', name: 'User Preferences', description: 'Coding style, naming conventions, and architectural preferences' },
    ],
  },

  standards: {
    title: 'Standards',
    description: 'Canonical engineering standards',
    sourceDir: 'framework/references/standards',
    items: [
      { id: 'api', name: 'API Design', description: 'REST API design standards' },
      { id: 'architecture', name: 'Architecture', description: 'System architecture standards' },
      { id: 'database', name: 'Database', description: 'Database design standards' },
      { id: 'debugging', name: 'Debugging', description: 'Debugging methodology' },
      { id: 'documentation', name: 'Documentation', description: 'Documentation standards' },
      { id: 'logging', name: 'Logging', description: 'Logging standards' },
      { id: 'naming', name: 'Naming', description: 'Naming conventions' },
      { id: 'observability', name: 'Observability', description: 'Observability standards' },
      { id: 'performance', name: 'Performance', description: 'Performance standards' },
      { id: 'pull-requests', name: 'Pull Requests', description: 'Pull request standards' },
      { id: 'security', name: 'Security', description: 'Security standards' },
      { id: 'testing', name: 'Testing', description: 'Testing standards' },
    ],
  },

  templates: {
    title: 'Templates',
    description: 'Fillable workflow documents',
    sourceDir: 'framework/references/templates',
    items: [
      { id: 'adr', name: 'ADR', description: 'Architecture Decision Record' },
      { id: 'api-spec', name: 'API Spec', description: 'API specification document' },
      { id: 'design-document', name: 'Design Document', description: 'Design document template' },
      { id: 'incident-report', name: 'Incident Report', description: 'Incident report template' },
      { id: 'postmortem', name: 'Postmortem', description: 'Postmortem template' },
      { id: 'pull-request', name: 'Pull Request', description: 'Pull request template' },
      { id: 'runbook', name: 'Runbook', description: 'Runbook template' },
      { id: 'task', name: 'Task', description: 'Task template' },
    ],
  },
};
