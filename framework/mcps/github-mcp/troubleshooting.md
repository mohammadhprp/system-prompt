# GitHub MCP Troubleshooting

## Server won't start

**Problem**

The AI client reports that `github` failed to start.

**Cause**

The client does not support remote HTTP MCP servers, or the URL is misconfigured.

**Solution**

- Verify the `type` is `http` and `url` is `https://api.githubcopilot.com/mcp/`.
- Check that your client supports remote MCP servers (VS Code 1.101+, Claude Desktop, Cursor, Windsurf, OpenCode).
- If remote HTTP is not supported, use the local Docker version instead (see upstream docs).

## Authentication errors

**Problem**

The server starts but returns 401 Unauthorized on tool calls.

**Cause**

The `GITHUB_PERSONAL_ACCESS_TOKEN` is missing, expired, or invalid.

**Solution**

- Verify `GITHUB_PERSONAL_ACCESS_TOKEN` is set: check your `.env` file or environment variables.
- Confirm the token is a valid GitHub Personal Access Token with the required scopes.
- Generate a new token in GitHub: **Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
- Ensure the token is not expired.

## Rate limiting

**Problem**

Tools return 429 Too Many Requests errors.

**Cause**

GitHub API rate limits have been exceeded.

**Solution**

- Reduce the frequency of tool calls.
- Wait for the rate limit window (typically 1 hour) to reset before retrying.
- For higher limits, authenticate with a PAT that has the necessary scopes.

## Token in version control

**Problem**

Risk of leaking the GitHub token to version control.

**Solution**

- Never hardcode the token in `opencode.json` or any config file.
- Use `{env:GITHUB_PERSONAL_ACCESS_TOKEN}` in config files and store the actual value in `.env`.
- Add `.env` to `.gitignore`.
- Restrict `.env` file permissions: `chmod 600 .opencode/.env`.

## Permission errors

**Problem**

Tools return 403 Forbidden or insufficient permissions.

**Cause**

The authenticated token does not have the required scopes or repository access.

**Solution**

- Verify the token has `repo` scope for private repositories.
- For organization access, ensure `read:org` scope is included.
- For fine-grained tokens, ensure the token has access to the target repository.
