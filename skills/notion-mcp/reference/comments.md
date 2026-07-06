# Comments & Discussions

## Overview

Notion supports page-level comments, content-targeted comments on specific blocks, and discussion threads with replies. Use `fetch` with `include_discussions: true` first to see where discussions are anchored, then `get-comments` for full threads.

## Create Comment

### Page-level comment

```
create-comment
  page_id: "abc123..."
  markdown: "Comment with **important** context and a [link](https://example.com)."
```

### Comment on specific content

Target content by providing a unique start/end snippet:

```
create-comment
  page_id: "abc123..."
  markdown: "This section needs updating."
  selection_with_ellipsis: "# Meeting No...es heading"
```

The snippet format: first ~10 characters, `...`, last ~10 characters. Must uniquely identify the content.

### Reply to discussion thread

```
create-comment
  page_id: "abc123..."
  discussion_id: "discussion://pageId/blockId/discussionId"
  markdown: "Fixed this in the latest update."
```

Get `discussion_id` from `fetch` (with `include_discussions`) or `get-comments` output.

### Using rich_text instead of markdown

For features that markdown cannot express (mentions, custom emoji, colors):

```
create-comment
  page_id: "abc123..."
  rich_text:
    - text:
        content: "Assigned to "
    - mention:
        type: "user"
        user:
          id: "user-uuid"
    - text:
        content: " for review"
```

### Comment formatting

- **Markdown**: inline formatting only (bold, italic, strikethrough, underline, code, links)
- **Inline math**: `$Equation$`
- **Mention tags**: `<mention-date start="2024-12-25"/>`, `<mention-page id="..."/>`, `<mention-user id="..."/>`, `<mention-database id="..."/>`
- ❌ No block-level markdown (headings, lists, tables, blockquotes) — these render as plain text
- ❌ No UI shortcuts like `@today`, `@name`, `[[page]]`

## Read Comments

```
get-comments
  page_id: "abc123..."
```

Returns all discussions on the page with full thread content.

### Include child block comments

```
get-comments
  page_id: "abc123..."
  include_all_blocks: true
```

### Include resolved discussions

```
get-comments
  page_id: "abc123..."
  include_resolved: true
```

### Get specific discussion by ID

```
get-comments
  page_id: "abc123..."
  discussion_id: "discussion://pageId/blockId/discussionId"
```

## Workflow

1. `fetch` with `include_discussions: true` — see discussion anchors and `<page-discussions>` summary
2. `get-comments` with `discussion_id` — read full thread
3. `create-comment` with `discussion_id` — reply
4. `create-comment` with `selection_with_ellipsis` — start a new thread on specific content
5. `create-comment` with just `page_id` — add a general page-level comment

## Limitations

- **No edit/update** — comments cannot be modified after creation
- **No delete** — comments cannot be removed via this server
- **No resolution** — cannot mark discussions as resolved via this server
