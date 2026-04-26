---
trigger: model_decision
description: Apply this for any UI work: components, styling, className edits, layout, or visual decisions
---

# DESIGN_SYSTEM.md — Habit Tracker PWA

> Every visual decision is intentional. Do not substitute values with Tailwind defaults or "close enough" alternatives.

## Design Direction

**Concept: Considered Restraint.** Editorial print meets precision industrial object — a well-worn leather notebook, a Braun timer, a _Monocle_ page. Calm authority. Unhurried. Grown-up.

**Not:** a wellness app (no purples, no gradients, no leaf icons) · a gamified todo list (no confetti, no Duolingo streaks) · a generic SaaS dashboard (no blue/purple hero, no heavy floating cards) · an AI-generated UI (no Inter, no excessive rounding, no icon-heavy nav).

## Color System

Never hardcode hex values in components — always use CSS variables.

| Token                  | Value     | Usage                                          |
| ---------------------- | --------- | ---------------------------------------------- |
| `--color-canvas`       | `#F5F0E8` | Primary background (warm off-white)            |
| `--color-surface`      | `#EDE8DF` | Card / input background                        |
| `--color-border`       | `#D9D2C5` | Dividers, subtle lines                         |
| `--color-muted`        | `#A89F8C` | Placeholder, disabled, secondary text          |
| `--color-ink`          | `#2C2825` | Body text (warm dark gray, not pure black)     |
| `--color-ink-strong`   | `#1A1613` | Headings, labels, strong emphasis              |
| `--color-accent`       | `#B85C38` | Primary buttons, active states, streak numbers |
| `--color-accent-hover` | `#A04E2E` | Hover on accent elements                       |
| `--color-accent-wash`  | `#F5EDE8` | Completed habit card background                |
| `--color-error`        | `#C0392B` | Validation errors                              |
| `--color-error-wash`   | `#FAEAEA` | Error background tint                          |
| `--color-success`      | `#5A7A4A` | Positive feedback (use sparingly)              |

**Ratio rule:** Canvas + Ink carry 80% of visual weight. Accent only where it earns its place — primary CTA, active streak, completion toggle. Never decorative.

## Typography

**Google Fonts import:**

```css
@import url("https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap");
```

| Token            | Value                                                                               |
| ---------------- | ----------------------------------------------------------------------------------- |
| `--font-display` | `'Lora', 'Georgia', serif` — humanist serif, editorial character                    |
| `--font-body`    | `'DM Sans', 'Helvetica Neue', sans-serif` — warm grotesque, not clinical like Inter |
| `--font-mono`    | `'DM Mono', 'Courier New', monospace` — dates, IDs, streak counts                   |

**Type scale** (base 16px):

| Token         | Value      | Usage                           |
| ------------- | ---------- | ------------------------------- |
| `--text-xs`   | `0.75rem`  | Labels, fine print              |
| `--text-sm`   | `0.875rem` | Secondary text, meta            |
| `--text-base` | `1rem`     | Body copy                       |
| `--text-lg`   | `1.125rem` | Habit names                     |
| `--text-xl`   | `1.25rem`  | Section headings, streak number |
| `--text-2xl`  | `1.5rem`   | Page headings                   |
| `--text-3xl`  | `1.875rem` | Dashboard headline              |
| `--text-4xl`  | `2.25rem`  | Splash screen app name          |

**Type rules:**

| Element           | Font    | Size | Weight     | Color      |
| ----------------- | ------- | ---- | ---------- | ---------- |
| App name (splash) | display | 4xl  | 600        | ink-strong |
| Page heading      | display | 3xl  | 400 italic | ink-strong |
| Section label     | body    | xs   | 500        | muted      |
| Habit name        | body    | lg   | 500        | ink-strong |
| Habit description | body    | sm   | 300        | ink        |
| Streak number     | mono    | xl   | 500        | accent     |
| Streak label      | body    | xs   | 400        | muted      |
| Button text       | body    | sm   | 500        | —          |
| Input text        | body    | base | 400        | ink        |
| Input label       | body    | sm   | 500        | ink        |
| Error message     | body    | sm   | 400        | error      |

Section labels (all-caps): `letter-spacing: 0.08em`. Line-height: body → `1.6` · headings → `1.2` · mono → `1`.

## Spacing

4px base grid. All spacing is a multiple of 4px.

`--space-1: 4px` · `--space-2: 8px` · `--space-3: 12px` · `--space-4: 16px` · `--space-5: 20px` · `--space-6: 24px` · `--space-8: 32px` · `--space-10: 40px` · `--space-12: 48px` · `--space-16: 64px` · `--space-20: 80px`

Generous whitespace is a feature. When in doubt, add more vertical space.

## Border, Radius & Shadow

**Radii:** `--radius-sm: 4px` (inputs) · `--radius-md: 6px` (cards, buttons) · `--radius-lg: 10px` (modals) · `--radius-pill: 999px` (tags only). No `rounded-2xl` or larger on any primary element.

**Shadows** (warm-tinted, not gray):

- `--shadow-sm`: `0 1px 3px rgba(44,40,37,0.08), 0 1px 2px rgba(44,40,37,0.06)`
- `--shadow-md`: `0 4px 12px rgba(44,40,37,0.10), 0 2px 4px rgba(44,40,37,0.06)`
- `--shadow-lg`: `0 16px 40px rgba(44,40,37,0.14)`

Cards default to `box-shadow: none`. Shadow appears only on hover (`--shadow-md`).

## Component Rules

### Habit Card

- **Incomplete:** bg `--color-surface` · left border `3px solid var(--color-border)` · circle empty
- **Completed:** bg `--color-accent-wash` · left border `3px solid var(--color-accent)` · circle filled accent · habit name color `--color-muted`
- Padding `--space-6` all sides · left border is the primary completion indicator (not a checkbox)
- Edit/delete: icon-only buttons, no borders, no fills, always visible (mobile-first, not hover-reveal)
- Streak: mono number below description, small muted label beneath it

### Buttons

- **Primary:** bg `--color-accent` · white text · `--radius-md` · padding `--space-3 --space-6` · hover `--color-accent-hover` · active `translateY(1px)`
- **Ghost:** transparent bg · `--color-ink` text · `1px solid --color-border` · hover border `--color-ink`, bg `--color-surface`
- **Destructive:** bg `--color-error` · white text · same structure as primary
- **Icon (card actions):** transparent · `--color-muted` · hover color `--color-ink` · delete hover `--color-error`

### Inputs

- bg `--color-surface` · `1px solid --color-border` · `--radius-sm` · padding `--space-3 --space-4`
- Focus: border-color changes to `--color-ink` — no glow, no box-shadow
- Invalid: `border-color: --color-error`
- Labels: always above input (no floating labels) · `--text-sm`, weight 500, `--color-ink` · `--space-2` gap to input
- Errors: below input · `--text-sm` · `--color-error` · no animation

### Forms

Max width `440px` centered · field gap `--space-6` · submit full-width mobile, min `160px` desktop.

### Splash Screen

Centered app name "Habit Tracker" · `--font-display` · `--text-4xl` · weight 600 · `--color-ink-strong` · bg `--color-canvas` · fade out `opacity 300ms ease-out`.

### Dashboard Header

App name (display, italic, xl) left · logout (ghost or text link, sm) right · `1px solid --color-border` divider · greeting below in body sm muted.

### Empty State

Centered · heading display italic 2xl muted · subtext body sm muted · primary accent button centered.

### Habit Form Panel

Max-width `480px` · bg `--color-canvas` · top border `3px solid --color-ink-strong` (no radius on top) · heading display xl 600 · fields: name (required), description (textarea 3 rows, optional), frequency (select, locked to daily, visually muted/read-only) · Save (primary, right) · Cancel (ghost, left of save).

### Delete Confirmation

Inline or minimal modal · text: "Delete this habit? This cannot be undone." · [Cancel] ghost + [Delete] destructive, right-aligned · no red warning banners.

## Layout

- **Mobile (320px+):** single column · `--space-4` horizontal padding · habit cards stacked, `--space-4` gap
- **Tablet/Desktop (640px+):** max-width `680px` centered · `--space-8` horizontal padding · still single column (not a grid)
- **Z-index:** base `0` · raised `10` · modal `100` · toast `200`

## Motion

Purposeful and fast. Nothing performs for you.

- Button hover: `background 150ms ease`
- Input focus: `border-color 150ms ease`
- Card hover lift: `box-shadow 150ms ease, transform 100ms ease`
- Completion toggle: `background 200ms ease, border-color 200ms ease`
- Splash fade: `opacity 300ms ease-out`
- Card hover (desktop `@media (hover: hover)` only): `translateY(-1px)` + `--shadow-md`
- Do NOT animate: heights/widths, error appearances, list reorders

## Tailwind v4 Configuration

No `tailwind.config.ts`. All tokens registered in `globals.css` via `@theme {}`. Use `@import "tailwindcss"` (not the three legacy `@tailwind` directives).

`@theme` namespace mapping: `--color-*` → `bg-*`, `text-*`, `border-*` · `--font-*` → `font-*` · `--radius-*` → `rounded-*` · `--shadow-*` → `shadow-*`.

Non-Tailwind tokens (`--space-*`, `--duration-*`, `--ease-*`) go in `:root {}`, not `@theme`. Reference with `var()` only.

## Accessibility

- Focus ring: `outline: 2px solid var(--color-accent); outline-offset: 2px` on all interactive elements. Never remove without replacement.
- Contrast: ink/canvas = 10.2:1 (AAA) · accent/canvas = 4.6:1 (AA) · muted/canvas = 3.1:1 (non-critical text only)
- Touch targets: min `44×44px` via padding
- Completion toggle: never rely on color alone — circle fill + border change + bg wash together signal state

## Anti-Patterns

| ❌ Never                                | ✅ Instead                        |
| --------------------------------------- | --------------------------------- |
| Blue/purple gradients                   | Flat `--color-accent` surfaces    |
| Inter or Roboto                         | DM Sans + Lora                    |
| Heavy shadows on all cards              | Shadow on hover only              |
| `rounded-2xl` / `rounded-3xl`           | `--radius-md` (6px)               |
| Emoji in UI                             | Plain copy                        |
| Gradient text (clip-text)               | Solid ink-strong or accent        |
| Animated counters / spinners            | Static display, clean transitions |
| Glassmorphism / backdrop-blur           | Opaque warm surfaces              |
| Full-width hero banners                 | Header + divider line             |
| Tailwind preset grays (`text-gray-500`) | `--color-muted` #A89F8C           |
| Colored icon badges                     | Monochrome action icons           |
| Streak as flame icon                    | Mono number + text label          |
| Progress bars                           | Streak count is the single metric |
| Dark mode toggle (unsolicited)          | Light mode only, done well        |

## Developer Checklist

- [ ] No hardcoded hex in components — CSS variables only
- [ ] No Inter, no system font stacks
- [ ] No blue, purple, or teal anywhere
- [ ] No gradient backgrounds
- [ ] No emoji in rendered UI
- [ ] Card radii `--radius-md` or less
- [ ] Streak = mono number + plain text label
- [ ] Completed vs incomplete: visually distinct via left border + background
- [ ] All inputs have visible `<label>` elements
- [ ] Focus rings present on keyboard navigation
- [ ] Touch targets at least 44px
- [ ] Spacing on 4px grid
