# Page Management

## Read / Fetch

Retrieve page, database, or data source details. Always `fetch` first before modifying anything.

```
fetch
  id: "https://notion.so/workspace/My-Page-a1b2c3d4e5f67890"

fetch
  id: "a1b2c3-d4e5-..."    # bare UUID

fetch
  id: "collection://f336d0bc..."   # data source URL
```

Returns content in Notion-flavored Markdown. For the full spec, read `notion://docs/enhanced-markdown-spec` via your MCP resource reader.

Pass `include_discussions: true` to see discussion markers and `<page-discussions>` tags correlating with `get-comments`.

### Workflow

Always start with `fetch` to:
1. Get the correct page/database ID or data source URL
2. View existing content before updating
3. Discover property names and schema for database pages
4. Find template IDs in `<templates>` section

## Create

```
create-pages
  parent:
    page_id: "abc123..."          # or database_id, or data_source_id
  pages:
    - properties:
        title: "Page title"
      content: "# Section 1\n\nContent here"
      icon: "🚀"
      cover: "https://example.com/cover.jpg"
```

### Database pages

When creating pages in a database, use the schema from fetch:

```
create-pages
  parent:
    data_source_id: "f336d0bc-..."
  pages:
    - properties:
        Task Name: "New task"
        Status: "In Progress"
        Priority: 5
        date:Due Date:start: "2024-12-25"
        date:Due Date:is_datetime: 0
```

### Using templates

```
create-pages
  parent:
    data_source_id: "f336d0bc-..."
  pages:
    - template_id: "a5da15f6-..."
      properties:
        Task Name: "New urgent bug"
```

When using a template, do NOT provide `content` — the template supplies it.

### Property formats

| Type | Format | Example |
|------|--------|---------|
| Title | plain string | `"Task Name": "Fix login"` |
| Text / Rich text | plain string | `"Description": "Detailed notes"` |
| Number | number | `"Priority": 5` |
| Checkbox | `"__YES__"` / `"__NO__"` | `"Complete": "__YES__"` |
| Date | expanded keys | `"date:Due:start": "2024-12-25"` |
| Date with time | expanded keys + `is_datetime: 1` | `"date:Due:start": "2024-12-25T14:00:00"` |
| Place | expanded keys (name/address/lat/lng/google_place_id) | `"place:Office:name": "HQ"` |
| Select | string matching an option | `"Status": "Done"` |
| Multi-select | comma-separated | `"Tags": "eng,design"` |

Properties named `id` or `url` (case insensitive) must be prefixed with `userDefined:`:
- `"userDefined:URL": "https://..."`, `"userDefined:id": "custom-id"`

## Update

### Update properties

```
update-page
  page_id: "abc123..."
  command: update_properties
  properties:
    title: "New title"
    Status: "In Progress"
    date:Due:start: "2024-12-25"
    date:Due:is_datetime: 0
```

Set a property to `null` to clear its value.

### Update content (search-and-replace)

```
update-page
  page_id: "abc123..."
  command: update_content
  content_updates:
    - old_str: "# Old Section\nOld content"
      new_str: "# New Section\nUpdated content"
```

### Replace entire content

```
update-page
  page_id: "abc123..."
  command: replace_content
  new_str: "# Completely new page\n\nContent here"
```

⚠️ `replace_content` will fail if child pages/databases would be deleted. Include them in `new_str` using `<page url="...">` or `<database url="...">` tags from the fetch output. To intentionally delete children, confirm with the user first.

### Insert content

```
update-page
  page_id: "abc123..."
  command: insert_content
  content: "## Latest update\n\nStatus update"
  position:
    type: "start"     # or "end" (default)
```

### Apply template

```
update-page
  page_id: "abc123..."
  command: apply_template
  template_id: "a5da15f6-..."
```

### Set icon and cover

Can be set alongside any command:

```
update-page
  page_id: "abc123..."
  command: update_properties
  properties:
    title: "New title"
  icon: "🚀"
  cover: "https://example.com/cover.jpg"
```

Use `"none"` to remove icon or cover.

### Verify a page (Business/Enterprise or wiki pages)

```
update-page
  page_id: "abc123..."
  command: update_verification
  verification_status: "verified"    # or "unverified"
  verification_expiry_days: 90       # optional, omit for indefinite
```

## Duplicate

```
duplicate-page
  page_id: "abc123..."
```

Duplication completes asynchronously. The new page ID/URL is returned immediately, but content may take a moment to appear.

## Move

```
move-pages
  page_or_database_ids:
    - "abc123..."
    - "def456..."
  new_parent:
    page_id: "ghi789..."    # or workspace, or data_source_id
```

⚠️ **Irreversible** — permanently relocates pages. Cannot be undone programmatically.

## Search

```
search
  query: "quarterly report"
  query_type: "internal"            # or "user"
  page_size: 10
  filters:
    created_date_range:
      start_date: "2024-10-01"
    created_by_user_ids:
      - "user-uuid-here"
```

### Search within a data source

```
search
  query: "design review"
  data_source_url: "collection://f336d0bc-..."
```

### Search by page ID (search content under a page)

```
search
  query: "meeting notes"
  page_url: "abc123..."
```

### User search

```
search
  query: "john@example.com"
  query_type: "user"
```
