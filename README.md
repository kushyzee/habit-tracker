# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built as a technical
translation task from a formal requirements document. The focus is on implementation
precision, deterministic behavior, and comprehensive test coverage.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **Persistence:** localStorage (no backend)
- **Unit/Integration Tests:** Vitest + React Testing Library
- **E2E Tests:** Playwright

---

## Project Structure

```text
habit-tracker/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Splash/boot route (/)
│   │   ├── login/            # /login
│   │   ├── signup/           # /signup
│   │   └── dashboard/        # /dashboard (protected)
│   ├── components/
│   │   ├── auth/             # LoginForm, SignupForm
│   │   ├── habits/           # HabitCard, HabitForm, HabitList
│   │   └── shared/           # SplashScreen, ProtectedRoute, FormField, ServiceWorkerRegistration
│   ├── lib/                  # Pure utility functions
│   │   ├── auth.ts           # signUp, logIn, logOut, getCurrentSession
│   │   ├── habits.ts         # toggleHabitCompletion
│   │   ├── storage.ts        # localStorage read/write helpers
│   │   ├── streaks.ts        # calculateCurrentStreak
│   │   ├── slug.ts           # getHabitSlug
│   │   ├── validators.ts     # validateHabitName
│   │   └── constants.ts      # localStorage key constants
│   └── types/                # TypeScript type contracts
│       ├── auth.ts           # User, Session
│       └── habit.ts          # Habit
│   └── utils/                # utils functions
│       └── idGenerator.ts    # ID generator
├── public/
│   ├── icons/                # PWA icons (192x192, 512x512)
│   ├── manifest.json         # Web app manifest
│   └── sw.js                 # Service worker
└── tests/
    ├── unit/                 # Vitest unit tests
    ├── integration/          # React Testing Library tests
    └── e2e/                  # Playwright end-to-end tests
```

---

## Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Install dependencies

```bash
npm install
```

### Install Playwright browsers

```bash
npx playwright install --with-deps chromium
```

If you encounter missing system dependencies on Linux:

```bash
npx playwright install-deps chromium
```

---

## Running the App

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production build

```bash
npm run build
npm run start
```

---

## Running the Tests

### All tests

```bash
npm test
```

### Unit tests only (with coverage)

```bash
npm run test:unit
```

### Integration tests only

```bash
npm run test:integration
```

### E2E tests only

```bash
npm run test:e2e
```

> The E2E tests require the dev server. Playwright starts it automatically
> via `webServer` in `playwright.config.ts`. If you prefer to start it
> manually, run `npm run dev` in a separate terminal first.

### Coverage report

Generated with `npm run test:unit`. Minimum threshold: 80% line coverage for `src/lib/`.

```bash
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s

-------------------|---------|----------|---------|---------|-------------------
All files | 92.18 | 90 | 88.23 | 91.93 |
auth.ts | 88.88 | 100 | 66.66 | 87.5 | 42-46
constants.ts | 100 | 100 | 100 | 100 |
habits.ts | 100 | 100 | 100 | 100 |
slug.ts | 100 | 100 | 100 | 100 |
storage.ts | 85.71 | 75 | 100 | 85.71 | 7,24,41
streaks.ts | 100 | 100 | 100 | 100 |
validators.ts | 100 | 100 | 100 | 100 |
----------------------|---------|----------|---------|---------|-------------------
```

## Local Persistence Structure

All data is stored in the browser's `localStorage` under three keys:

### `habit-tracker-users`

A JSON array of registered users.

```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "password": "plaintext",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

> Note: Passwords are stored in plaintext. This is an intentional trade-off
> for this stage, the spec requires no external auth service and no backend.
> In a production system, passwords would be hashed (e.g. bcrypt).

### `habit-tracker-session`

The currently active session, or `null` when logged out.

```json
{
  "userId": "uuid",
  "email": "user@example.com"
}
```

### `habit-tracker-habits`

A JSON array of all habits across all users. Each habit belongs to a user
via `userId`. The dashboard filters to show only the logged-in user's habits.

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Drink Water",
    "description": "Stay hydrated",
    "frequency": "daily",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "completions": ["2026-04-25", "2026-04-24"]
  }
]
```

Completion dates are stored as `YYYY-MM-DD` strings. Duplicates are
prevented at the `toggleHabitCompletion` utility level.

---

## PWA Support

The app is installable as a Progressive Web App.

### How it works

1. **`public/manifest.json`**: Declares the app name, icons, colors, and
   `display: standalone` so it launches without browser chrome when installed.

2. **`public/sw.js`**: A service worker using a **network-first** strategy:
   - On install: caches the app shell (routes + manifest)
   - On fetch: tries the network first, falls back to cache on failure
   - On activate: removes stale caches from previous versions

3. **`ServiceWorkerRegistration`**: A client component in the root layout
   that registers `sw.js` on mount. Registration is skipped silently in
   environments where `serviceWorker` is not supported.

### Offline behavior

After the app has been loaded at least once, the cached app shell renders
without a hard crash when the device is offline. Full data access requires
an active connection since localStorage is read client-side on load.

### Installing the app

In Chrome: visit the app URL and click the install icon in the address bar.
On mobile: use "Add to Home Screen" from the browser menu.

---

## Trade-offs and Limitations

| Area        | Decision                                   | Reason                                                                   |
| ----------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| Auth        | Local only, plaintext passwords            | No backend permitted by spec                                             |
| Persistence | localStorage                               | Required by spec; resets per browser/device                              |
| Frequency   | Daily only                                 | Spec explicitly limits to daily for this stage                           |
| Offline     | App shell only                             | Full offline data sync requires a backend                                |
| PWA icons   | Generated programmatically                 | No design assets provided                                                |
| Routing     | `window.location.href` for splash redirect | More reliable than `router.replace()` for Playwright navigation tracking |

---

## Test File Map

Each required test file and what it verifies:

### `tests/unit/slug.test.ts`

Verifies `getHabitSlug` from `src/lib/slug.ts`:

- Converts habit names to lowercase hyphenated slugs
- Trims and collapses whitespace
- Removes non-alphanumeric characters except hyphens

### `tests/unit/validators.test.ts`

Verifies `validateHabitName` from `src/lib/validators.ts`:

- Rejects empty names
- Rejects names longer than 60 characters
- Returns trimmed value for valid names

### `tests/unit/streaks.test.ts`

Verifies `calculateCurrentStreak` from `src/lib/streaks.ts`:

- Returns 0 for empty completions
- Returns 0 when today is not completed
- Counts consecutive days correctly
- Handles duplicate completion dates
- Breaks streak on missing days

### `tests/unit/habits.test.ts`

Verifies `toggleHabitCompletion` from `src/lib/habits.ts`:

- Adds a date when not present
- Removes a date when already present
- Does not mutate the original habit object
- Does not produce duplicate completion dates

### `tests/integration/auth-flow.test.tsx`

Verifies the auth components (`LoginForm`, `SignupForm`) rendered in isolation:

- Signup form creates a session in localStorage
- Duplicate email signup shows the correct error message
- Login form stores the active session in localStorage
- Invalid credentials show the correct error message

### `tests/integration/habit-form.test.tsx`

Verifies habit components (`HabitForm`, `HabitCard`, `HabitList`) rendered in isolation:

- Empty name shows a validation error
- Valid submission renders the habit in the list
- Edit preserves immutable fields (id, userId, createdAt, completions)
- Delete requires explicit confirmation before firing
- Completion toggle updates the streak display immediately

### `tests/e2e/app.spec.ts`

Full browser tests verifying the complete user journey:

- Splash screen shows and redirects unauthenticated users to `/login`
- Authenticated users redirect from `/` to `/dashboard`
- Unauthenticated access to `/dashboard` redirects to `/login`
- Signup lands the user on the dashboard
- Login loads only the logged-in user's habits
- Habit creation from the dashboard
- Habit completion updates the streak display
- Session and habits persist after page reload
- Logout clears the session and redirects to `/login`
- Cached app shell renders offline after first load
