---
name: design-like-damien
description: >
  Apply Damien Ghader's (Creme Digital) design philosophy and Lovable prompting system
  to produce premium, editorial-quality UI that never looks "AI-generated." Use this skill
  whenever building apps, landing pages, dashboards, or components in Lovable — especially
  when the user wants results that feel like Linear, Mercury, Wealthsimple, or Audi-quality
  design. Trigger on any request involving Lovable UI/UX, design systems, component design,
  typography, dark mode, scroll animations, or premium SaaS aesthetics. Also trigger when
  the user says "design like Damien," "Creme Digital style," "make it premium," or asks
  for Framer-quality output from Lovable. Do not skip this skill for any visual design task —
  it defines the entire standard of quality expected.
---

# Design Like Damien — Creme Digital Design System

A complete design philosophy and Lovable prompting system from **Damien Ghader**, co-founder of [Creme Digital](https://www.creme.digital) — the #1 AI product studio building premium apps with Lovable.

---

## Core Philosophy

> "Our apps never look 'AI'. Because we create custom UI in Lovable."

The goal is always to produce interfaces that make people say: *"Wait, an AI made this?"*

Three non-negotiables:
1. **Component-first, not page-first.** Real design systems are built from atoms up. Define tokens and components before you build any page.
2. **Restraint is premium.** Less is more. The best UI uses fewer colors, simpler type scales, and purposeful whitespace — not decoration.
3. **Motion earns its place.** Every animation must have a reason. Scroll-driven, physics-based, intentional — never decorative noise.

---

## The Design Language

### Aesthetic References
When prompting, reference these brands to set the quality bar:
- **Linear** — ultra-crisp dark UI, tight spacing, monospace accents
- **Mercury** — editorial elegance, generous whitespace, refined typography
- **Wealthsimple** — Canadian premium, editorial serif + modern sans pairings
- **Audi / F1** — motorsport precision, monochromatic confidence, structured grids
- **Framer** — interactive depth, micro-interaction mastery

Use these as reference points in prompts: *"Inspired by Linear's dark UI and Mercury's editorial spacing."*

### Color Systems
Never use more than **3 primary colors** in a project:

**Dark mode (preferred for premium products):**
```
Background:  #0A0A0A or #111111 (near-black, not pure black)
Surface:     #141414 or #1A1A1A (card/panel layer)
Border:      rgba(255,255,255,0.08) to rgba(255,255,255,0.12)
Primary text: #F5F5F5 or #FAFAFA
Secondary text: rgba(255,255,255,0.5)
Accent:      Single brand color — electric, saturated, used sparingly
```

**Light/editorial mode (for athlete sites, editorial, journalism):**
```
Background:  #FAFAFA or pure #FFFFFF
Surface:     #F4F4F4
Border:      rgba(0,0,0,0.08)
Primary text: #0A0A0A
Secondary text: rgba(0,0,0,0.45)
Accent:      Black, or a single muted brand tone
```

**Charcoal dark (for sports apps like Paddock):**
```
Background:  #1C1C1E
Surface:     #2C2C2E
Accent:      One saturated color (red, teal, electric blue) — used only on CTAs and active states
```

### Accent Color Rule
- One accent. Not two, not three.
- Applied only to: primary CTAs, active navigation states, key data highlights.
- Never use accent color for backgrounds or large surfaces.

---

## Typography System

### Pairing Principles
- Maximum **2 typefaces** per project. Often just 1 is better.
- Serif for editorial presence, sans-serif for UI clarity.
- Combine contrast: *Display serif + neutral sans*, or *geometric sans + monospace*.

### Proven Pairings (Damien's go-to combinations)

| Style | Display / Heading | Body / UI |
|---|---|---|
| Editorial (athlete sites) | Fraunces | Inter Tight |
| Premium SaaS | Geist | Geist Mono (accents) |
| Motorsport / Dark | Space Grotesk | Space Mono (labels) |
| Minimal product | DM Sans (–2 tracking) | DM Sans |
| Luxury / Finance | Playfair Display | Inter |

### Type Scale Rules
```
Tracking (letter-spacing): -0.02em to -0.04em on headings (tight is premium)
Line height: 1.1 to 1.2 on large headings; 1.5 to 1.6 on body
Weight contrast: Pair 300 (light) with 700 (bold) — avoid mid-weights like 400 on headings
Uppercase: Sparingly, for labels and navigation only — never body text
```

### Typography in Prompts
Always specify this explicitly:
```
Font: [Name], weight [X]. Letter-spacing: -0.03em on headings, -0.01em on body.
Line-height: 1.15 headings, 1.6 body. No uppercase except nav labels.
```

---

## Spacing & Layout

- Use **8pt grid** as the base unit (8, 16, 24, 32, 48, 64, 96, 128)
- **Generous padding is premium.** Section padding: minimum 80px vertical, 120px+ preferred.
- Cards: `p-6` minimum, `p-8` for hero cards. Round corners `rounded-2xl` (Damien's default).
- Borders: always `rounded-2xl` or `rounded-3xl`. Sharp corners only for motorsport/brutalist aesthetic.
- Subtle shadows only: `shadow-sm` or custom `box-shadow: 0 1px 3px rgba(0,0,0,0.12)`. Never heavy drop shadows.

---

## Component Architecture: The Creme Digital Way

### Step 1: Define Design Tokens First
Before building any page, set your token layer in Lovable:

```
Prompt template:
"Before building any UI, establish a design system foundation:
- Colors: [paste your palette with hex values and semantic names]
- Typography: [font name], sizes [list scale], weights [list weights], tracking [value]
- Spacing: 8pt grid — 8/16/24/32/48/64/96px
- Border radius: rounded-2xl as default (16px)
- Shadows: subtle only — shadow-sm
- Borders: rgba(255,255,255,0.08) on dark, rgba(0,0,0,0.06) on light

Apply these tokens globally. Do not deviate."
```

### Step 2: Build Core Components
Build in this order — never skip to pages:
1. **Button system** — primary, secondary, ghost, destructive
2. **Card component** — with hover states
3. **Navigation** — desktop + mobile responsive
4. **Input/Form elements**
5. **Typography components** — heading scales, body, labels

### Step 3: Build Pages from Components
Once tokens and components exist, pages compose naturally with minimal prompting.

---

## Lovable Prompting System

### The Anatomy of a Damien Prompt

Every strong Lovable prompt has 5 parts:

```
1. PRODUCT PURPOSE (what + who)
2. EMOTIONAL TONE (how it should feel)  
3. DESIGN REFERENCES (brand/site comparisons)
4. TECHNICAL SPECS (fonts, colors, stack)
5. COMPONENT/PAGE DETAILS (what to build)
```

### Master Prompt Template

```
Build a [type of product] for [target audience].

FEEL: It should feel [emotional descriptors — e.g. "editorial, restrained, precise"].
Inspired by [reference 1] and [reference 2].

DESIGN SYSTEM:
- Background: [hex]
- Surface: [hex]
- Accent: [hex]
- Font: [name], weight [X/Y]. Tracking: -0.03em headings. Line-height: 1.15 headings / 1.6 body.
- Border radius: rounded-2xl
- Shadows: shadow-sm only
- Borders: rgba(255,255,255,0.08)

STACK: React + Tailwind + shadcn/ui. Mobile-first, fully responsive.

BUILD:
[Detailed component/page list with specific interactions]

DO NOT use: generic gradients, rainbow accents, heavy drop shadows, stock-looking card layouts.
Make it look like it was crafted by a world-class design team.
```

### Emotional Tone Words That Work in Lovable
Use these descriptors — Lovable understands them as design parameters:
- `editorial` → wide margins, serif accents, clean white space
- `premium` → restraint, monochromatic, precise type
- `cinematic` → full-bleed imagery, dramatic contrast, bold scale
- `brutalist` → raw typography, sharp edges, high contrast
- `developer-focused` → monospace, dark mode default, dense information
- `luxurious` → generous padding, serif typography, gold/cream palette
- `athletic / motorsport` → bold weight, tight tracking, single saturated accent

---

## Animation System

### Damien's Animation Stack
- **Framer Motion** — for all React entrance animations and layout transitions
- **Lenis** — smooth scroll engine (replaces native browser scroll)
- **GSAP + ScrollTrigger** — for complex scroll-driven animations and cinematic effects

### When to Use Each
| Need | Tool |
|---|---|
| Component entrance (fade, slide, scale) | Framer Motion |
| Page transitions | Framer Motion |
| Smooth scrolling feel | Lenis |
| Scroll-triggered reveals | Framer Motion (whileInView) or GSAP ScrollTrigger |
| Cinematic parallax / path animations | GSAP |
| Counter animations / SVG drawing | GSAP |

### Scroll Animation Prompt (Framer Motion)
```
Add scroll-driven entrance animations using Framer Motion:
- All sections: fade up on enter (y: 40 → 0, opacity: 0 → 1)
- Duration: 0.6s, ease: [0.25, 0.1, 0.25, 1]
- Stagger children by 0.1s
- Use whileInView with viewport: { once: true, margin: "-100px" }
- Do not animate on mobile if reduce-motion is preferred
```

### Lenis Smooth Scroll Setup
```
Integrate Lenis smooth scroll:
- Install @studio-freight/lenis
- Initialize in useEffect with lerp: 0.1, duration: 1.2
- Sync with Framer Motion using lenis.on('scroll', ScrollTrigger.update)
- Apply to root wrapper, not individual sections
```

### Animation Principles
- **Entrance only.** Things animate in; they don't animate out.
- **Subtle by default.** Max travel distance: 40px on y-axis. Scale from 0.95, not 0.5.
- **Fast.** 0.4s–0.7s. Anything over 0.8s feels slow.
- **Once.** `viewport: { once: true }`. Don't repeat animations on re-entry.

---

## Project-Type Playbooks

### Landing Page / Marketing Site
```
Priority: Hero impact → Social proof → Feature breakdown → CTA
Typography: Large display heading (clamp 48–96px), tight tracking
Hero: Full-viewport, single headline, one CTA, optional subtle background motion
Animation: Staggered hero entrance, section reveals on scroll
Mobile: Stack everything single column, increase tap targets
```

### SaaS Dashboard
```
Priority: Data clarity → Navigation efficiency → Status at a glance
Layout: Fixed sidebar (240px) + main content area
Colors: Dark mode preferred, single accent for active/alert states
Components: Cards with live data, charts (Recharts), status badges
Density: Information-dense but never cluttered — use dividers, not padding to separate
```

### Athlete / Personal Site
```
Priority: Visual impact → Story → Stats → Contact
Aesthetic: White editorial (Bortoleto model) OR dark cinematic
Typography: Fraunces/Inter Tight or bold sans-serif, large scale
Data: Real season stats via API or static, displayed as hero numbers
Motion: Dramatic page entrance, parallax on hero image
```

### Motorsport / Sports App
```
Priority: Race data → Standings → Dark mode
Colors: Charcoal base (#1C1C1E) + single accent (team color)
Typography: Space Grotesk or similar geometric sans
Components: Data tables with accent on active rows, live ticker elements
Icons: Lucide React, thin weight
```

### Proposal / Slide Deck App
```
Priority: Client impression → Content hierarchy → Easy navigation
Aesthetic: Agency-grade, not generic
Layout: Full-bleed sections, one key point per "slide"
Typography: Bold display for headlines, restrained body
Export: Always plan for PDF or shareable link output
```

---

## The "Not AI" Checklist

Before shipping any Lovable build, check these:

- [ ] Background is NOT pure white (#FFFFFF) or pure black (#000000) — use near-tones
- [ ] No more than 2 fonts in use
- [ ] No generic blue primary color (unless brand requires it)
- [ ] No heavy card shadows (`shadow-lg` or larger) — use `shadow-sm` or none
- [ ] No stock-looking hero with centered text on gradient blob
- [ ] Spacing feels intentional — sections have real breathing room
- [ ] Typography has tight negative tracking on headings
- [ ] Accent color appears in ≤3 places per page
- [ ] Animations are subtle (max 40px travel, max 0.7s duration)
- [ ] All components are mobile-responsive (test at 375px)
- [ ] Navigation works on both desktop and mobile

---

## Figma → Lovable Fidelity Workflow

When converting Figma designs to Lovable:

1. **Extract tokens from Figma** — copy exact hex values, font sizes, spacing
2. **Set Knowledge Base first** — paste the full design system spec into Lovable's Knowledge
3. **Build component by component** — never ask Lovable to rebuild a whole page at once
4. **Use Select mode** — click individual elements in Lovable to make targeted edits without breaking other components
5. **Iterate one layer at a time** — typography first, then spacing, then color, then animation

---

## Prompt Refinement Strategy

### When Output Looks "Generic"
Add these modifiers to any prompt:
```
"Make this look like it was designed by the team behind [Linear / Stripe / Mercury].
Avoid any of the following: gradient blobs, rainbow accent systems, Poppins font,
purple-to-blue gradients, glassmorphism for the sake of it, or centered hero layouts
with stock-looking imagery. Use restraint. Less decoration, more intention."
```

### When Type Looks Off
```
"Fix the typography:
- Headings: tracking -0.03em, weight 700, line-height 1.1
- Body: tracking -0.01em, weight 400, line-height 1.6
- Labels: uppercase, tracking 0.08em, weight 500, font-size 11px
- Remove any use of font-weight 600 on large headings"
```

### When Spacing Feels Cramped
```
"Increase all section padding to py-24 minimum (96px).
Increase card padding to p-8. Add gap-8 between grid items.
The design should breathe — premium products have generous whitespace."
```

### When Colors Feel Off
```
"Audit and fix the color system:
- Background: [exact hex]
- One accent color only: [hex] — remove any secondary accent
- All borders: rgba(255,255,255,0.08) — no solid gray borders
- Text hierarchy: #F5F5F5 primary, rgba(255,255,255,0.5) secondary, rgba(255,255,255,0.3) tertiary"
```

---

## Creme Digital Stack

The default technical foundation for all Creme Digital builds:

| Layer | Technology |
|---|---|
| Framework | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui (customized, not default) |
| Backend | Supabase (auth, database, storage) |
| Animation | Framer Motion + Lenis |
| Icons | Lucide React |
| Charts | Recharts |
| Hosting | Lovable (built-in) or Vercel |

---

## Quick Reference: Damien's Signature Moves

1. **Dark near-black backgrounds** (`#0A0A0A`, `#111111`) — never pure black
2. **Tight negative tracking** on all headings (`-0.03em`)
3. **Single accent color** — used only 2-3 times per page
4. **Fraunces + Inter Tight** for editorial/athlete projects
5. **Space Grotesk** for motorsport/tech projects
6. **`rounded-2xl` everywhere** — 16px corner radius as default
7. **Subtle borders**: `rgba(255,255,255,0.08)` — barely visible, but present
8. **Framer Motion whileInView** for all scroll reveals — always `once: true`
9. **Lenis smooth scroll** on every marketing/portfolio site
10. **Component-first always** — tokens → components → pages, never the reverse
