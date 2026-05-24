## Context

The project is a Laravel 13 + Vue 3 SPA with Sanctum cookie-based auth, 3 roles (superadmin/admin/user), and permission-based routing guards. Backend tests (Pest) cover API logic, but no browser-level tests exist. The manual verification matrix from the roles restructure had 20+ items that required clicking through the browser — this needs automation.

Key constraints:
- Auth uses Sanctum stateful cookies (not tokens) — Playwright must handle CSRF + session cookies
- The SPA is served via a single catch-all route — Playwright tests all Vue Router pages
- Three distinct role personas with different access levels
- SQLite database — fast `migrate:fresh --seed` (~3s) for deterministic state
- Frontend builds with `npm run build` (production bundle, no HMR needed for E2E)
- Project already has `tests/` with `Feature/` and `Unit/` for Pest

## Goals / Non-Goals

**Goals:**
- Playwright E2E test infrastructure ready to run with one command
- Auth setup with `storageState` per role (login once, reuse across tests)
- Deterministic DB state via `migrate:fresh --seed` in global setup
- Tests covering the full verification matrix: guest flows, login, register, role-based access, admin panel guards
- CI-ready via `webServer` config (auto-starts `php artisan serve`)
- Chromium-only for MVP (add Firefox/WebKit later if needed)

**Non-Goals:**
- Visual regression testing (screenshots comparison) — not needed yet
- API-only tests via Playwright (Pest already covers this)
- Mobile viewport testing — defer to later
- Page Object Model classes — start simple, add when test count > 20
- Testing third-party behavior (mail delivery, etc.)

## Decisions

### 1. Test location: `tests/e2e/` (not root `e2e/`)

All tests in the `tests/` directory for consistency with existing Pest structure. Playwright config lives inside `tests/e2e/` to keep project root clean.

**Alternatives considered:**
- Root `e2e/` folder — common in frontend-only projects but inconsistent with our Laravel `tests/` convention
- `tests/Browser/` — Laravel Dusk naming; confusing since we're not using Dusk

### 2. Project dependencies for auth setup (not `globalSetup`)

Use Playwright's project dependencies feature:
- `global-setup` project → seeds DB
- `auth-setup` project → logs in each role, saves storageState
- Role-specific projects depend on `auth-setup`

**Why:** Project deps show up in HTML report + trace viewer, unlike `globalSetup` which runs outside the test runner.

### 3. StorageState per role (not login in every test)

Save authenticated state to `tests/e2e/.auth/<role>.json` after one login per role. All subsequent tests load this state directly — no repeated login flows.

**Why:** Login involves CSRF fetch + POST + session cookie. Doing this per test adds ~500ms per test and creates unnecessary load.

### 4. `migrate:fresh --seed` in global setup (not per-test reset)

Run one fresh seed before all tests. Tests do not mutate critical state (all are read-only navigations and UI checks). If future tests need mutations, we'll add per-test API resets.

**Why:** Our E2E tests verify navigation guards, permission visibility, and page rendering — not data mutations. One clean seed is sufficient and fast.

### 5. WebServer config with `reuseExistingServer`

```typescript
webServer: {
  command: 'php artisan serve --host=127.0.0.1 --port=8765',
  url: 'http://127.0.0.1:8765',
  reuseExistingServer: !process.env.CI,
  timeout: 30000,
}
```

**Why:** Local dev uses Laragon (already running at `laravel-vue-starter.test`), so `reuseExistingServer: true` skips spawning a server. CI needs its own server via `artisan serve`. Port 8765 avoids conflicts with common dev ports.

### 6. Test grouping: by role context (not by page)

```
tests/
├── auth/           # Guest flows (login, register, forgot-password)
├── guest/          # Unauthenticated navigation guards
├── user/           # User role behavior
├── admin/          # Admin role behavior
└── superadmin/     # Superadmin role behavior
```

**Why:** Each role has a different `storageState` and different expectations. Grouping by role makes project configuration clean and allows running a subset (`--project=admin`).

### 7. `npm run build` before test run (not Vite dev server)

The global setup runs `npm run build` to generate production assets. Tests hit the built app, not the Vite dev server.

**Why:** Production build is deterministic. Vite HMR adds WebSocket connections and timing unpredictability. We want tests to verify the deployed experience.

## Risks / Trade-offs

- **[Trade-off] Chromium-only for now** — faster CI, but may miss browser-specific bugs. → Add Firefox/WebKit as separate projects later.
- **[Trade-off] No per-test DB reset** — if future tests mutate data, earlier tests may affect later ones within a run. → Mitigate by writing read-only E2E tests (mutations tested in Pest).
- **[Risk] Laragon URL vs artisan serve URL** — `baseURL` must match the running server. → `reuseExistingServer` + correct `baseURL` for each environment.
- **[Risk] CI environment needs PHP + Node + browsers** — heavier CI image. → Use `npx playwright install chromium --with-deps` to install only what's needed.
- **[Trade-off] `npm run build` adds ~10s to test setup** — acceptable for deterministic state, and build is cached if unchanged.

## New Files

```
tests/e2e/
├── playwright.config.ts
├── global.setup.ts
├── auth.setup.ts
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── register.spec.ts
│   │   └── forgot-password.spec.ts
│   ├── guest/
│   │   └── navigation-guards.spec.ts
│   ├── user/
│   │   ├── home.spec.ts
│   │   └── profile.spec.ts
│   ├── admin/
│   │   ├── dashboard.spec.ts
│   │   └── restricted-pages.spec.ts
│   └── superadmin/
│       ├── dashboard.spec.ts
│       └── admin-pages.spec.ts
└── .auth/
    └── .gitkeep
```

## Modified Files

- `package.json` — add `@playwright/test` dev dependency + scripts
- `.gitignore` — add `tests/e2e/.auth/` exclusion
