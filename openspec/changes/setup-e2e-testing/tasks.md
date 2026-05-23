## 1. Install Playwright & Project Configuration

- [x] 1.1 Install `@playwright/test` as dev dependency: `npm install -D @playwright/test@^1.60`
- [x] 1.2 Install Chromium browser binary: `npx playwright install chromium`
- [x] 1.3 Create `tests/e2e/playwright.config.ts` with:
  - Projects: `global-setup`, `auth-setup`, `guest`, `user`, `admin`, `superadmin`
  - `webServer`: `php artisan serve --host=127.0.0.1 --port=8765`, `reuseExistingServer: !process.env.CI`
  - `use`: `baseURL: 'http://127.0.0.1:8765'`, `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`
  - Guest project uses `storageState: { cookies: [], origins: [] }` (explicitly unauthenticated)
  - User/admin/superadmin projects use their respective `.auth/<role>.json` storageState
  - Project dependencies chain: `global-setup` → `auth-setup` → role projects
- [x] 1.4 Add npm scripts to `package.json`:
  - `"test:e2e": "npx playwright test --config=tests/e2e/playwright.config.ts"`
  - `"test:e2e:ui": "npx playwright test --config=tests/e2e/playwright.config.ts --ui"`
  - `"test:e2e:headed": "npx playwright test --config=tests/e2e/playwright.config.ts --headed"`
- [x] 1.5 Add to `.gitignore`: `tests/e2e/.auth/`, `test-results/`, `playwright-report/`, `blob-report/`
- [x] 1.6 Create `tests/e2e/.auth/.gitkeep` to preserve directory in git
- [x] 1.7 Verify config is valid: `npx playwright test --config=tests/e2e/playwright.config.ts --list`

## 2. Global Setup — Database Seed & Build

- [x] 2.1 Create `tests/e2e/global.setup.ts` that runs:
  - `php artisan migrate:fresh --seed --no-interaction` (via `execSync`)
  - `npm run build` (via `execSync`)
- [x] 2.2 Verify global setup works: `npx playwright test --config=tests/e2e/playwright.config.ts --project=global-setup`

## 3. Auth Setup — StorageState per Role

- [x] 3.1 Create `tests/e2e/auth.setup.ts` with three setup tests:
  - `authenticate as superadmin`:
    - `page.goto('/login')`
    - `page.getByLabel('Email or Username').fill('superadmin')`
    - `page.getByLabel('Password').fill('123123')`
    - `page.getByRole('button', { name: 'Sign In' }).click()`
    - `page.waitForURL('**/admin**')`
    - Save storageState to `tests/e2e/.auth/superadmin.json`
  - `authenticate as admin`:
    - Same flow with username `admin`, password `123123`
    - Wait for URL `**/admin**`
    - Save to `tests/e2e/.auth/admin.json`
  - `authenticate as user`:
    - `page.goto('/register')`
    - `page.getByLabel('Name').fill('E2E User')`
    - `page.getByLabel('Username').fill('e2e_user')`
    - `page.getByLabel('Email').fill('e2e_user@example.com')`
    - `page.getByLabel('Password', { exact: true }).fill('password123')`
    - `page.getByLabel('Confirm Password').fill('password123')`
    - `page.getByRole('button', { name: 'Create Account' }).click()`
    - `page.waitForURL('/')`  (exactly home, not /admin)
    - Save to `tests/e2e/.auth/user.json`
- [x] 3.2 Verify auth setup works: `npx playwright test --config=tests/e2e/playwright.config.ts --project=auth-setup`
- [x] 3.3 Verify `.auth/` files created: `superadmin.json`, `admin.json`, `user.json` exist

## 4. Guest Tests — Auth Flow (Login)

**Important**: Use exact label names from Vue components. Login form labels: "Email or Username", "Password". Button: "Sign In".

- [x] 4.1 Create `tests/e2e/tests/auth/login.spec.ts`:
  - Test: `shows login form with correct elements` — heading "Sign In", label "Email or Username", label "Password", button "Sign In", link "Forgot your password?", link "Sign up", link "← Back to home"
  - Test: `login with valid superadmin credentials redirects to /admin` — fill "Email or Username" with `superadmin`, fill "Password" with `123123`, click "Sign In", expect URL matches `/admin`
  - Test: `login with valid admin credentials redirects to /admin` — fill with `admin` / `123123`, expect URL `/admin`
  - Test: `login with invalid credentials shows validation error` — fill with `superadmin` / `wrongpassword`, click "Sign In", expect error message visible on page (FormMessage shows server 422 error)
  - Test: `login with empty fields shows client-side validation` — click "Sign In" immediately, expect text "Email or username is required" visible
  - Test: `login page has link to register` — link with text "Sign up" is visible and points to `/register`
  - Test: `login page has link to forgot password` — link with text "Forgot your password?" is visible
- [x] 4.2 Run: `npx playwright test --config=tests/e2e/playwright.config.ts --project=guest tests/e2e/tests/auth/login.spec.ts`

## 5. Guest Tests — Auth Flow (Register)

**Important**: Register form labels: "Name", "Username", "Email", "Password", "Confirm Password". Button: "Create Account".

- [x] 5.1 Create `tests/e2e/tests/auth/register.spec.ts`:
  - Test: `shows registration form with correct elements` — heading "Create Account", labels "Name"/"Username"/"Email"/"Password"/"Confirm Password", button "Create Account", link "Sign in", link "← Back to home"
  - Test: `registration with valid data redirects to home` — fill all fields with unique values, click "Create Account", expect URL is `/`
  - Test: `registration with duplicate email shows error` — use `superadmin@example.com` (exists in seed), expect email validation error
  - Test: `registration with empty fields shows client-side validation` — click "Create Account" without filling, expect "Name is required" visible
  - Test: `registration with short password shows validation` — fill password with "short", expect "Password must be at least 8 characters"
  - Test: `register page has link to login` — link "Sign in" visible
- [x] 5.2 Run: `npx playwright test --config=tests/e2e/playwright.config.ts --project=guest tests/e2e/tests/auth/register.spec.ts`

## 6. Guest Tests — Auth Flow (Forgot Password)

**Important**: Form label: "Email". Button: "Send Reset Link". Success message includes "password reset link".

- [x] 6.1 Create `tests/e2e/tests/auth/forgot-password.spec.ts`:
  - Test: `shows forgot password form` — heading "Forgot Password", label "Email", button "Send Reset Link", link "Back to sign in"
  - Test: `submitting registered email shows success message` — fill "Email" with `superadmin@example.com`, click "Send Reset Link", expect text containing "password reset link" visible
  - Test: `submitting unregistered email shows validation error` — fill "Email" with `nonexistent@example.com`, click "Send Reset Link", expect error message visible
  - Test: `submitting empty email shows client-side validation` — click button without filling, expect "Email is required"
  - Test: `has link back to sign in` — link "Back to sign in" visible and navigates to `/login`
- [x] 6.2 Run: `npx playwright test --config=tests/e2e/playwright.config.ts --project=guest tests/e2e/tests/auth/forgot-password.spec.ts`

## 7. Guest Tests — Navigation Guards

- [x] 7.1 Create `tests/e2e/tests/guest/navigation-guards.spec.ts`:
  - Test: `home page shows Sign In and Sign Up for guests` — visit `/`, expect buttons "Sign In" and "Sign Up" visible
  - Test: `visiting /admin redirects to login with redirect param` — visit `/admin`, expect URL contains `/login` and query has `redirect`
  - Test: `visiting /profile redirects to login with redirect param` — visit `/profile`, expect URL contains `/login` and query has `redirect`
  - Test: `visiting /admin/users redirects to login` — visit `/admin/users`, expect URL contains `/login`
  - Test: `visiting /admin/roles redirects to login` — visit `/admin/roles`, expect URL contains `/login`
  - Test: `visiting /login shows login form` — visit `/login`, expect heading "Sign In" visible
  - Test: `visiting /register shows register form` — visit `/register`, expect heading "Create Account" visible
  - Test: `visiting /forgot-password shows forgot password form` — visit `/forgot-password`, expect heading "Forgot Password" visible
  - Test: `visiting /reset-password shows reset form` — visit `/reset-password`, expect heading "Reset Password" visible
- [x] 7.2 Run: `npx playwright test --config=tests/e2e/playwright.config.ts --project=guest tests/e2e/tests/guest/`

## 8. User Role Tests — Home & Navigation

- [x] 8.1 Create `tests/e2e/tests/user/home.spec.ts`:
  - Test: `home page shows Profile and Sign Out but NOT Go to Admin` — visit `/`, expect button "Profile" visible, button "Sign Out" visible, button "Go to Admin" NOT visible
  - Test: `home page shows user avatar and name` — expect avatar initials visible and user name displayed
  - Test: `can sign out from home` — click "Sign Out", expect "Sign In" button appears (logged out state)
- [x] 8.2 Create `tests/e2e/tests/user/profile.spec.ts`:
  - Test: `can access /profile page` — visit `/profile`, expect heading "Profile" visible
  - Test: `profile renders in DefaultLayout (no admin sidebar)` — visit `/profile`, expect sidebar NOT visible (no "Dashboard" nav link present)
  - Test: `profile shows user name and email` — expect user name and email displayed
  - Test: `profile shows role badge` — expect badge "user" visible
- [x] 8.3 Create `tests/e2e/tests/user/restricted.spec.ts`:
  - Test: `visiting /admin redirects to home` — visit `/admin`, expect URL is `/`
  - Test: `visiting /admin/users redirects to home` — visit `/admin/users`, expect URL is `/`
  - Test: `visiting /admin/roles redirects to home` — visit `/admin/roles`, expect URL is `/`
  - Test: `visiting /login redirects to home (guest page guard)` — visit `/login`, expect URL is `/` (authenticated users cannot see guest pages)
  - Test: `visiting /register redirects to home` — visit `/register`, expect URL is `/`
  - Test: `visiting /forgot-password redirects to home` — visit `/forgot-password`, expect URL is `/`
- [x] 8.4 Run: `npx playwright test --config=tests/e2e/playwright.config.ts --project=user`

## 9. Admin Role Tests — Dashboard & Sidebar

- [x] 9.1 Create `tests/e2e/tests/admin/dashboard.spec.ts`:
  - Test: `can access /admin dashboard` — visit `/admin`, expect text "Dashboard" visible in breadcrumb or content
  - Test: `dashboard shows welcome message with name` — expect text containing "Hello" and admin user name
  - Test: `sidebar shows Dashboard nav item` — expect link "Dashboard" in sidebar
  - Test: `sidebar does NOT show Settings group` — expect text "Settings" NOT visible in sidebar (admin lacks `view-users`)
  - Test: `sidebar shows Site link` — expect link "Site" visible in sidebar
  - Test: `home page shows Go to Admin + Profile + Sign Out` — visit `/`, expect "Go to Admin", "Profile", "Sign Out" buttons
- [x] 9.2 Create `tests/e2e/tests/admin/restricted-pages.spec.ts`:
  - Test: `visiting /admin/users redirects to /admin dashboard` — visit `/admin/users`, expect URL matches `/admin` (dashboard redirect, not home)
  - Test: `visiting /admin/roles redirects to /admin dashboard` — visit `/admin/roles`, expect URL matches `/admin`
  - Test: `profile renders inside AdminLayout (sidebar visible)` — visit `/profile`, expect "Dashboard" nav link visible (in sidebar)
  - Test: `visiting /login redirects to admin dashboard (guest page guard)` — visit `/login`, expect URL matches `/admin`
  - Test: `visiting /register redirects to admin dashboard` — visit `/register`, expect URL matches `/admin`
  - Test: `visiting /forgot-password redirects to admin dashboard` — visit `/forgot-password`, expect URL matches `/admin`
- [x] 9.3 Run: `npx playwright test --config=tests/e2e/playwright.config.ts --project=admin`

## 10. Superadmin Role Tests — Full Access

- [x] 10.1 Create `tests/e2e/tests/superadmin/dashboard.spec.ts`:
  - Test: `can access /admin dashboard` — visit `/admin`, expect "Dashboard" content visible
  - Test: `dashboard shows welcome message with superadmin name` — expect "Hello" + superadmin name
  - Test: `sidebar shows Settings group with Users and Roles & Permissions` — expect "Settings" visible, click to expand, expect "Users" and "Roles & Permissions" links visible
  - Test: `sidebar shows Site link` — expect "Site" link visible
  - Test: `home page shows Go to Admin + Profile + Sign Out` — visit `/`, expect all three buttons
- [x] 10.2 Create `tests/e2e/tests/superadmin/admin-pages.spec.ts`:
  - Test: `can access /admin/users page` — visit `/admin/users`, expect URL stays at `/admin/users`, expect page content visible (e.g., "Users" heading or "Coming Soon" badge)
  - Test: `can access /admin/roles page` — visit `/admin/roles`, expect URL stays at `/admin/roles`, expect "Roles & Permissions" content
  - Test: `profile renders inside AdminLayout (sidebar visible)` — visit `/profile`, expect sidebar nav visible
  - Test: `visiting /login redirects to admin dashboard (guest page guard)` — visit `/login`, expect URL matches `/admin`
  - Test: `visiting /register redirects to admin dashboard` — visit `/register`, expect URL matches `/admin`
  - Test: `visiting /forgot-password redirects to admin dashboard` — visit `/forgot-password`, expect URL matches `/admin`
- [x] 10.3 Run: `npx playwright test --config=tests/e2e/playwright.config.ts --project=superadmin`

## 11. Language Switching Tests (i18n)

Language switching is available in the admin header via a Languages icon dropdown with "English" / "Indonesia" options. Locale persists via localStorage.

- [x] 11.1 Create `tests/e2e/tests/admin/language.spec.ts` (uses admin storageState):
  - Test: `admin panel defaults to English` — visit `/admin`, expect "Dashboard" text visible in sidebar/breadcrumb
  - Test: `switching to Indonesian changes nav labels` — click Languages icon button (sr-only text "Language"), select "Indonesia", expect sidebar text "Dasbor" visible instead of "Dashboard"
  - Test: `switching to Indonesian changes page content` — after switch, expect dashboard description contains "Selamat datang" (not "Welcome")
  - Test: `switching back to English restores labels` — select "English" ("Inggris" in ID), expect "Dashboard" visible again
  - Test: `language persists after page reload` — switch to Indonesian, reload page, expect "Dasbor" still visible
- [x] 11.2 Create `tests/e2e/tests/superadmin/language.spec.ts` (uses superadmin storageState):
  - Test: `sidebar Settings group shows Indonesian labels after switch` — switch to Indonesian, expect "Pengaturan" (Settings), "Pengguna" (Users), "Peran & Izin" (Roles & Permissions)
  - Test: `home page shows Indonesian buttons after switch` — visit `/`, expect "Buka Admin" (Go to Admin), "Profil" (Profile), "Keluar" (Sign Out)
- [x] 11.3 Run: `npx playwright test --config=tests/e2e/playwright.config.ts tests/e2e/tests/admin/language.spec.ts tests/e2e/tests/superadmin/language.spec.ts`

## 12. Theme Switching Tests (Dark Mode)

Theme switching is available in admin header via SunMoon icon dropdown with "Light"/"Dark"/"System" options.

- [x] 12.1 Create `tests/e2e/tests/admin/theme.spec.ts` (uses admin storageState):
  - Test: `switching to dark mode adds dark class to html` — click Theme icon button, select "Dark", expect `document.documentElement` has class `dark`
  - Test: `switching to light mode removes dark class` — select "Light", expect `html` does NOT have class `dark`
  - Test: `theme persists after page reload` — switch to dark, reload, expect `dark` class still present
- [x] 12.2 Run: `npx playwright test --config=tests/e2e/playwright.config.ts tests/e2e/tests/admin/theme.spec.ts`

## 13. Full Suite Verification

- [x] 13.1 Run the complete E2E suite: `npm run test:e2e` — all tests pass
- [x] 13.2 Verify HTML report: `npx playwright show-report` (manual check)
- [x] 13.3 Count total tests — expect approximately 60+ test cases across all projects
