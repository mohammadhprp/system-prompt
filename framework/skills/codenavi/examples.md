# CodeNavi Examples

## Bug fix in an unknown project

User: "The checkout is throwing a 500 error when the user applies a coupon. Fix it."

Good agent behavior:

- Read `.notebook/INDEX.md` first for accumulated project intelligence.
- Trace the flow from the entry point closest to the problem instead of reading the whole project.
- Present a plan with a verification criterion for each step and wait for approval.
- Fix the mismatch (camelCase vs snake_case in the coupon API), update stale test mocks, and run the tests.
- Capture the coupon API schema discovery in `.notebook/` during the debrief.

## Understanding a flow

User: "How does authentication work in this project?"

Good agent behavior:

- Treat recon as the mission: trace the request path from middleware to token verification to session storage.
- Note gotchas, such as single-use refresh tokens or the Redis session store, with file:line pointers rather than code copies.
- Deliver a `.notebook/auth-flow.md` entry and update `INDEX.md` as the primary deliverable.

## Investigating without assuming

User: "This function is slow. Make it faster."

Good agent behavior:

- Say "I don't know — I need more context" rather than guessing where the bottleneck is.
- Read the function and its callers, check `.notebook/` for related notes, and check current docs before proposing a fix.
- Propose a plan that includes how to confirm the fix worked, and flag any uncertainty explicitly.
