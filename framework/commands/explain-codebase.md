---
description: Map a codebase, then teach it interactively across sessions. Use when the user wants to learn how the codebase works.
agent: plan
---

Explain codebase $ARGUMENTS

Survey the codebase for how it is structured, present the map as a visual HTML report, then teach the user one focused slice at a time across sessions. Do not refactor, do not fix bugs, do not implement features.

All state, including the map report, lives under `./.codebase-guide/` so the repo stays clean. Nothing else in the repo is written.

## Vocabulary

Use these terms exactly. Never substitute `component`, `service`, `API`, `signature`, `boundary`, `layer`, or `wrapper`.

- **Module**: anything with an interface and an implementation. Scale-agnostic: a function, class, package, or tier-spanning slice.
- **Interface**: everything a caller must know to use the module correctly: type signature, invariants, ordering constraints, error modes, required configuration, performance characteristics.
- **Implementation**: what is inside a module.
- **Adapter**: a concrete thing that satisfies an interface at a seam. Describes role, not substance.
- **Depth**: leverage at the interface. A module is **deep** when a large amount of behaviour sits behind a small interface, **shallow** when the interface is nearly as complex as the implementation.
- **Seam**: a place where behaviour can be altered without editing in that place; the location at which a module's interface lives.
- **Leverage / locality**: leverage is how much behaviour one interface gives callers; locality is how much of a behaviour lives in one module.

Principles: the **deletion test** (would deleting this module concentrate complexity, or just move it?), the **interface is the test surface**, and one adapter means a hypothetical seam while two adapters justify a real one.

## Process

### 1. Mission

If `./.codebase-guide/MISSION.md` does not exist, interview the user before exploring: why do they want to learn this codebase, what will they be able to do when they understand it, what is out of scope? Then write it:

```md
# Mission: {repo or subsystem}

## Why
{1-3 sentences. The concrete outcome, not "to understand X".}

## Success looks like
- {A specific, observable thing the user will be able to do}

## Constraints
- {Time, prior knowledge, learning preferences}

## Out of scope
- {Topics explicitly not chased right now}
```

One mission per workspace. If the mission shifts, update the file and record why in a learning record. If the file exists, read it and confirm it still holds.

### 2. Scope and explore

Scope before you scan. If `$ARGUMENTS` names a module, subsystem, or question, take it. Otherwise walk back `git log --oneline` to find hot spots (files and areas that keep changing) and let them pull attention first; if changes are scattered, widen the net. If `CONTEXT.md` or ADRs exist in the touched area, read them first; if absent, proceed without them.

Then walk the codebase with a sub-agent. Do not follow rigid heuristics; explore organically and note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules shallow, with an interface nearly as complex as the implementation?
- Where have pure functions been extracted for testability but the real complexity hides in how they are called (no locality)?
- Where do tightly-coupled modules leak across their seams?
- Which parts are untested or hard to test through their current interface?

Apply the deletion test to anything suspect. Record stated user preferences in `./.codebase-guide/NOTES.md`.

### 3. Map report

Write a self-contained HTML file at `./.codebase-guide/codebase-map-<timestamp>.html`. Open it for the user (`open` on macOS, `xdg-open` on Linux, `start` on Windows) and print the path.

Scaffold: Tailwind via CDN, Mermaid via CDN (`mermaid@11` ESM import, `startOnLoad: true`), static otherwise. Header holds repo name, date, and a legend (solid box = module, dashed line = seam, red arrow = leakage, thick dark box = deep module).

Each candidate area gets one card: title naming the idea, badge (`Strong` emerald / `Worth exploring` amber / `Speculative` slate), files in monospace, before/after diagram side by side (~320px tall), one-sentence problem, one-sentence solution, wins as bullets of 6 words or fewer in glossary terms (`locality: bugs concentrate in one module`, never `cleaner code`). Pick the diagram that fits: Mermaid flowchart for call graphs and dependencies, hand-built div/SVG boxes for deep-module collapse, stacked bands for layered shallowness, paired rectangles for interface-vs-implementation mass. End with a Top recommendation: which area to learn first and why.

Then ask: "Which of these would you like to learn first?" Also seed `./.codebase-guide/RESOURCES.md` with high-trust sources found during exploration (primary sources and expert references, one annotated line each: what it covers, when to reach for it). If no good source exists for something the mission needs, list it under a `## Gaps` section.

### 4. Teach one slice at a time

Each lesson is one self-contained HTML file at `./.codebase-guide/lessons/0001-<slug>.html` (number increments), opened for the user after writing. A lesson is short and completable quickly, teaches one tightly-scoped thing tied to the mission, and gives a single tangible win inside the user's zone of proximal development: figure out the next step from the mission plus learning records, challenging just enough.

Every lesson: clean readable typography (the first lesson earns a shared stylesheet at `./.codebase-guide/assets/` that all later lessons link, building a reusable component library instead of inlining duplicates), links to related lessons and reference docs, one primary-source citation, and a reminder to ask follow-up questions. Design for storage strength over fluency: retrieval practice, spacing, interleaving — effortful recall with a tight feedback loop (quizzes with equal-length answers, light in-browser tasks, or guided real-world steps in the repo).

Alongside lessons, keep compressed reference docs at `./.codebase-guide/reference/*.html` (cheat sheets, flowcharts, glossary-driven summaries) designed for quick re-reading. Maintain `./.codebase-guide/GLOSSARY.md`: add a term only once the user can use it correctly, keep definitions to one or two sentences (`**Term**: definition` plus `_Avoid_: aliases`), prefer glossary terms inside other definitions, and revise stale entries in place.

### 5. Learning records and grilling

After each lesson, write a learning record at `./.codebase-guide/learning-records/NNNN-<slug>.md` (scan for the highest number, increment by one) only when earned:

```md
# {Short title of what was learned or established}

{1-3 sentences: what was learned and why it changes what to teach next.}
```

Write one when the user demonstrates non-trivial understanding, discloses prior knowledge (record claimed depth), corrects a misconception, or shifts the mission (update `MISSION.md` too). Coverage is not learning: never log mere exposure. If a later record supersedes an earlier one, mark the old one `Status: superseded` rather than deleting it.

When a decision crystallizes during teaching (naming a module after a new concept, sharpening a fuzzy term), update `GLOSSARY.md` inline. Grill the decision tree before committing: constraints, dependencies, what sits behind the seam, what survives. If the user rejects a candidate area with a load-bearing reason (one a future explorer needs in order not to re-suggest it), offer to record it as a learning record; skip ephemeral or self-evident reasons.

## Rules

- Never modify repo code. All writes stay under `./.codebase-guide/`.
- Cite evidence as `path:line`. Read the code; do not guess from file names.
- Lessons serve the mission and the zone of proximal development, not coverage.
- Stop when the mission is met; offer the next slice, do not force it.
