---
description: Create a GitHub PR or GitLab MR for the current branch
agent: build
---

PR $ARGUMENTS

Create a pull request (GitHub) or merge request (GitLab) for the current branch.

## Process

1. **Review conversation and check state** - Read conversation history. Run `git remote -v`, `git branch --show-current`, `git status`, `git log --oneline -n 5`. Identify what changes have been committed and what problem they solve. Load [`skills/pull-request/SKILL.md`](../skills/pull-request/SKILL.md) and [`references/standards/pull-requests.md`](../references/standards/pull-requests.md).

2. **Detect platform** - Parse `git remote -v` for the first `origin` fetch URL:
   - `github.com` → GitHub mode (use `gh` CLI)
   - `gitlab` (gitlab.com or self-hosted) → GitLab mode (use GitLab MCP `create_merge_request`; fall back to `glab` CLI if MCP is unavailable)
   - Otherwise → ask user which platform

3. **Detect target branch** - Run `git remote show origin 2>/dev/null | grep "HEAD branch" | awk '{print $NF}'`. Default to `main` if detection fails.

4. **Push commits** - Check if the current branch is fully pushed. Run `git push -u origin HEAD` if unpushed commits exist.

5. **Draft the PR/MR** - Build title from recent conventional commits. Write description including: problem being solved, solution approach, testing evidence, deployment notes (migrations, config, feature flags), rollback strategy. Reference any issues found in conversation.

6. **Present plan to user** - Show: platform, source branch, target branch, title, description summary. Ask: "Shall I create this PR/MR?"

7. **Execute on confirmation**:
   - **GitHub**: `gh pr create --title "<title>" --body "<body>" --base <target>`. Show the resulting URL.
   - **GitLab**: Use `create_merge_request` MCP tool with `source_branch`, `target_branch`, `title`, `description`. Show the resulting MR URL.
