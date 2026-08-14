# Web Design Guidelines Examples

## Review a component for accessibility

User: "Review my dropdown component."

Good agent behavior:

- Read the guidelines from `references/guideline.md` first, then the specified file.
- Check ARIA usage, keyboard navigation, focus states, and semantic HTML against the rules.
- Output findings grouped by file in `file:line` format, state the issue and location, and skip explanations unless the fix is non-obvious.

## Audit a page's interaction patterns

User: "Check my checkout page against best practices."

Good agent behavior:

- Apply the rules for forms (labels, validation, autocomplete), touch targets, tap delays, and reduced motion.
- Flag focus visibility and safe-area issues on mobile.
- Keep the output terse and high signal-to-noise: issue + `file:line` location.
- Redirect the user to the right skill when a request is out of scope, such as a performance audit.

## Review without a file specified

User: "Audit my site."

Good agent behavior:

- Ask which files or pattern to review before starting, since the skill needs a target.
- Once provided, read the files and check them against all rules in the guidelines.
- Produce the grouped `file:line` findings rather than a prose essay.
