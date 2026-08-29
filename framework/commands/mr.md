---
description: Create a merge request from the current branch
---

Create $ARGUMENTS merge request

Create a merge request for the current branch.

## Process

1. **Collect information**
   - Get current branch name: `git branch --show-current`
   - Read MR template from `.gitlab/merge_request_templates/default.md` of exsits

2. **Format MR title**
   - Take the branch name, replace all `-` with spaces, capitalize first character

3. **Collect commits and build summary**
   - List commits on the branch that are not on `dev`: `git log dev..HEAD --oneline`
   - Read each commit message, convert to a bullet list summarizing user-facing changes
   - Merge/squash related commits (e.g. multiple commits for the same change)
   - Keep concise, one bullet per logical change

4. **Fill template**
   - Set Summary to the bullet list from step 3
   - Keep the Checklist section as-is

5. **Present plan and confirm** - Show:
   - Source branch
   - Target branch: `develop`
   - Title
   - Filled description
   - Ask: "Shall I create this MR?"
   - Push the changes if user says Yes

6. **Create upon confirmation** - Use `glab mr create`:
   - `--source-branch`: Current branch
   - `--target-branch`: `develop`
   - `--title`: Prepend "Draft: " to the formatted branch name
   - `--description`: Filled template content
   - `--assignee`: `1`
   - `--squash`
   - `--remove-source-branch`

7. **Show the resulting URL.**
