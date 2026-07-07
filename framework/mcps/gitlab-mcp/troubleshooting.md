# GitLab MCP Troubleshooting

## Server won't start

**Problem**

The AI client reports that `gitlab` failed to start.

**Cause**

The client cannot run `zereight-mcp-gitlab`, Node.js is not installed, or the npm package is not installed globally.

**Solution**

- Run `zereight-mcp-gitlab` manually to verify the server starts.
- Check Node.js is installed: `node --version` (requires >= 18).
- Run `npm install -g @zereight/mcp-gitlab` to install globally.
- If no global install, use `command: "npx"` with `args: ["-y", "@zereight/mcp-gitlab"]` instead.

## Authentication errors

**Problem**

The server starts but returns authentication errors on tool calls.

**Cause**

The Personal Access Token is missing, expired, or has insufficient scopes.

**Solution**

- Verify the token is set in `GITLAB_PERSONAL_ACCESS_TOKEN` or passed via `--token`.
- Confirm the token has the required scopes (`api` for full access, `read_api` for read-only).
- Generate a new token in GitLab: **Settings → Access Tokens → Personal Access Tokens**.
- Confirm the API URL is correct: `https://gitlab.com/api/v4` (SaaS) or `https://your-instance/api/v4` (self-hosted).

## Configuration errors

**Problem**

The MCP server is not listed, or the client ignores the config file.

**Cause**

The config file is in the wrong location, the JSON is invalid, or the client expects a different configuration wrapper.

**Solution**

- Validate the JSON with `python -m json.tool <file>` or another JSON parser.
- Confirm the client-specific config location in the client's documentation.
- Keep the server name as `gitlab`.
- Ensure environment variables are set correctly in the config.

## Permission errors

**Problem**

Tools return 403 Forbidden or insufficient permissions.

**Cause**

The authenticated user does not have the required GitLab project or group permissions.

**Solution**

- Verify the user has at least Developer role in the target project or group.
- Check if the project is in a subgroup that inherits different permissions.
- Use `list_projects` to confirm which projects the token can access.

## Rate limiting

**Problem**

Tools return 429 Too Many Requests errors.

**Cause**

GitLab API rate limits have been exceeded.

**Solution**

- Reduce the frequency of tool calls.
- For self-hosted GitLab, check `gitlab.rb` rate limit settings.
- Wait for the rate limit window to reset before retrying.

## Version mismatch

**Problem**

Some tools are missing or behave differently than documented.

**Cause**

The installed npm package version is outdated.

**Solution**

- Update to the latest version: `npm update -g @zereight/mcp-gitlab`.
- Check the installed version: `npm list -g @zereight/mcp-gitlab`.
- Refer to the [CHANGELOG](https://github.com/zereight/gitlab-mcp/blob/main/CHANGELOG.md) for breaking changes.

## Read-only mode blocking writes

**Problem**

Write tools return errors when `GITLAB_PERMISSION_MODE=readonly`.

**Cause**

Read-only mode explicitly blocks all create, update, and delete operations.

**Solution**

- Set `GITLAB_PERMISSION_MODE=modify` to allow updates while blocking deletes.
- Set `GITLAB_PERMISSION_MODE=full` for unrestricted access.
- Use `GITLAB_TOOLS` allow-list to enable specific write tools in read-only mode.