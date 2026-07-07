# Project Management

## List Projects

```
get_projects
```

Returns all Jira projects the authenticated user can access. Each entry includes `key`, `name`, `projectTypeKey`, `lead`, and `avatarUrls`.

Use this to discover available `projectKey` values for issue operations.

## Project Details

```
get_project
  projectKey: "PROJ"
```

Returns detailed information: name, key, description, lead, components, versions (releases), project type, and category.

Verify a project exists and inspect its components/versions before creating issues:

1. `get_project` → check components, versions
2. `get_issue_types` → check valid issue types
3. `create_issue` with verified data

## Issue Types

```
get_issue_types
  projectKey: "PROJ"
```

Returns available issue types for a project. Each type includes `name`, `id`, `description`, `iconUrl`, and `subtask` flag.

Common types across most projects: `Bug`, `Task`, `Story`, `Epic`, `Sub-task`, `Improvement`, `New Feature`.

Always call this **before** creating an issue to ensure the `issueType` value is valid for the target project.