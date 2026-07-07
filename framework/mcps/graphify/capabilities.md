# Graphify MCP Capabilities

## What It Can Do

### MCP Tools

| Tool | Description |
| --- | --- |
| `query_graph` | Query the graph with a natural language question |
| `get_node` | Get details of a specific node by name |
| `get_neighbors` | Get neighbors of a specific node |
| `shortest_path` | Find the shortest path between two concepts |
| `list_prs` | List PRs with CI state, review status, and worktree mapping |
| `get_pr_impact` | Deep dive on a specific PR with graph impact analysis |
| `triage_prs` | AI-ranked PR review queue |

### Knowledge Graph Capabilities

| Feature | Description |
| --- | --- |
| God nodes | Most-connected concepts — everything flows through them |
| Communities | Graph split into subsystems (Leiden) with LLM-free labels |
| Cross-file links | `calls` / `imports` / `inherits` / `mixes_in` across 40+ languages |
| Rationale + doc refs | `# NOTE:` / `# WHY:` comments and ADR/RFC citations as first-class nodes |
| Confidence tags | Every edge is `EXTRACTED` (explicit in source) or `INFERRED` (derived by resolution) |
| Beyond code | Docs, PDFs, images, and video/audio in the same graph |
| Query, path, explain | Ask a question, trace paths, or explain one concept against `graph.json` |

### Supported File Types

| Type | Extensions |
| --- | --- |
| Code (36 tree-sitter grammars) | `.py .ts .js .go .rs .java .c .cpp .rb .cs .kt .php .swift .lua .zig .sql .sh .bash` and many more |
| Docs | `.md .html .txt .rst .yaml .yml` |
| PDFs | `.pdf` |
| Images | `.png .jpg .webp .gif` |
| Video / Audio | `.mp4 .mov .mp3 .wav` and more |

## HTTP Transport

The MCP server supports both stdio (default) and HTTP transport for shared team access:

| Flag | Default | Purpose |
| --- | --- | --- |
| `--transport {stdio,http}` | `stdio` | Transport mode |
| `--host` | `127.0.0.1` | HTTP bind host |
| `--port` | `8080` | HTTP bind port |
| `--api-key` | env `GRAPHIFY_API_KEY` | Require auth header |
| `--path` | `/mcp` | HTTP mount path |
| `--stateless` | off | No per-session state (load-balanced / CI) |

## What It Cannot Do

- It cannot build a graph without running `graphify extract` first.
- It cannot access code outside the extracted project directory.
- Code extraction is fully local, but doc/image semantic extraction uses a model API.
- It does not support live file watching or real-time graph updates (use `--update` to rebuild).
- The MCP server serves a static graph — it does not extract new data on the fly.

## Best Practices

- Build the graph first with `graphify extract .` before using the MCP server.
- Run `graphify extract . --update` to refresh the graph when files change.
- Use `graphify query "<question>"` instead of grepping files for faster answers.
- Commit `graphify-out/` to the repo so the team shares one graph without rebuilding.
- Install `graphify hook install` to auto-rebuild on every git commit (AST only, no API cost).
- For team deployments, use `--transport http` with `--api-key` for shared server access.

## Common Workflows

### Understand project architecture

1. Build the graph: `graphify extract .`.
2. Start the MCP server: `python -m graphify.serve graphify-out/graph.json`.
3. Use `query_graph` to ask: "What are the most important modules and how do they connect?"
4. Use `get_node` on a specific module to see its connections.
5. Use `shortest_path` to trace the flow between two components.

### Onboard to a new feature area

1. Query the graph for the feature's entry point: `query_graph "Show me the auth flow"`.
2. Get node details for key concepts: `get_node "AuthMiddleware"`.
3. Trace connections: `shortest_path "AuthMiddleware" "DatabasePool"`.
4. Review PRs that touched relevant areas: `get_pr_impact 42`.

### PR review with graph context

1. List open PRs: `list_prs`.
2. Get graph impact for a specific PR: `get_pr_impact 42`.
3. Triage the review queue: `triage_prs`.

### Team knowledge sharing

1. Run `graphify extract .` and commit `graphify-out/`.
2. Start a shared HTTP MCP server on a team-accessible host.
3. Everyone points their client at the same graph URL.