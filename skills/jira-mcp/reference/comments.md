# Comments

## Add Comment

```
add_comment
  issueKey: "PROJ-123"
  comment: "Fixed in latest deployment (v2.4.1)"
```

Adds a text comment to a Jira issue. No support for rich text or attachments via this server.

## Read Comments

```
get_comments
  issueKey: "PROJ-123"
```

Returns all comments on an issue, ordered by creation date (ascending). Each comment includes `body`, `author`, `created`, and `updated` timestamps.

## Limitations

- **No edit/update** — the current Jira MCP server does not provide an edit-comment tool
- **No delete** — comments cannot be removed via this server
- **No threading/replies** — comments are flat (Jira Cloud's threading is not exposed via this API)
- **No rich text** — plain text only; HTML/markdown in bodies may be rendered by Jira's API