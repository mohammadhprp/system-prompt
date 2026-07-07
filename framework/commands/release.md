---
description: Create a release by tagging the current state, generating changelog, and bumping version
agent: build
---

Release $ARGUMENTS

Create a release from the current branch state.

## Process

1. **Review recent commits** - Run `git fetch --tags`, `git describe --tags --abbrev=0` to find the latest tag. Run `git log <latest-tag>..HEAD --oneline --format="%s"` to collect all conventional commits since the last release. Read any existing `CHANGELOG.md`.

2. **Categorize commits** - Group commits by conventional commit type:
   - `feat!:` or `BREAKING CHANGE:` → breaking change
   - `feat:` → minor feature
   - `fix:` → patch fix
   - `perf:`, `refactor:`, `test:` → patch (if no features)
   - `chore:`, `docs:`, `ci:` → filtered from changelog

3. **Determine next version** - Based on the [`commit.md`](./commit.md) semver convention:
   - Breaking changes → increment major version (e.g., `1.2.3` → `2.0.0`)
   - New features → increment minor version (e.g., `1.2.3` → `1.3.0`)
   - Only fixes/refactors → increment patch version (e.g., `1.2.3` → `1.3.4`)
   - If no previous tag exists, propose `0.1.0`

4. **Present release plan** - Show: current version, new version, categorized changelog entries, and ask: "Shall I create this release (tag vX.Y.Z and update CHANGELOG.md)?"

5. **Execute on confirmation**:
   - Update `CHANGELOG.md`: create a new `## [vX.Y.Z]` section under `## Unreleased`, move categorized entries (excluding chore/docs/ci) into it, add the release date, keep the `## Unreleased` section empty for future work
   - Run `git add CHANGELOG.md && git commit -m "chore: release vX.Y.Z"`
   - Run `git tag -a vX.Y.Z -m "vX.Y.Z"`

6. **Verify** - Run `git log --oneline -n 3` and `git tag --list --sort=-v:refname -n5` to confirm the release tag and commit are in place.