# Lavish Examples

## Example 1: Architecture Diagram

Visualize a proposed microservices migration for team review. Good agent behavior:

- Generate an HTML artifact with a clear SVG or Mermaid diagram showing the current monolith, proposed services, and data flow arrows.
- Use color coding: blue for existing components, green for new services, orange for shared infrastructure.
- Include a legend and numbered annotations explaining each architectural decision.
- Annotate key interfaces and data contracts at each boundary.
- Run `npx -y lavish-axi <html-file>` to let the team review and leave feedback on specific elements.

## Example 2: Code Diff Comparison

Present a side-by-side comparison of refactored code for review. Good agent behavior:

- Generate an HTML artifact with two panels showing before and after code with syntax highlighting.
- Highlight changed lines in yellow, added lines in green, removed lines in red.
- Add inline annotations explaining why each change was made.
- Include a summary section at the top listing the number of files changed, lines added, and lines removed.
- Run `npx -y lavish-axi <html-file>` so reviewers can annotate specific code sections.

## Example 3: Performance Benchmark Report

Display benchmark results comparing caching strategies. Good agent behavior:

- Generate an HTML artifact with a bar chart comparing response times across strategies (no cache, Redis, in-memory, database).
- Include a table with exact measurements: p50, p95, p99 latency, throughput, and memory usage.
- Add a recommendation section with the preferred strategy highlighted and a rationale.
- Include interactive tooltips showing sample size and confidence intervals.
- Run `npx -y lavish-axi <html-file>` so the team can annotate concerns or ask questions about specific benchmarks.