# Skills CLI Examples

## Example 1: Discover and Install a Skill

A developer wants to find a testing skill. Good agent behavior:

- Suggest running `npx skills search testing` to discover available testing skills.
- Review the search results and recommend the most relevant skill.
- Run `npx skills install <recommended-skill>` to install it.
- Verify installation with `npx skills list --installed`.
- Check the skill's README or SKILL.md for usage instructions.

## Example 2: Explore the Skills Ecosystem

A user is new to the skills ecosystem and wants to understand what's available. Good agent behavior:

- Run `npx skills list` to show the full catalog of available skills.
- Identify skills relevant to the user's tech stack (e.g., React, Python, Docker).
- Suggest starting with 2-3 foundational skills and expanding as needed.
- Explain the relationship between the Vercel Labs registry and local skills (`skills/` directory).

## Example 3: Manage Installed Skills

A user has old skills and wants to clean up. Good agent behavior:

- List installed skills with `npx skills list --installed`.
- Check for updates with `npx skills update --dry-run`.
- Update all skills with `npx skills update`.
- Remove unused skills with `npx skills remove <skill-name>`.
- Suggest reviewing documentation for any breaking changes after major updates.
