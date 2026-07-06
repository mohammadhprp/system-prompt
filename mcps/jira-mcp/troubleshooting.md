# Jira MCP Troubleshooting

## Server won't start

**Problem**

The AI client reports that `jira` failed to start.

**Cause**

The client cannot run `npx`, Node.js is not installed, or the npm package is unavailable.

**Solution**

- Run `npx -y mcp-jira-server` manually to verify the server starts.
- Check Node.js is installed: `node --version` (requires >= 18).
- Check network access if the package has not been cached locally.
- Ensure the config file contains the correct command and args.

## Authentication errors

**Problem**

The server starts but returns authentication errors on tool calls.

**Cause**

The Personal Access Token is missing, expired, or has insufficient permissions.

**Solution**

- Verify `JIRA_PAT` is set correctly in the environment.
- Confirm the token has not expired.
- Generate a new token in Jira if needed.
- Verify `JIRA_BASE_URL` is correct and has no trailing slash.

## Connection refused

**Problem**

Tools return connection errors.

**Cause**

The Jira instance is not accessible from the current machine.

**Solution**

- Verify the Jira URL is reachable: `curl https://jira.domain.com`.
- Check network connectivity and firewall rules.
- Confirm the URL format: `https://jira.domain.com` (no trailing slash).

## Configuration errors

**Problem**

The MCP server is not listed, or the client ignores the config file.

**Cause**

The config file is in the wrong location, the JSON is invalid, or the client expects a different configuration wrapper.

**Solution**

- Validate the JSON with `python -m json.tool <file>` or another JSON parser.
- Confirm the client-specific config location in the client's documentation.
- Keep the server name as `jira`.
- Ensure environment variables are set correctly in the config.

## API requests redirect to SSO login

**Problem**

API requests return HTML login pages instead of JSON responses despite a valid PAT.

**Cause**

The Jira instance is behind a reverse proxy (oauth2-proxy, nginx, etc.) that filters requests by User-Agent and redirects API clients to SSO login.

**Solution**

- Set the `JIRA_USER_AGENT` environment variable to a whitelisted User-Agent string.
- Contact your system administrator to get the allowed User-Agent value.

## "Issue type not found" errors

**Problem**

Creating an issue fails with "issue type not found".

**Cause**

The issue type name does not exist in the target project.

**Solution**

- Call `jira_get_issue_types` with the project key to list valid types.
- Use an exact match from the returned list.

## "Cannot find module" errors

**Problem**

The server fails with module resolution errors when using a source build.

**Cause**

Dependencies are not installed or the project is not built.

**Solution**

- Run `npm install` and `npm run build` in the project directory.
- Use the `npx` command instead of a local build.