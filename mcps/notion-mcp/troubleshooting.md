# Notion MCP Troubleshooting

## Connection fails

**Problem**

The AI client reports that `notion` cannot connect.

**Cause**

The client does not support remote HTTP MCP servers, or the URL is misconfigured.

**Solution**

- Verify the URL is `https://mcp.notion.com/mcp` (Streamable HTTP) or `https://mcp.notion.com/sse` (SSE).
- If your client only supports local stdio servers, use the `mcp-remote` bridge: `npx -y mcp-remote https://mcp.notion.com/mcp`.
- Check the client's documentation for how to add a remote MCP server.

## Authentication fails

**Problem**

The connection succeeds but tools return authentication errors.

**Cause**

The OAuth flow was not completed or the token has expired.

**Solution**

- Make sure you complete the OAuth flow when prompted by the client.
- Try disconnecting and reconnecting. Look for a "Clear authentication" or "Disconnect" option in the client's MCP settings.
- Re-add the MCP server to trigger a fresh OAuth flow.

## Permission errors

**Problem**

Tools return 403 or "not found" errors.

**Cause**

The authenticated user does not have access to the requested page, database, or workspace.

**Solution**

- Verify you have the correct permissions in the Notion workspace.
- Check that the page or database is shared with your user or team.
- Use `notion-get-teams` to confirm which teams you can access.

## Tool requires Notion AI

**Problem**

`notion-search`, `notion-query-data-sources`, `notion-query-database-view`, or `notion-query-meeting-notes` return an upgrade prompt.

**Cause**

These tools require a Business plan or higher with Notion AI.

**Solution**

- Upgrade your workspace plan to Business or Enterprise with Notion AI enabled.
- Use `notion-fetch` and standard page reading as an alternative.

## Rate limited

**Problem**

Tools return 429 Too Many Requests errors.

**Cause**

API rate limits exceeded: 180 requests/min (general), 30 requests/min (search).

**Solution**

- Prompt the agent to reduce the number of parallel tool calls.
- Space out requests — the time between sequential agent steps often keeps usage under the limit.
- Wait before retrying.

## Tool names differ in OpenAI clients

**Problem**

`notion-fetch` or `notion-search` tools are missing in ChatGPT.

**Cause**

OpenAI clients strip the `notion-` prefix — tools appear as `fetch` and `search`.

**Solution**

- Use `fetch` and `search` as the tool names in prompts for ChatGPT.
- Other tools retain the `notion-` prefix.