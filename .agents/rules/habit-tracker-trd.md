---
trigger: always_on
---

# Habit Tracker PWA

> Full project context derived from the Technical Requirements Document. All decisions must conform.

## Project Overview

A **mobile-first Habit Tracker PWA** built with Next.js App Router, React, TypeScript, and Tailwind CSS v4. All persistence is localStorage only — no remote DB, no external auth. The app must behave like a real product despite the local-only layer. Stage 3 focuses on technical discipline, deterministic behavior, and testability.

**User capabilities:** sign up / log in / log out · create, edit, delete habits · mark a habit complete for today / unmark · view current streak · retain state on reload · install as PWA · load app shell offline.

## Required Stack

| Layer           | Technology              |
| --------------- | ----------------------- |
| Framework       | Next.js App Router      |
| Language        | TypeScript (strict)     |
| UI              | React + Tailwind CSS v4 |
| Persistence     | localStorage only       |
| Unit tests      | Vitest + coverage       |
| Component tests | React Testing Library   |
| E2E tests       | Playwright              |

Do NOT replace any required testing tool.

## Route Contract

| Route        | Behavior                                                                       |
| ------------ | ------------------------------------------------------------------------------ |
| `/`          | Splash screen (visible 800–2000ms) → redirect to `/dashboard` or `/login`      |
| `/signup`    | Signup form → create user + session in localStorage → redirect `/dashboard`    |
| `/login`     | Login form → create session in localStorage → redirect `/dashboard`            |
| `/dashboard` | Protected. No session → redirect `/login`. Valid session → user's habits only. |

## Persistence Contract

localStorage keys and shapes:

**`habit-tracker-users`**

```ts
type User = { id: string; email: string; password: string; createdAt: string };
```

**`habit-tracker-session`**

```ts
type Session = { userId: string; email: string } | null;
```

**`habit-tracker-habits`**

```ts
type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily";
  createdAt: string;
  completions: string[]; // unique YYYY-MM-DD
};
```

Rules: `id` unique · `userId` matches owner · `completions` unique ISO dates · only `daily` frequency required.

## Required File Structure

```
src/
  app/
    globals.css / layout.tsx / page.tsx
    login/page.tsx · signup/page.tsx · dashboard/page.tsx
  components/
    auth/LoginForm.tsx · SignupForm.tsx
    habits/HabitForm.tsx · HabitList.tsx · HabitCard.tsx
    shared/SplashScreen.tsx · ProtectedRoute.tsx
  lib/
    auth.ts · habits.ts · storage.ts · streaks.ts · slug.ts · validators.ts · constants.ts
  types/auth.ts · habit.ts

public/
  manifest.json · sw.js · icons/icon-192.png · icons/icon-512.png

tests/
  unit/slug.test.ts · validators.test.ts · streaks.test.ts · habits.test.ts
  integration/auth-flow.test.tsx · habit-form.test.tsx
  e2e/app.spec.ts
```

Naming: components → PascalCase · lib files → lowercase · types → PascalCase · helpers → camelCase.

## Required Type Contracts

**`src/types/auth.ts`**

```ts
export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};
export type Session = { userId: string; email: string };
```

**`src/types/habit.ts`**

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

## Required Utility Functions

**`src/lib/slug.ts`** — `export function getHabitSlug(name: string): string`
Lowercase, trim, collapse spaces → hyphens, remove non-alphanumeric except hyphens. `"Drink Water"` → `"drink-water"`.

**`src/lib/validators.ts`** — `export function validateHabitName(name: string): { valid: boolean; value: string; error: string | null; }`
Trim input · empty → `"Habit name is required"` · over 60 chars → `"Habit name must be 60 characters or fewer"` · valid → return trimmed value.

**`src/lib/streaks.ts`** — `export function calculateCurrentStreak(completions: string[], today?: string): number`
Deduplicate + sort before logic · today not completed → `0` · today completed → count consecutive days backwards.
Examples: `[]`→`0` · `[today]`→`1` · `[today,yesterday]`→`2` · `[yesterday]`→`0` · `[today,twoDaysAgo]`→`1`.

**`src/lib/habits.ts`** — `export function toggleHabitCompletion(habit: Habit, date: string): Habit`
Add date if absent, remove if present · no duplicates · must not mutate the original.

## UI Contract — Required `data-testid` Values

| Component    | data-testid values                                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| SplashScreen | `splash-screen` (must show text "Habit Tracker")                                                                                              |
| LoginForm    | `auth-login-email` · `auth-login-password` · `auth-login-submit`                                                                              |
| SignupForm   | `auth-signup-email` · `auth-signup-password` · `auth-signup-submit`                                                                           |
| Dashboard    | `dashboard-page` · `empty-state` (when no habits)                                                                                             |
| Create Habit | `create-habit-button` · `habit-form` · `habit-name-input` · `habit-description-input` · `habit-frequency-select` · `habit-save-button`        |
| HabitCard    | `habit-card-{slug}` · `habit-streak-{slug}` · `habit-complete-{slug}` · `habit-edit-{slug}` · `habit-delete-{slug}` · `confirm-delete-button` |
| Logout       | `auth-logout-button`                                                                                                                          |

Slugs are dynamic — derived at runtime via `getHabitSlug(habit.name)`. e.g. "Drink Water" → `drink-water`.

## Auth & Habit Behavior Rules

**Signup:** email + password required · duplicate email → `"User already exists"`.
**Login:** must match existing user + password · invalid → `"Invalid email or password"`.
**Logout:** remove session from localStorage → redirect `/login`.

**Create habit:** name required · description optional · frequency defaults to `daily` · belongs to current user.
**Edit habit:** name + description may change · `id`, `userId`, `createdAt`, `completions` must be preserved.
**Delete habit:** requires explicit confirmation before removal.
**Toggle completion:** toggles today's date only · no duplicate completions · streak updates immediately.

## PWA Contract

`public/manifest.json` must include: `name`, `short_name`, `start_url`, `display`, `background_color`, `theme_color`, icons for 192 and 512.
`public/sw.js`: registered client-side · caches app shell on first load · app shell renders offline without crashing.

## Required Test Suite

Test titles must appear **exactly** as written in console output. Do not rename or paraphrase.

**`tests/unit/slug.test.ts`** — `describe('getHabitSlug', () => {})`

- `returns lowercase hyphenated slug for a basic habit name`
- `trims outer spaces and collapses repeated internal spaces`
- `removes non alphanumeric characters except hyphens`

**`tests/unit/validators.test.ts`** — `describe('validateHabitName', () => {})`

- `returns an error when habit name is empty`
- `returns an error when habit name exceeds 60 characters`
- `returns a trimmed value when habit name is valid`

**`tests/unit/streaks.test.ts`** — `describe('calculateCurrentStreak', () => {})`

- `returns 0 when completions is empty`
- `returns 0 when today is not completed`
- `returns the correct streak for consecutive completed days`
- `ignores duplicate completion dates`
- `breaks the streak when a calendar day is missing`

**`tests/unit/habits.test.ts`** — `describe('toggleHabitCompletion', () => {})`

- `adds a completion date when the date is not present`
- `removes a completion date when the date already exists`
- `does not mutate the original habit object`
- `does not return duplicate completion dates`

**`tests/integration/auth-flow.test.tsx`** — `describe('auth flow', () => {})`

- `submits the signup form and creates a session`
- `shows an error for duplicate signup email`
- `submits the login form and stores the active session`
- `shows an error for invalid login credentials`

**`tests/integration/habit-form.test.tsx`** — `describe('habit form', () => {})`

- `shows a validation error when habit name is empty`
- `creates a new habit and renders it in the list`
- `edits an existing habit and preserves immutable fields`
- `deletes a habit only after explicit confirmation`
- `toggles completion and updates the streak display`

**`tests/e2e/app.spec.ts`** — `test.describe('Habit Tracker app', () => {})`

- `shows the splash screen and redirects unauthenticated users to /login`
- `redirects authenticated users from / to /dashboard`
- `prevents unauthenticated access to /dashboard`
- `signs up a new user and lands on the dashboard`
- `logs in an existing user and loads only that user's habits`
- `creates a habit from the dashboard`
- `completes a habit for today and updates the streak`
- `persists session and habits after page reload`
- `logs out and redirects to /login`
- `loads the cached app shell when offline after the app has been loaded once`

## Coverage & Scripts

Minimum **80% line coverage** for `src/lib`. Run with `vitest --coverage`.

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test:unit": "vitest run --coverage",
  "test:integration": "vitest run",
  "test:e2e": "playwright test",
  "test": "npm run test:unit && npm run test:integration && npm run test:e2e"
}
```

## Key Constraints

- All persistence is localStorage only — no remote DB, no external auth.
- Required file names, test titles, and `data-testid` values are verified by automated tooling — do not rename.
- Splash screen delay must be between 800ms and 2000ms.
- `toggleHabitCompletion` must be pure (no mutation).
- `calculateCurrentStreak` must deduplicate and sort before calculating.
- Edit preserves `id`, `userId`, `createdAt`, `completions`.
- Delete requires explicit user confirmation.
- PWA service worker registered client-side; caches app shell.
- Styling: Tailwind v4 — all config lives in `globals.css` via `@theme {}`. No `tailwind.config.ts`.
