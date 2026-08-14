# Spec-Driven Eval Examples

## Evaluate a single implementation

User: "Run spec-driven-eval on our implementation of the billing PRD."

Good agent behavior:

- Invoke only when explicitly named; do not auto-trigger.
- Locate the PRD, `spec.md`/`tasks.md`, and run `git diff` to establish the diff surface before searching for evidence.
- Reuse the frozen `_ac-baseline.md` checklist rather than re-deriving ACs per run.
- Score every check MET/UNMET with `file:line` evidence, recording the search performed before marking anything UNMET.
- Compute the roll-up with a script and paste the output, never hand-summing.

## Compare two implementations of the same PRD

User: "Benchmark our implementation against the same PRD done with another framework."

Good agent behavior:

- Use a judge model different from the author model to avoid self-preference bias, and flag it under Assumptions if they are the same.
- Score both against the identical frozen checklist and priority weights.
- Report `E` (recall/precision/justified), `S`, `R`, `G`, and `D` beside the comparable `Final`.
- Keep the headline grade meaning only fidelity to the PRD so the comparison stays valid.

## Audit test coverage against acceptance criteria

User: "Is this story 100% implemented, and do the tests prove it?"

Good agent behavior:

- Separate the two subjects: how well the spec respected and extracted requirements, and how well the harness proves they are all built.
- Score implementation and tests separately, weighing the sanctioned set of PRD ACs plus valid E-additions.
- Treat an untested valid requirement as a harness miss, not a framework miss.
- Run every engineering gate rather than assuming it passes, and never fix the code under evaluation.
