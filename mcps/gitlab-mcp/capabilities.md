# GitLab MCP Capabilities

## What It Can Do

117+ tools across projects, merge requests, issues, pipelines, wiki, milestones, labels, and more.

### Merge Requests

| Tool | Description |
| --- | --- |
| `list_merge_requests` | List merge requests with filtering |
| `get_merge_request` | Get merge request details |
| `create_merge_request` | Create a new merge request |
| `update_merge_request` | Update a merge request |
| `merge_merge_request` | Merge a merge request |
| `approve_merge_request` | Approve a merge request |
| `unapprove_merge_request` | Unapprove a merge request |
| `get_merge_request_approval_state` | Get approval details including approvers |
| `get_merge_request_diffs` | Get the changes/diffs of a merge request |
| `list_merge_request_diffs` | List diffs with pagination |
| `get_merge_request_conflicts` | Get merge request conflicts |
| `list_merge_request_changed_files` | List changed file paths (without diff) |
| `get_merge_request_file_diff` | Get diffs for specific files |
| `list_merge_request_versions` | List all versions of a merge request |
| `get_merge_request_version` | Get a specific version |
| `get_branch_diffs` | Get diffs between two branches or commits |
| `mr_discussions` | List discussion items for a merge request |
| `resolve_merge_request_thread` | Resolve a thread |
| `create_merge_request_thread` | Create a new thread |
| `create_merge_request_note` | Add a note to an existing thread |
| `create_merge_request_discussion_note` | Add a discussion note |
| `update_merge_request_note` | Modify a merge request note |
| `update_merge_request_discussion_note` | Update a discussion note |
| `delete_merge_request_note` | Delete a merge request note |
| `delete_merge_request_discussion_note` | Delete a discussion note |
| `get_merge_request_note` | Get a specific note |
| `get_merge_request_notes` | List notes for a merge request |
| `create_note` | Create a comment on an issue or MR |
| `get_draft_note` | Get a single draft note |
| `list_draft_notes` | List draft notes |
| `create_draft_note` | Create a draft note |
| `update_draft_note` | Update a draft note |
| `delete_draft_note` | Delete a draft note |
| `publish_draft_note` | Publish a single draft note |
| `bulk_publish_draft_notes` | Publish all draft notes |

### Issues

| Tool | Description |
| --- | --- |
| `list_issues` | List issues with filtering |
| `my_issues` | List issues assigned to the current user |
| `get_issue` | Get issue details |
| `create_issue` | Create a new issue |
| `update_issue` | Update an issue |
| `update_issue_description_patch` | Apply a patch to an issue description |
| `delete_issue` | Delete an issue |
| `create_issue_note` | Add a note to an issue thread |
| `update_issue_note` | Modify an issue thread note |
| `list_issue_discussions` | List discussions for an issue |
| `list_issue_links` | List issue links |
| `get_issue_link` | Get a specific issue link |
| `create_issue_link` | Link two issues |
| `delete_issue_link` | Delete an issue link |

### Projects & Repositories

| Tool | Description |
| --- | --- |
| `search_repositories` | Search for GitLab projects |
| `create_repository` | Create a new GitLab project |
| `get_project` | Get project details |
| `list_projects` | List accessible projects |
| `list_project_members` | List project members |
| `fork_repository` | Fork a project |
| `list_group_projects` | List projects in a group |
| `list_namespaces` | List available namespaces |
| `get_namespace` | Get namespace details |
| `verify_namespace` | Verify a namespace path exists |
| `create_group` | Create a new group or subgroup |
| `list_group_iterations` | List group iterations |

### Files & Commits

| Tool | Description |
| --- | --- |
| `get_file_contents` | Get file or directory contents |
| `create_or_update_file` | Create or update a single file |
| `push_files` | Push multiple files in a single commit |
| `create_branch` | Create a new branch |
| `get_repository_tree` | List repository files and directories |
| `list_commits` | List commits with filtering |
| `get_commit` | Get commit details |
| `get_commit_diff` | Get commit changes/diffs |

### CI/CD Pipelines

| Tool | Description |
| --- | --- |
| `list_pipelines` | List pipelines with filtering |
| `get_pipeline` | Get pipeline details |
| `create_pipeline` | Create a pipeline for a branch or tag |
| `retry_pipeline` | Retry a failed or canceled pipeline |
| `cancel_pipeline` | Cancel a running pipeline |
| `list_pipeline_jobs` | List all jobs in a pipeline |
| `list_pipeline_trigger_jobs` | List trigger jobs (bridges) |
| `get_pipeline_job` | Get job details |
| `get_pipeline_job_output` | Get job output/trace with pagination |
| `play_pipeline_job` | Run a manual pipeline job |
| `retry_pipeline_job` | Retry a failed job |
| `cancel_pipeline_job` | Cancel a running job |
| `validate_ci_lint` | Validate CI/CD YAML content |
| `validate_project_ci_lint` | Validate existing `.gitlab-ci.yml` |
| `list_job_artifacts` | List artifact files in a job |
| `download_job_artifacts` | Download artifact archive (zip) |
| `get_job_artifact_file` | Get content of a single artifact file |
| `list_deployments` | List deployments |
| `get_deployment` | Get deployment details |
| `list_environments` | List environments |
| `get_environment` | Get environment details |

### Wiki

| Tool | Description |
| --- | --- |
| `list_wiki_pages` | List project wiki pages |
| `get_wiki_page` | Get wiki page details |
| `create_wiki_page` | Create a new wiki page |
| `update_wiki_page` | Update a wiki page |
| `delete_wiki_page` | Delete a wiki page |
| `list_group_wiki_pages` | List group wiki pages |
| `get_group_wiki_page` | Get group wiki page details |
| `create_group_wiki_page` | Create a group wiki page |
| `update_group_wiki_page` | Update a group wiki page |
| `delete_group_wiki_page` | Delete a group wiki page |

### Milestones

| Tool | Description |
| --- | --- |
| `list_milestones` | List milestones with filtering |
| `get_milestone` | Get milestone details |
| `create_milestone` | Create a new milestone |
| `edit_milestone` | Edit an existing milestone |
| `delete_milestone` | Delete a milestone |
| `get_milestone_issue` | Get issues for a milestone |
| `get_milestone_merge_requests` | Get MRs for a milestone |
| `get_milestone_burndown_events` | Get burndown events |
| `promote_milestone` | Promote a milestone |

### Labels & To-Dos

| Tool | Description |
| --- | --- |
| `list_labels` | List project labels |
| `get_label` | Get a single label |
| `create_label` | Create a new label |
| `update_label` | Update an existing label |
| `delete_label` | Delete a label |
| `list_todos` | List to-do items |
| `mark_todo_done` | Mark a to-do item as done |
| `mark_all_todos_done` | Mark all to-do items as done |

### Releases (not listed in README tools, but mentioned in features)

The server may expose additional release and tag management tools depending on the installed version. Refer to the official [documentation](https://zereight.github.io/gitlab-mcp/) for the full tool list.

## What It Cannot Do

- It cannot operate without a GitLab account and API token or OAuth credentials.
- It cannot access GitLab features outside the authenticated user's permissions.
- It does not support SSE transport when using `REMOTE_AUTHORIZATION` mode (Streamable HTTP required).
- It cannot safely infer production intent; agents still need explicit instructions before destructive operations.
- Read-only mode (`GITLAB_PERMISSION_MODE=readonly`) blocks all write, update, and delete tools but does not prevent the agent from reading sensitive project data that the token has access to.

## Best Practices

- Use a Personal Access Token with the minimum required scopes (`read_api` for read-only workflows, `api` for write workflows).
- Use `GITLAB_PERMISSION_MODE=readonly` or `modify` to restrict agent capabilities.
- Use `GITLAB_TOOLSETS` to enable only the tool groups needed (e.g., `wiki,milestones,pipelines`).
- Use `GITLAB_TOOLS` allow-list to enable individual tools, and `GITLAB_DENIED_TOOLS_REGEX` to block by pattern.
- Prefer OAuth2 over PAT for better security in desktop workflows.
- For multi-user deployments, use `REMOTE_AUTHORIZATION` so each caller provides their own token.
- Use `list_merge_request_changed_files` first, then `get_merge_request_file_diff` on selected files, to reduce token usage during code review.
- Validate CI/CD changes with `validate_ci_lint` before committing.

## Common Workflows

### Review a merge request

1. Call `list_merge_request_changed_files` to see which files changed.
2. Call `get_merge_request_file_diff` on 3-5 files at a time to review diffs.
3. Call `get_merge_request_approval_state` to check approvers.
4. Use `create_merge_request_thread` or `create_note` to leave feedback.
5. Call `approve_merge_request` and `merge_merge_request` when ready.

### Investigate a pipeline failure

1. Call `list_pipelines` to find the failed pipeline.
2. Call `list_pipeline_jobs` to see which jobs failed.
3. Call `get_pipeline_job_output` to read the failing job's logs.
4. Use the logs to diagnose the issue and propose a fix.

### Manage issues

1. Call `list_issues` or `my_issues` to see open issues.
2. Call `get_issue` to read details of a specific issue.
3. Call `create_issue_note` to comment or request clarification.
4. Call `update_issue` to change status, assignee, or labels.

### Browse and edit repository files

1. Call `get_repository_tree` to list files in a directory.
2. Call `get_file_contents` to read specific files.
3. Call `create_or_update_file` or `push_files` to make changes.
4. Call `create_branch` and `create_merge_request` to propose changes.