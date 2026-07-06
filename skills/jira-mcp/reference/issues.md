# Issue Management

## Create

```
create_issue
  projectKey: "PROJ"
  summary: "Login page returns 500"
  issueType: "Bug"
  description: "Steps to reproduce..."
  priority: "High"
  labels: ["bug", "critical"]
  assignee: "john.doe"
  components: ["frontend"]
  customfield_10211: "Sprint 1"    # optional custom fields
```

Always verify project and issue types first:

1. `get_projects` → find project key
2. `get_issue_types` with `projectKey: "PROJ"` → find valid types
3. `create_issue` with valid `projectKey` and `issueType`

## Read

```
get_issue
  issueKey: "PROJ-123"
```

Returns full issue details: summary, description, status, priority, assignee, reporter, labels, components, custom fields, timestamps.

## Search (JQL)

```
search_issues
  jql: "project = PROJ AND status = Open"
  maxResults: 50
```

### Common JQL Patterns

| Purpose | JQL |
| ------- | --- |
| My open issues | `assignee = currentUser() AND status != Done` |
| High priority recent | `priority = High AND created >= -7d` |
| By status | `status IN (Open, "In Progress", "Reopened")` |
| By label | `labels = "bug" OR labels = "critical"` |
| By reporter | `reporter = john.doe AND status NOT IN (Closed, Done)` |
| Unassigned | `assignee IS NULL AND status NOT IN (Closed, Done, Resolved)` |
| Sprints (custom field) | `cf[10211] = "Sprint 1"` |
| Date range | `created >= "2025-01-01" AND created <= "2025-06-01"` |
| Order by | `project = PROJ ORDER BY priority DESC, created ASC` |
| Text search | `text ~ "error message"` |
| Across all projects | `status = Open AND assignee = currentUser()` |

`search_issues` defaults to showing issues across **all projects** the user has access to. Scope to a specific project with `project = KEY`.

## Update

```
update_issue
  issueKey: "PROJ-123"
  summary: "Updated title"
  description: "New description"
  priority: "Low"
  assignee: "jane.doe"
  labels: ["bug", "resolved"]
  status: "In Progress"           # transition to new status
  customfield_10211: "Sprint 2"
```

### Status Transitions

- Issue workflow statuses depend on the project's configuration
- Common transitions: `Open → "In Progress" → "In Review" → "Done" | "Closed"`
- Use `get_issue` to check current status and `update_issue` with `status` to transition
- Invalid transitions return an error — check the project's available workflow transitions in Jira

## Assign

```
assign_issue
  issueKey: "PROJ-123"
  assignee: "john.doe"
```

`assign_issue` is a dedicated tool. You can also assign via `update_issue` with `assignee`.

## Delete

```
delete_issue
  issueKey: "PROJ-123"
```

**Warning**: `delete_issue` is destructive — permanently deletes the issue. Cannot be undone.