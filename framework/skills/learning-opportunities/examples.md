# Learning Opportunities Examples

## Offer an exercise after creating a module

User just created auth middleware: "Done, that's the middleware working."

Good agent behavior:

- Offer one short, optional exercise: "Would you like a quick learning exercise on middleware patterns? About 10-15 minutes."
- If the user agrees, use a predict-then-observe exercise: ask what happens when a request hits the middleware with an expired token.
- Stop generating immediately after the question and wait for the user's answer.
- If the prediction is wrong, be direct about what's incorrect, then explore the gap.

## Teach it back after a refactor

User: "We just replaced the cache layer. I want to make sure I actually understand it."

Good agent behavior:

- Ask the user to explain the caching layer as if to a new developer joining the project.
- Stop after posing the question and wait for the response.
- Confirm the specific parts they nailed, then name one concrete gap to refine.
- Keep the exercise exploratory rather than test-like.

## Decline when the user is in a hurry

User: "Just ship it, this needs to go out now."

Good agent behavior:

- Recognize urgency and skip the exercise offer entirely.
- Avoid repeating the offer when the user has already declined once this session.
- Cap the session at two completed exercises and stop offering.
- Keep any offer to a single sentence without insisting.
