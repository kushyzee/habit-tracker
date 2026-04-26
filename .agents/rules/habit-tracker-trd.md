---
trigger: always_on
---

# GEMINI.md — Habit Tracker PWA

> This file provides full project context. It is derived from the official Technical Requirements Document (TRD).
> All implementation decisions must conform to this document.

---

## Project Overview

A **mobile-first Habit Tracker Progressive Web App (PWA)** built with Next.js App Router, React, TypeScript, and Tailwind CSS. All persistence is local (localStorage). There is no
remote database or external authentication service. The app must behave like a real product
despite the local-only persistence layer.

This focuses on technical discipline, deterministic behavior, and testability.

---

## User Capabilities

- Sign up with email and password
- Log in and log out
- Create, edit, and delete habits
- Mark a habit complete for today / unmark it
- View a visible current streak per habit
- Reload the app and retain saved state (localStorage persistence)
- Install the app as a PWA
- Load the cached app shell offline without a hard crash

---

## Required Stack

| Layer           | Technology                  |
| --------------- | --------------------------- |
| Framework       | Next.js (App Router)        |
| Language        | TypeScript (strict)         |
| UI              | React + Tailwind CSS        |
| Persistence     | localStorage (no remote DB) |
| Unit tests      | Vitest + coverage           |
| Component tests | React Testing Library       |
| E2E tests       | Playwright                  |

> Do NOT replace any of the required testing tools.

---

## Route Contract

| Route        | Behavior                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| `/`          | Splash screen → redirect to `/dashboard` (session exists) or `/login` (no session). Splash visible for 800–2000ms. |
| `/signup`    | Render signup form → on success, create user + session in localStorage → redirect to `/dashboard`                  |
| `/login`     | Render login form → on success, create session in localStorage → redirect to `/dashboard`                          |
| `/dashboard` | Protected. No session → redirect `/login`. Valid session → render user's habits only.                              |

---

## Persistence Contract

All data stored in **localStorage** under these exact keys:

### `habit-tracker-users`

```ts
type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};
```

### `habit-tracker-session`

```ts
type Session = {
  userId: string;
  email: string;
} | null;
```

### `habit-tracker-habits`

```ts
type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily";
  createdAt: string;
  completions: string[]; // unique YYYY-MM-DD strings
};
```

**Rules:**

- `id` must be unique
- `userId` must match the owning user
- `completions` must contain unique ISO calendar dates (`YYYY-MM-DD`)
- Only `daily` frequency is required in this stage

---

## Required Folder and File Structure

```
src/
  app/
    globals.css
    layout.tsx
    page.tsx
    login/page.tsx
    signup/page.tsx
    dashboard/page.tsx
  components/
    auth/
      LoginForm.tsx
      SignupForm.tsx
    habits/
      HabitForm.tsx
      HabitList.tsx
      HabitCard.tsx
    shared/
      SplashScreen.tsx
      ProtectedRoute.tsx
  lib/
    auth.ts
    habits.ts
    storage.ts
    streaks.ts
    slug.ts
    validators.ts
    constants.ts
  types/
    auth.ts
    habit.ts

public/
  icons/
    icon-192.png
    icon-512.png
  manifest.json
  sw.js

tests/
  unit/
    slug.test.ts
    validators.test.ts
    streaks.test.ts
    habits.test.ts
  integration/
    auth-flow.test.tsx
    habit-form.test.tsx
  e2e/
    app.spec.ts
```

> Additional files may be added. Required files must not be renamed or removed.

---

## Naming Conventions

- React component files → **PascalCase** (e.g., `HabitCard.tsx`)
- Utility files in `src/lib` → **lowercase** exactly as listed
- Test files → match the structure above exactly
- TypeScript interfaces/types → **PascalCase**
- Helper functions → **camelCase**

---

## Required Type Contracts

### `src/types/auth.ts`

```ts
export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

export type Session = {
  userId: string;
  email: string;
};
```

### `src/types/habit.ts`

```ts
export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily";
  createdAt: string;
  completions: string[];
};
```

---

## Required Utility Functions

### `src/lib/slug.ts`

```ts
export function getHabitSlug(name: string): string;
```

- Lowercase, trim, collapse spaces to hyphens, remove non-alphanumeric chars except hyphens
- `"Drink Water"` → `"drink-water"`

### `src/lib/validators.ts`

```ts
export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
};
```

- Trim input
- Empty → `"Habit name is required"`
- Over 60 chars → `"Habit name must be 60 characters or fewer"`
- Valid → return normalized trimmed value

### `src/lib/streaks.ts`

```ts
export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number;
```

- Deduplicate and sort completions before logic
- Today not completed → `0`
- Today completed → count consecutive days backwards
- `[]` → `0` | `[today]` → `1` | `[today, yesterday]` → `2` | `[yesterday]` → `0` | `[today, twoDaysAgo]` → `1`

### `src/lib/habits.ts`

```ts
export function toggleHabitCompletion(habit: Habit, date: string): Habit;
```

- Add date if absent, remove if present
- No duplicate dates
- Must not mutate the original habit

---

## UI Contract — Required `data-testid` Attributes

### Splash Screen (`SplashScreen.tsx`)

- `data-testid="splash-screen"`
- Must display text: **Habit Tracker**

### Login Form (`LoginForm.tsx`)

- `data-testid="auth-login-email"`
- `data-testid="auth-login-password"`
- `data-testid="auth-login-submit"`

### Signup Form (`SignupForm.tsx`)

- `data-testid="auth-signup-email"`
- `data-testid="auth-signup-password"`
- `data-testid="auth-signup-submit"`

### Dashboard

- `data-testid="dashboard-page"`
- `data-testid="empty-state"` (when no habits exist)

### Create Habit UI

- `data-testid="create-habit-button"`
- `data-testid="habit-form"`
- `data-testid="habit-name-input"`
- `data-testid="habit-description-input"`
- `data-testid="habit-frequency-select"`
- `data-testid="habit-save-button"`

### Habit Card (slug-based — e.g., habit name "Drink Water" → slug "drink-water")

- `data-testid="habit-card-{slug}"`
- `data-testid="habit-streak-{slug}"`
- `data-testid="habit-complete-{slug}"`
- `data-testid="habit-edit-{slug}"`
- `data-testid="habit-delete-{slug}"`
- `data-testid="confirm-delete-button"` (on delete confirmation)

### Logout

- `data-testid="auth-logout-button"`

---

## Auth Behavior Rules

**Signup:**

- Email and password are required
- Duplicate email → show `"User already exists"`

**Login:**

- Must match existing user + password
- Invalid credentials → show `"Invalid email or password"`

**Logout:**

- Remove session from localStorage
- Redirect to `/login`

---

## Habit Behavior Rules

**Create:** name required, description optional, frequency defaults to `daily`, belongs to current user.

**Edit:** name and description may change; `id`, `userId`, `createdAt`, `completions` must be preserved.

**Delete:** requires explicit confirmation before removal.

**Complete/Toggle:** toggles today's date only; no duplicate completions; streak must update immediately after toggle.

---

## PWA Contract

### `public/manifest.json` — must include:

- `name`, `short_name`, `start_url`, `display`, `background_color`, `theme_color`
- Icons for 192×192 and 512×512

### `public/sw.js` — service worker:

- Registered on the client side
- Caches the app shell on first load
- App shell renders offline without hard crashing

### Icon files:

- `public/icons/icon-192.png`
- `public/icons/icon-512.png`

---

## Styling & Responsiveness

- Mobile-first layout
- Usable at 320px minimum width
- Readable on tablet and desktop
- Clear visual distinction between completed and incomplete habits

---

## Accessibility Requirements

- Semantic HTML elements
- All interactive controls keyboard accessible
- All inputs have visible labels
- Buttons use `<button>` elements
- Visible focus states present

---

## Required Test Suite

### Test Title Rules

All describe block names and test titles must appear **exactly** as listed below in console output.
Do not rename, paraphrase, or merge test titles.

---

### Unit Tests

#### `tests/unit/slug.test.ts`

```
describe('getHabitSlug', () => {
  'returns lowercase hyphenated slug for a basic habit name'
  'trims outer spaces and collapses repeated internal spaces'
  'removes non alphanumeric characters except hyphens'
})
```

#### `tests/unit/validators.test.ts`

```
describe('validateHabitName', () => {
  'returns an error when habit name is empty'
  'returns an error when habit name exceeds 60 characters'
  'returns a trimmed value when habit name is valid'
})
```

#### `tests/unit/streaks.test.ts`

```
describe('calculateCurrentStreak', () => {
  'returns 0 when completions is empty'
  'returns 0 when today is not completed'
  'returns the correct streak for consecutive completed days'
  'ignores duplicate completion dates'
  'breaks the streak when a calendar day is missing'
})
```

#### `tests/unit/habits.test.ts`

```
describe('toggleHabitCompletion', () => {
  'adds a completion date when the date is not present'
  'removes a completion date when the date already exists'
  'does not mutate the original habit object'
  'does not return duplicate completion dates'
})
```

---

### Integration / Component Tests

#### `tests/integration/auth-flow.test.tsx`

```
describe('auth flow', () => {
  'submits the signup form and creates a session'
  'shows an error for duplicate signup email'
  'submits the login form and stores the active session'
  'shows an error for invalid login credentials'
})
```

#### `tests/integration/habit-form.test.tsx`

```
describe('habit form', () => {
  'shows a validation error when habit name is empty'
  'creates a new habit and renders it in the list'
  'edits an existing habit and preserves immutable fields'
  'deletes a habit only after explicit confirmation'
  'toggles completion and updates the streak display'
})
```

---

### End-to-End Tests (Playwright)

#### `tests/e2e/app.spec.ts`

```
test.describe('Habit Tracker app', () => {
  'shows the splash screen and redirects unauthenticated users to /login'
  'redirects authenticated users from / to /dashboard'
  'prevents unauthenticated access to /dashboard'
  'signs up a new user and lands on the dashboard'
  'logs in an existing user and loads only that user's habits'
  'creates a habit from the dashboard'
  'completes a habit for today and updates the streak'
  'persists session and habits after page reload'
  'logs out and redirects to /login'
  'loads the cached app shell when offline after the app has been loaded once'
})
```

---

## Coverage Requirement

- Run with `vitest --coverage`
- Minimum **80% line coverage** for all files inside `src/lib`

---

## Required Package Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test:unit": "vitest run --coverage",
    "test:integration": "vitest run",
    "test:e2e": "playwright test",
    "test": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

---

## Key Constraints & Reminders

- **No external auth service.** Auth is local and deterministic.
- **Do not rename required files** — file names, test titles, and `data-testid` values are verified by automated tooling.
- **Slug-based test IDs are dynamic** — derived at runtime from `getHabitSlug(habit.name)`.
- - The splash screen delay must be **between 800ms and 2000ms** (not instant, not too long).
- `toggleHabitCompletion` must be **pure** — no mutation of input.
- `calculateCurrentStreak` must **deduplicate and sort** completions before calculating.
- Edit habit must **preserve** `id`, `userId`, `createdAt`, and `completions`.
- Delete habit requires **explicit user confirmation** before removal from state/storage.
- PWA service worker must be **registered client-side** and cache the app shell.
