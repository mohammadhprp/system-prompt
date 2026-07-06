# Linear — Style Reference

> midnight precision instrument

**Theme:** dark

![Linear preview](https://images.refero.design/styles/refero.design/image/eee18c0c-a85f-4a66-83f6-f9f38d284825.jpg)

Linear's design system is a midnight command center built on near-black surfaces (#08090a) with paper-white type and one electric acid-lime accent (#e4f222) that functions as a functional flashlight — small, high-contrast, and used sparingly to signal action. The interface treats darkness as a substrate rather than a theme: text is crisp white at tight tracking (-0.022em), weights sit in a low 400–510 band rather than bold, and borders are hairline-thin (0.5px) to let geometry do the work that shadows usually would. Components feel precision-machined — 6px and 12px radii, compact 8–12px paddings, and almost no decorative ornament — letting the product UI (issue cards, kanban boards, AI agent panels) be the only visual texture in an otherwise quiet system.

- **Website:** [https://linear.app](https://linear.app)
- **Source:** [Refero Styles](https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1)

## Color Palette

### Brand

| Name | Value | Role |
| --- | --- | --- |
| Acid Lime | `#e4f222` | Primary action buttons, active nav indicators — electric accent that breaks the monochrome system |

### Accent

| Name | Value | Role |
| --- | --- | --- |
| Pulse Green | `#27a644` | Green outline accent for tags, dividers, and focused UI edges |
| Coral Red | `#eb5757` | Red wash for highlight backgrounds, decorative bands, soft emphasis |
| Signal Teal | `#02b8cc` | Decorative accent, informational icon fills |
| Iris Violet | `#6366f1` | Tag/badge fills — soft chromatic punctuation on tags and labels |
| Lavender | `#8b5cf6` | Secondary tag fills, category indicators |

### Neutrals

| Name | Value | Role |
| --- | --- | --- |
| Void | `#08090a` | Page canvas, full-bleed backgrounds |
| Carbon | `#0f1011` | Card surfaces, nav bars |
| Obsidian | `#161718` | Elevated surfaces, deeper card panels |
| Graphite | `#23252a` | Subtle borders, dividers, ghost button outlines |
| Smoke | `#383b3f` | Hairline borders, section separators |
| Ash | `#62666d` | Muted body text, inactive icons, secondary metadata |
| Fog | `#8a8f98` | Tertiary text, placeholder copy, icon fills |
| Mist | `#d0d6e0` | Secondary headings, button text on dark surfaces |
| Bone | `#e5e5e6` | Near-white surface fills, high-contrast button text |
| Paper | `#ffffff` | Primary headings, hero type, max-contrast emphasis text |

## Typography

### Fonts

| Font | Role | Weights | Fallback |
| --- | --- | --- | --- |
| Inter Variable | Primary UI and heading typeface | 300, 400, 510, 590 | Inter (variable), system-ui |
| Berkeley Mono | Code-adjacent UI text (issue IDs, keyboard shortcuts) | 400 | JetBrains Mono, IBM Plex Mono, ui-monospace |

### Type Scale

| Role | Size | Weight | Line Height | Letter Spacing |
| --- | --- | --- | --- | --- |
| display | 72px | 510 | 1.0 | -0.022em |
| heading-lg | 64px | 510 | 1.0 | -0.022em |
| heading | 48px | 510 | 1.0 | -0.022em |
| heading-sm | 32px | 400 | 1.13 | -0.022em |
| subheading | 24px | 400 | 1.33 | -0.012em |
| body-lg | 20px | 590 | 1.33 | -0.012em |
| body | 16px | 400 | 1.5 | -0.010em |
| body-sm | 15px | 400 | 1.6 | -0.011em |
| caption | 13px | 400 | 1.2 | — |
| label | 12px | 400 | 1.4 | — |
| micro | 10px | 510 | 1.5 | — |

## Spacing & Shape

### Spacing

| Purpose | Value |
| --- | --- |
| Base unit | 4px |
| Density | compact |
| Max width | 1200px |
| Section gap | 96px |
| Card padding | 24px |
| Element gap | 8px |

### Border Radius

| Element | Value |
| --- | --- |
| small | 2px |
| badges | 4px |
| inputs | 6px |
| buttons | 6px |
| cards | 12px |
| pills | 9999px |

### Shadows

Elevation comes from hairline borders (0.5px #23252a or 1px inset #23252a) and subtle dark drop shadows, rather than layered shadow stacks.

## Components

| Component | Key Properties |
| --- | --- |
| Primary Action Button | Background #e4f222, text #08090a, radius 6px, padding 10px 16px, Inter 14px / 510 |
| Nav Text Button | Transparent, text #d0d6e0, padding 8px 12px, Inter 13px / 400 |
| Pill Button | Background rgba(255,255,255,0.05), text #d0d6e0, radius 9999px, padding 4px 12px |
| Ghost / Outline Button | Transparent, border 1px #23252a, text #d0d6e0, radius 6px, padding 8px 12px |
| Card (Screenshot) | Background #0f1011, radius 12px, inset shadow 1px #23252a, padding 24px |
| Text Input | Background rgba(255,255,255,0.02), border 1px rgba(255,255,255,0.08), radius 6px |
| Badge / Status Tag | Background rgba(255,255,255,0.05), text #8a8f98, radius 4px, Inter 12px |

## Guidelines

### Do

- Use Inter Variable with font-feature-settings 'cv01' on, 'ss03' on, 'zero' on
- Use #e4f222 exclusively for the single primary action per view
- Set body text at 16px Inter weight 400 with line-height 1.5
- Use letter-spacing -0.022em at 48px and above
- Set card radius to 12px, button radius to 6px, pill radius to 9999px
- Use 0.5px hairline borders instead of shadows for surface separation
- Keep section gaps at 96px and element gaps at 8px

### Don't

- Do not use bold weights (700+)
- Do not use decorative gradients on buttons, cards, or text
- Do not introduce additional chromatic accent colors as actions
- Do not use large radii (16px+) on cards or panels
- Do not use shadows to separate cards from the canvas

## Quick Start

### CSS Custom Properties

```css
:root {
  --color-void: #08090a;
  --color-carbon: #0f1011;
  --color-obsidian: #161718;
  --color-graphite: #23252a;
  --color-smoke: #383b3f;
  --color-ash: #62666d;
  --color-fog: #8a8f98;
  --color-mist: #d0d6e0;
  --color-bone: #e5e5e6;
  --color-paper: #ffffff;
  --color-acid-lime: #e4f222;
  --color-pulse-green: #27a644;
  --color-coral-red: #eb5757;
  --color-signal-teal: #02b8cc;
  --color-iris-violet: #6366f1;
  --color-lavender: #8b5cf6;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
  --font-berkeley-mono: 'Berkeley Mono', ui-monospace, monospace;
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-buttons: 6px;
  --radius-inputs: 6px;
  --radius-badges: 4px;
}
```

### Tailwind v4

```css
@theme {
  --color-void: #08090a;
  --color-carbon: #0f1011;
  --color-obsidian: #161718;
  --color-graphite: #23252a;
  --color-smoke: #383b3f;
  --color-ash: #62666d;
  --color-fog: #8a8f98;
  --color-mist: #d0d6e0;
  --color-bone: #e5e5e6;
  --color-paper: #ffffff;
  --color-acid-lime: #e4f222;
  --color-pulse-green: #27a644;
  --color-coral-red: #eb5757;
  --color-signal-teal: #02b8cc;
  --color-iris-violet: #6366f1;
  --color-lavender: #8b5cf6;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
  --font-berkeley-mono: 'Berkeley Mono', ui-monospace, monospace;
}
```

## Similar Brands

Vercel, Cursor, Raycast, Framer