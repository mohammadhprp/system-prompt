# GitLab MCP Examples

## Example 1: Review Merge Request Diffs

Review a merge request with multiple file changes. Good agent behavior:

- Use `list_merge_request_changed_files` to get the list of changed files (no diff).
- Use `get_merge_request_file_diff` with 3-5 files at a time to review diffs in batches.
- Use `get_merge_request_approval_state` to check who has approved.
- Use `create_merge_request_thread` to leave inline feedback on specific lines.
- Use `approve_merge_request` and `merge_merge_request` when the review passes.

## Example 2: Investigate Pipeline Failure

A CI pipeline failed on the main branch. Good agent behavior:

- Use `list_pipelines` to find the latest failed pipeline for the target branch.
- Use `list_pipeline_jobs` to identify which job failed.
- Use `get_pipeline_job_output` with pagination to read the failure logs.
- Use `get_pipeline_job` to inspect the job's environment and timing.
- Summarize the root cause and propose a fix based on the log output.

## Example 3: Create and Manage an Issue

Track a bug report discovered during development. Good agent behavior:

- Use `create_issue` with project key, summary, description, and labels.
- Use `create_issue_note` to add reproduction steps as a comment.
- Use `update_issue` to set assignee and priority.
- Use `create_branch` to start work from the issue branch naming convention.
- Use `create_merge_request` when the fix is ready, linking the MR to the issue.