---
name: skills-cli
description: Discover, install, and manage agent skills using the `npx skills` CLI from Vercel Labs. Use when the user wants to find new skills, install skills from a registry, manage installed skills, or understand the skills ecosystem across 70+ coding agents.
---

# Skills CLI (`npx skills`)

The [Vercel Labs Skills CLI](https://github.com/vercel-labs/skills) is a tool for discovering, installing, and managing agent skills. It provides a registry of skills across 70+ coding agents and handles installation, updates, and discovery.

## When to Activate

Use this skill when:
- The user wants to find or discover new skills for their coding agent
- The user wants to install a skill from a remote registry
- The user asks about managing installed skills (list, update, remove)
- The user says "npx skills" or references the Vercel Labs skills ecosystem
- The user wants to share or publish skills
- The user is unfamiliar with the `npx skills` CLI and needs guidance

## Workflow

### 1. Skill Discovery

```bash
# List available skills
npx skills list

# Search for specific skills
npx skills search <query>

# Show skill details
npx skills info <skill-name>
```

### 2. Skill Installation

```bash
# Install a skill by name
npx skills install <skill-name>

# Install from a specific source
npx skills install <skill-name> --source <url>
```

### 3. Skill Management

```bash
# List installed skills
npx skills list --installed

# Update all skills
npx skills update

# Remove a skill
npx skills remove <skill-name>
```

### 4. Publishing Skills

Skills can be published to the registry by following the [contribution guide](https://github.com/vercel-labs/skills/blob/main/CONTRIBUTING.md). Each skill is a directory with a `SKILL.md` file defining its purpose, triggers, and behavior.

## Relationship to This Repo

This repo (`system-prompt`) manages skills locally under `skills/<name>/` with `SKILL.md` and `examples.md` files. The `npx skills` CLI complements this by providing a discovery and installation layer on top of a shared registry. Skills in this repo follow the same conceptual model (SKILL.md-based) and could potentially be published to the Vercel Labs registry.

## Architecture

The Skills CLI:
- Uses a registry of community-contributed skills
- Supports 70+ coding agents
- Provides version management for installed skills
- Handles dependency resolution between skills
- Allows custom source URLs for private registries
