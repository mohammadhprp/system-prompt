# Raycast — Style Reference

> Midnight command center, coral neon

**Theme:** dark

![Raycast preview](https://images.refero.design/styles/refero.design/image/ee40e139-0b24-47a0-9ea0-98372d317c5b.jpg)

Raycast reads as a dark power-tool cockpit: an almost-black canvas (#040506) with barely-visible elevation steps, a single warm coral accent (#ff6363) that carries brand identity, and quiet white/gray typography in Inter. Components are defined less by shadows and more by hairline borders, inset highlight strokes, and the distinctive 'keyboard key' inner-shadow treatment that makes cards feel pressed and tactile rather than floating. Color is rationed — the page is 98% achromatic, and the coral appears only in the logo, hero artwork, AI badge, and the occasional warm-tinted surface. Navigation floats with a glass-blur effect, and most interactive surfaces are neutral light-gray buttons on dark, not chromatic CTAs.

- **Website:** [https://raycast.com](https://raycast.com)
- **Source:** [Refero Styles](https://styles.refero.design/style/3b6a17f0-3bdf-418c-a95e-0b89e5a8b2f8)

## Color Palette

### Brand

| Name | Value | Role |
| --- | --- | --- |
| Coral Pulse | `#ff6363` | Brand accent — logo diamond, AI badge fill, hero artwork saturation |
| Ember Hush | `#452324` | Warm-tinted card backgrounds, accent surface tints |

### Accent

| Name | Value | Role |
| --- | --- | --- |
| Electric Sky | `#63a1ff` | Hero illustration mid-tone, decorative gradient |
| Cobalt Edge | `#143ca3` | Hero illustration stroke, deep gradient anchor |
| Deep Space | `#02193b` | Hero illustration fill, darkest blue |
| Info Blue | `#56c2ff` | Blue wash for highlight backgrounds, decorative bands |
| Success Green | `#59d499` | Green wash for highlight backgrounds, decorative bands |

### Neutrals

| Name | Value | Role |
| --- | --- | --- |
| Void Black | `#040506` | Page canvas, dominant background |
| Ink | `#07080a` | Card surfaces, elevated panels, image backgrounds |
| Obsidian | `#111214` | Subtle surface tint, pressed states, input wells |
| Graphite | `#1b1c1e` | Neutral form states, badge text |
| Slate | `#2f3031` | Dark button borders and labels |
| Iron | `#454647` | Button text on light fills, mid-gray borders |
| Smoke | `#6a6b6c` | Secondary body text, muted labels |
| Ash | `#9c9c9d` | Light text on dark surfaces, inverse labels |
| Mist | `#e6e6e6` | Light neutral action fill for buttons |
| Pure White | `#ffffff` | Headings, high-emphasis text |

## Typography

### Fonts

| Font | Role | Weights | Fallback |
| --- | --- | --- | --- |
| Inter | Primary interface typeface | 400, 500, 600 | system-ui, -apple-system, Helvetica Neue, Arial |
| GeistMono | Monospace for version strings, technical micro-labels | 300, 400, 500 | JetBrains Mono, Menlo, Monaco, Courier |
| SF Pro Text | System font for icon glyphs and numeric stat callouts | 500, 700 | SF Pro on macOS |

### Type Scale

| Role | Size | Weight | Line Height | Letter Spacing |
| --- | --- | --- | --- | --- |
| display | 64px | 600 | 1.1 | — |
| heading-lg | 56px | 400 | 1.17 | 0.22px |
| heading | 32px | 500 | 1.15 | — |
| heading-sm | 24px | 500 | 1.15 | — |
| subheading | 20px | 500 | 1.2 | 0.2px |
| body-lg | 18px | 400 | 1.15 | — |
| body | 16px | 400 | 1.15 | — |
| eyebrow | 11px | — | 0.91 | 0.8px |

## Spacing & Shape

### Spacing

| Purpose | Value |
| --- | --- |
| Base unit | 8px |
| Density | comfortable |
| Max width | 1200px |
| Section gap | 80–120px |
| Card padding | 24px |
| Element gap | 8–16px |

### Border Radius

| Element | Value |
| --- | --- |
| badges | 6px |
| inputs | 8px |
| buttons | 8px |
| cards | 16px |
| largeCards | 20px |
| pills | 9999px |
| iconContainers | 99999px |

### Shadows

Elevation comes from the inset "keyboard key" shadow stack (rgba(255,255,255,0.05) inset top + rgba(255,255,255,0.25) outer ring + rgba(0,0,0,0.2) inset bottom), not outer drop shadows.

## Components

| Component | Key Properties |
| --- | --- |
| Glass Navigation Bar | Floating pill with backdrop-blur(48px), 1px solid #363739, 8px radius |
| Neutral Filled Button | Mist (#e6e6e6) fill, Iron (#454647) text, 8px radius, 8px 12px padding |
| Ghost Nav Link | Transparent, Ash (#9c9c9d) text, 13–14px, no border |
| Feature Card (Key Shadow) | 16px radius, 24px padding, keyboard key shadow stack |
| Inset Input Field | 8px radius, rgba(255,255,255,0.05) fill, 8px 12px padding |
| Badge Tag | Graphite (#1b1c1e) fill, Pure White text, 6px radius |
| Circular Icon Container | 99999px radius, 20px padding, dark surface fill |
| Footer Meta Strip | Geist Mono 12px, Ash text, vertical pipe separators |

## Guidelines

### Do

- Use #040506 as the only page background
- Reserve #ff6363 (Coral Pulse) for the logo, hero artwork, AI badge, and warm-tinted card surfaces
- Use the 'keyboard key' inner shadow stack on all elevated cards
- Set hero headlines at 56px/400 in Inter with +0.22px letter-spacing
- Use Mist (#e6e6e6) filled buttons with Iron (#454647) text for all primary actions
- Use 8px radius for buttons, inputs, and badges; 16–20px radius for cards

### Don't

- Don't use chromatic action buttons — the CTA system is deliberately neutral
- Don't add drop-shadows to cards or panels
- Don't use negative letter-spacing on large display text
- Don't introduce light theme sections
- Don't break the 8px spacing grid

## Quick Start

### CSS Custom Properties

```css
:root {
  --color-void-black: #040506;
  --color-ink: #07080a;
  --color-obsidian: #111214;
  --color-graphite: #1b1c1e;
  --color-smoke: #6a6b6c;
  --color-ash: #9c9c9d;
  --color-mist: #e6e6e6;
  --color-iron: #454647;
  --color-slate: #2f3031;
  --color-pure-white: #ffffff;
  --color-coral-pulse: #ff6363;
  --color-ember-hush: #452324;
  --color-electric-sky: #63a1ff;
  --color-cobalt-edge: #143ca3;
  --color-deep-space: #02193b;
  --color-info-blue: #56c2ff;
  --color-success-green: #59d499;
  --font-inter: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-geistmono: 'GeistMono', ui-monospace, monospace;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, sans-serif;
  --radius-cards: 16px;
  --radius-pills: 9999px;
  --radius-buttons: 8px;
  --radius-inputs: 8px;
  --radius-badges: 6px;
}
```

### Tailwind v4

```css
@theme {
  --color-void-black: #040506;
  --color-ink: #07080a;
  --color-obsidian: #111214;
  --color-graphite: #1b1c1e;
  --color-smoke: #6a6b6c;
  --color-ash: #9c9c9d;
  --color-mist: #e6e6e6;
  --color-iron: #454647;
  --color-slate: #2f3031;
  --color-pure-white: #ffffff;
  --color-coral-pulse: #ff6363;
  --color-ember-hush: #452324;
  --color-electric-sky: #63a1ff;
  --color-cobalt-edge: #143ca3;
  --color-deep-space: #02193b;
  --color-info-blue: #56c2ff;
  --color-success-green: #59d499;
  --font-inter: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-geistmono: 'GeistMono', ui-monospace, monospace;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, sans-serif;
}
```

## Similar Brands

Linear, Vercel, Arc Browser, Cron (Notion Calendar), Tana