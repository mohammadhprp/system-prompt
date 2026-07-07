---
description: Distill a reusable skill from any source — directory, URL, workflow, or pasted notes
agent: build
---

Learn $ARGUMENTS

Distill a reusable skill from anything the user describes. The agent gathers sources with its own tools, analyzes the pattern, and authors a SKILL.md with examples.

## Process

1. **Understand the source** — If the user provides a directory path, explore its structure and read key files. If a URL, fetch and analyze its content. If "the workflow we just did", review conversation history for tools used, step sequence, and corrections. If pasted notes, analyze them for structure, rules, and intent. Load [`skills/skill-creator/SKILL.md`](../skills/skill-creator/SKILL.md) for skill writing guidance.

2. **Capture intent and confirm** — Determine: what should this skill enable? When should it trigger (what user phrases/contexts)? What's the expected output format? Should test cases be created? Ask the user to confirm before proceeding.

3. **Research and gather context** — Search for similar existing skills in the catalog. Check for relevant MCPs, standards, or references. Identify edge cases, input/output formats, and dependencies.

4. **Author the skill** — Create `skills/<name>/SKILL.md` with: frontmatter (name, description optimized for triggering), purpose, when to activate, step-by-step workflow, rules, deliverables, and checklist. Follow skill-creator principles: use imperative form, explain the *why*, keep under 500 lines, avoid over-constraining with MUSTs.

5. **Write examples** — Create `skills/<name>/examples.md` with 3+ realistic examples. Each should show the trigger context, input, and expected output or workflow.

6. **Register in catalog** — Add the skill to `skills/README.md` in the correct alphabetical position in the table.

7. **Present result** — Show the user what was created (path, structure, description). Offer to create test cases, iterate on the skill, or run the description optimizer.