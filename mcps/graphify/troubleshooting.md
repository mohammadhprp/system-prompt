# Graphify MCP Troubleshooting

## Server won't start

**Problem**

The MCP server fails to start.

**Cause**

Graph is not built, or the `[mcp]` extra is not installed.

**Solution**

- Run `graphify extract .` first to build `graphify-out/graph.json`.
- Ensure the MCP extra was installed: `uv tool install graphifyy[mcp]` (not plain `graphifyy`).
- Verify Python 3.10+ is available: `python --version`.

## `python -m graphify.serve` not found

**Problem**

The module cannot be found when running the server.

**Cause**

The `[mcp]` extra was omitted during install.

**Solution**

- Reinstall with the MCP extra: `uv tool install graphifyy[mcp]`.
- Verify the module exists: `python -m graphify.serve --help`.

## `graphify: command not found`

**Problem**

The `graphify` CLI command is not available after installation.

**Cause**

The tool's bin directory is not on `PATH`.

**Solution**

- Run `uv tool update-shell` and open a new terminal.
- Or use `python -m graphify` as a fallback.
- Verify installation: `uv tool list | grep graphifyy`.

## Graph has stale data

**Problem**

Query results do not reflect recent code changes.

**Cause**

The graph was built before the latest changes.

**Solution**

- Rebuild with `graphify extract . --update` to re-extract only changed files.
- Or use `graphify extract . --force` for a full rebuild.
- Install git hooks: `graphify hook install` to auto-rebuild on every commit.

## Permission errors with HTTP transport

**Problem**

The HTTP server fails to bind to a port.

**Cause**

Port is in use, or the host requires root for privileged ports.

**Solution**

- Use a different port: `--port 8081`.
- Avoid privileged ports (below 1024) unless running as root.
- Check if another process is using the port: `lsof -i :8080`.

## Graph has duplicate nodes

**Problem**

The same entity appears twice in the graph.

**Cause**

Ghost duplicates from AST and semantic extraction.

**Solution**

- Run a full re-extract: `graphify extract . --force`.
- This triggers automatic merge of duplicate nodes (available in v0.8.33+).

## MCP server reports old graph after rebuild

**Problem**

The running server serves a stale graph even after rebuilding.

**Cause**

The server cached the graph file at startup.

**Solution**

- Restart the MCP server after rebuilding the graph.
- Use `--stateless` mode for HTTP transport to avoid caching issues.