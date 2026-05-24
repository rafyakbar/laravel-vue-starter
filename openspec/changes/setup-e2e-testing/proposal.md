## Why

The project has comprehensive backend tests (73 Pest tests covering auth, CRUD, authorization), but **zero browser-level end-to-end tests**. The manual verification matrix from the roles restructure (20+ items testing login redirects, permission guards, sidebar visibility per role) had to be checked by hand. This is:

1. **Time-consuming** — manual browser testing for every change is not sustainable
2. **Error-prone** — human verification misses edge cases (e.g., race conditions between `fetchUser()` and router guards)
3. **Not CI-friendly** — cannot automate the verification matrix in a pipeline

Playwright provides cross-browser E2E testing with auto-waiting, cookie/session support (critical for Sanctum), and project-based auth state management — fitting perfectly for our multi-role SPA architecture.

## What Changes

- Install `@playwright/test` as a dev dependency
- Create `tests/e2e/` directory structure with config, setup files, and test specs
- Add global setup that runs `php artisan migrate:fresh --seed` for deterministic state
- Add auth setup that authenticates as each role (superadmin, admin, user) and saves `storageState`
- Write E2E tests covering:
  - Guest flows: login (valid/invalid), register, forgot password, navigation guards
  - User role: home page UI, profile access, admin restriction
  - Admin role: dashboard access, restricted pages redirect, sidebar filtering
  - Superadmin role: full admin access, users/roles pages
- Add npm scripts for running E2E tests (`test:e2e`, `test:e2e:ui`, `test:e2e:debug`)
- Add `tests/e2e/.auth/` to `.gitignore`
- Configure `webServer` to use `php artisan serve` for CI environments

## Capabilities

### New Capabilities

- `e2e-testing`: Playwright E2E test infrastructure including configuration, auth setup with storageState per role, global database seeding, and browser tests covering guest auth flows, per-role navigation guards, admin panel permission-based access, **sidebar collapse/expand functionality, collapsed sidebar navigation with tooltips and dropdown menus, theme switching, and language switching**

### Modified Capabilities

(none — this adds a new testing layer without changing existing behavior or specs)

## Impact

- **New files**: `tests/e2e/` directory (~15-20 files: config, setup, fixtures, test specs)
- **Modified files**: `package.json` (new dev dependency + scripts), `.gitignore` (auth state exclusion)
- **Dependencies**: `@playwright/test` ^1.60.x (dev only)
- **No backend code changes** — tests interact with the existing app as-is
- **No frontend code changes** — tests use the built production bundle
- **CI consideration**: Tests require `npm run build` + `php artisan serve` running. WebServer config handles this automatically.
