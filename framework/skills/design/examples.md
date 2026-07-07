# Design Like Damien Examples

## Example 1: Premium SaaS Landing Page

Build a landing page for a new AI-powered project management tool. Good agent behavior:

- Establish design tokens first: near-black background (#0A0A0A), single electric blue accent, Geist font with tight -0.03em tracking on headings.
- Build the component system before any page — button variants, card components with hover states, responsive navigation.
- Use a full-viewport hero with a single headline, one CTA, and subtle background motion — no gradient blobs or stock imagery.
- Apply generous section padding (py-24 minimum) and rounded-2xl cards with shadow-sm only.
- Add scroll-driven entrance animations via Framer Motion whileInView (y: 40 → 0, opacity: 0 → 1, duration: 0.6s, once: true).
- Verify against the "Not AI" checklist: no pure black/white, no more than 2 fonts, accent used ≤3 times per page.

## Example 2: Converting Figma Design to Lovable

A designer provides a Figma mockup for an athlete portfolio site. Good agent behavior:

- Extract exact tokens from Figma: hex values, font sizes, spacing values — paste into Lovable's Knowledge Base.
- Identify the aesthetic as "white editorial": background #FAFAFA, Fraunces for display headings, Inter Tight for body.
- Build component by component: typography system → card components → navigation → page layout.
- Use Select mode in Lovable to make targeted edits on individual elements without breaking surrounding components.
- Iterate one layer at a time: typography spacing first, then color refinement, then scroll-triggered reveals.
- Add Lenis smooth scroll for the premium editorial feel; stagger hero entrance with 0.1s delay between children.

## Example 3: Fixing Generic AI-Generated UI

A user has a Lovable-built dashboard that looks &ldquo;AI-generated&rdquo; — generic blue gradient hero, Poppins font, heavy shadows. Good agent behavior:

- Diagnose the issues against the "Not AI" checklist: gradient background, too many colors, wrong font choice, heavy shadows.
- Replace the gradient background with a solid near-black (#111111) and define a single accent color.
- Swap Poppins for Space Grotesk with tight tracking (-0.03em), add border-radius of rounded-2xl to all cards.
- Remove all shadow-lg and replace with shadow-sm; replace solid borders with rgba(255,255,255,0.08).
- Refactor the component order: define tokens → rebuild button system → fix navigation → recompose pages.
- Apply the "When Output Looks Generic" refinement prompt to guide the final polish pass.
