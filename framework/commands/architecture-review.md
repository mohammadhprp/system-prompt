---
description: Review and improve system architecture
agent: plan
---

Architecture Review $ARGUMENTS

Review and improve system architecture.

## Process

1. **Review conversation and architecture** - Read conversation history, project structure, key source files. Identify the system boundaries, components, data flows, and external dependencies. Load [`skills/backend-best-practices/references/architecture-review.md`](../skills/backend-best-practices/references/architecture-review.md) and [`references/standards/architecture.md`](../references/standards/architecture.md).

2. **Analyze coupling and cohesion** - Check if components can change independently. Evaluate dependency direction (domain depends on nothing, infrastructure depends on domain). Identify circular dependencies, boundary leaks, and ownership gaps.

3. **Check reliability and scalability** - Assess timeout, retry, fallback, and partial-failure handling. Identify single points of failure. Perform bottleneck analysis on load distribution and data partitioning.

4. **Compare simpler alternatives** - Evaluate if a simpler architecture satisfies the same requirements. Reject complexity without evidence that simpler approaches fail.

5. **Present findings** - Summarize: component map, coupling/cohesion analysis, reliability/scalability assessment, concrete risks with mitigations, simpler alternatives considered, and recommended follow-ups.
