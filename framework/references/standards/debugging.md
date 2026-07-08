# Debugging Standard

## Purpose

Define reusable backend engineering rules for debugging decisions across projects. This standard is canonical guidance for related skills.

## Rules

- Reproduce the issue in a non-production environment before changing any code.
- Isolate one variable at a time (binary search through commits, configs, inputs, or environment differences).
- Correlate logs, metrics, and traces by a shared identifier (trace_id, request_id, correlation_id) before forming a hypothesis.
- Fix root causes, not symptoms. A fix that does not prevent recurrence is incomplete.
- Preserve all diagnostic evidence (logs, dumps, metrics snapshots) before restarting or rolling back.

## Best Practices

- Start with the most recent change when diagnosing a regression; git bisect is faster than manual inspection.
- Write a hypothesis before each experiment: "If X is the cause, then Y will happen when I do Z."
- Add a regression test or monitoring check after the fix to detect recurrence automatically.
- Pair debug with a colleague when stuck for more than 30 minutes; fresh eyes see different assumptions.
- Document the root cause and fix in a shared incident log or postmortem.

## Anti-patterns

- Changing code based on assumptions without reproducing the issue first.
- Stopping at the first plausible cause without ruling out alternative explanations.
- Cherry-picking evidence that supports the current hypothesis while ignoring contradictory data.
- Applying hotfixes in production without understanding the root cause.
- Restarting services to "fix" a problem, which destroys diagnostic evidence.

## Checklist

- [ ] The issue is reproduced in a safe environment.
- [ ] Logs, metrics, and traces are correlated and examined together.
- [ ] A root cause hypothesis explains all observed symptoms.
- [ ] Alternative hypotheses have been ruled out.
- [ ] The fix addresses the root cause, not just the symptom.
- [ ] A regression test or monitor can detect recurrence.

## Related Skills

- `skills/backend-engineer/SKILL.md`
- `skills/code-review/SKILL.md`
- `skills/backend-best-practices/references/debugging.md`
