# Graphify MCP

## Overview

Graphify maps your entire project (code, docs, PDFs, images, videos) into a knowledge graph you can query instead of grepping through files. Its MCP server gives AI agents structured access to the graph: query, shortest path, node details, neighbors, and PR impact analysis.

Official source:

- [GitHub: Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)
- [Documentation](https://github.com/Graphify-Labs/graphify#readme)

## Features

- Build a knowledge graph from code (40+ languages via tree-sitter AST), docs, PDFs, images, and video.
- Query the graph with natural language instead of grepping files.
- Trace shortest paths between any two concepts (e.g., `graphify path "UserService" "DatabasePool"`).
- God nodes, communities, cross-file links, and rationale extraction from code comments.
- Fully local AST extraction — zero LLM credits for code; docs/images use your model API.
- MCP tools: `query_graph`, `get_node`, `get_neighbors`, `shortest_path`, `list_prs`, `get_pr_impact`, `triage_prs`.

## When to Use

Use Graphify when an AI coding agent needs to understand a large or unfamiliar codebase.

Good fits:

- Understanding project architecture and module relationships.
- Tracing how concepts connect across files and directories.
- Onboarding to a new codebase.
- Code review with PR impact analysis.
- Documentation and knowledge management.

Avoid using it for small codebases where grepping is faster than building a graph.

## Requirements

- Python 3.10+ and `uv` (recommended) or `pipx`.
- Graph built via `graphify extract .` (or `/graphify .` in an AI assistant).
- For the MCP server: `uv tool install graphifyy[mcp]`.

## Related Skills

Relevant skills in this repository:

- [`backend-engineer`](../../skills/backend-engineer/SKILL.md): understanding architecture during feature work.
- [`code-review`](../../skills/code-review/SKILL.md): PR impact analysis with graph context.
- [`debugging`](../../skills/debugging/SKILL.md): tracing code paths across modules.