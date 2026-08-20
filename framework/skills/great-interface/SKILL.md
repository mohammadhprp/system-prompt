---
name: great-interface
description: >-
  Build, explain, review, and refine product interfaces across accessibility, layout,
  writing, typography, color, UI polish, holistic review, change review, and design variants.
  Use when creating frontend interfaces, reviewing interface quality, explaining how an
  interface works, or comparing UI directions.
---

# Great Interface

Use the domain references below as the sources of truth. Load the smallest set that covers
the request, except for a holistic review, which loads every applicable review domain.

## Build and refine

- Accessibility: [better-accessibility.md](references/better-accessibility.md)
- Layout: [better-layout.md](references/better-layout.md)
- Writing: [better-writing.md](references/better-writing.md)
- Typography: [better-typography.md](references/better-typography.md)
- Colors: [better-colors.md](references/better-colors.md)
- UI polish and motion: [better-ui.md](references/better-ui.md)

## Review

- Holistic screen or flow review: [better-interface.md](references/better-interface.md)
- Change, branch, or pull request review: [interface-review.md](references/interface-review.md)

## Explore alternatives

- Explain how an interface or effect was built: [explain-interface.md](references/explain-interface.md)
- Build and compare multiple UI directions: [variant.md](references/variant.md)

## Ownership

Do not duplicate rules across domains. Accessibility owns keyboard support, focus, ARIA,
semantic structure, hit areas, announcements, and reduced motion. Layout owns grouping,
spacing, responsive structure, and spatial RTL. Writing owns interface copy. Typography owns
how text renders and wraps. Colors owns palette systems and color measurement. UI owns
surfaces, icons, and visual motion. The review references own orchestration and reporting.

When domains overlap, report or apply the rule in the owning domain and mention secondary
effects only where useful.
