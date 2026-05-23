## ADDED Requirements

### Requirement: Playwright E2E test infrastructure
The system SHALL provide a Playwright-based end-to-end test setup at `tests/e2e/` with configuration, global setup, and authentication setup supporting all three user roles.

#### Scenario: Playwright config exists and is valid
- **WHEN** `npx playwright test --config=tests/e2e/playwright.config.ts --list` is executed
- **THEN** the command exits with code 0 and lists available test files

#### Scenario: Global setup seeds fresh database
- **WHEN** the global setup project runs before all tests
- **THEN** `php artisan migrate:fresh --seed` is executed, producing a deterministic database state with superadmin, admin, and 20 user-role accounts

#### Scenario: Global setup builds frontend assets
- **WHEN** the global setup project runs before all tests
- **THEN** `npm run build` is executed, producing production-ready frontend assets

#### Scenario: Web server starts automatically in CI
- **WHEN** tests run in a CI environment (no existing server)
- **THEN** Playwright starts `php artisan serve` automatically via the `webServer` config and waits until it responds

### Requirement: Authentication setup with storageState per role
The system SHALL provide an auth setup that authenticates as each role via the browser login flow and persists session state to reusable JSON files.

#### Scenario: Superadmin authentication state is saved
- **WHEN** the auth setup project runs
- **THEN** a browser logs in as superadmin (username `superadmin`, password `123123`) and saves storageState to `tests/e2e/.auth/superadmin.json`

#### Scenario: Admin authentication state is saved
- **WHEN** the auth setup project runs
- **THEN** a browser logs in as admin (username `admin`, password `123123`) and saves storageState to `tests/e2e/.auth/admin.json`

#### Scenario: User authentication state is saved via registration
- **WHEN** the auth setup project runs
- **THEN** a browser registers a new account (name, username, email, password) and saves storageState to `tests/e2e/.auth/user.json`

#### Scenario: Auth state files are gitignored
- **WHEN** checking `.gitignore`
- **THEN** the path `tests/e2e/.auth/` is excluded from version control

### Requirement: Guest login flow E2E tests
The system SHALL include E2E tests verifying the login page UI and authentication behavior for guests. Form labels: "Email or Username", "Password". Button: "Sign In".

#### Scenario: Login page displays correct form elements
- **WHEN** a guest visits `/login`
- **THEN** the heading "Sign In" is visible, labels "Email or Username" and "Password" exist, the "Sign In" button is visible, and links to "Forgot your password?", "Sign up", and "← Back to home" are present

#### Scenario: Login with valid superadmin credentials redirects to /admin
- **WHEN** a guest fills "Email or Username" with `superadmin`, "Password" with `123123`, and clicks "Sign In"
- **THEN** the browser URL becomes `/admin`

#### Scenario: Login with valid admin credentials redirects to /admin
- **WHEN** a guest fills "Email or Username" with `admin`, "Password" with `123123`, and clicks "Sign In"
- **THEN** the browser URL becomes `/admin`

#### Scenario: Login with invalid credentials shows server validation error
- **WHEN** a guest fills incorrect credentials and clicks "Sign In"
- **THEN** a validation error message is displayed on the page

#### Scenario: Login with empty fields shows client-side validation
- **WHEN** a guest clicks "Sign In" without filling any fields
- **THEN** the text "Email or username is required" is displayed

#### Scenario: Login page links to register and forgot password
- **WHEN** the login page is rendered
- **THEN** a link with text "Sign up" and a link with text "Forgot your password?" are visible

### Requirement: Guest registration flow E2E tests
The system SHALL include E2E tests verifying the registration page UI and account creation. Form labels: "Name", "Username", "Email", "Password", "Confirm Password". Button: "Create Account".

#### Scenario: Registration page displays correct form elements
- **WHEN** a guest visits `/register`
- **THEN** the heading "Create Account" is visible, all 5 form labels exist, the "Create Account" button is visible, and a "Sign in" link is present

#### Scenario: Registration with valid data redirects to home
- **WHEN** a guest fills all fields with valid unique data and clicks "Create Account"
- **THEN** the browser URL becomes `/`

#### Scenario: Registration with duplicate email shows error
- **WHEN** a guest fills the email field with an already-existing email and submits
- **THEN** an email validation error is displayed

#### Scenario: Registration with empty fields shows client-side validation
- **WHEN** a guest clicks "Create Account" without filling fields
- **THEN** the text "Name is required" is displayed

#### Scenario: Registration with short password shows validation
- **WHEN** a guest fills password with fewer than 8 characters
- **THEN** the text "Password must be at least 8 characters" is displayed

### Requirement: Guest forgot-password flow E2E tests
The system SHALL include E2E tests verifying the forgot password page. Form label: "Email". Button: "Send Reset Link".

#### Scenario: Forgot password page displays correct form elements
- **WHEN** a guest visits `/forgot-password`
- **THEN** heading "Forgot Password", label "Email", button "Send Reset Link", and link "Back to sign in" are visible

#### Scenario: Submitting registered email shows success
- **WHEN** a guest fills "Email" with a registered email and clicks "Send Reset Link"
- **THEN** a success message containing "password reset link" is displayed

#### Scenario: Submitting unregistered email shows error
- **WHEN** a guest fills "Email" with a non-existent email and clicks "Send Reset Link"
- **THEN** a validation error is displayed

#### Scenario: Submitting empty email shows client-side validation
- **WHEN** a guest clicks "Send Reset Link" without filling the email
- **THEN** the text "Email is required" is displayed

### Requirement: Guest navigation guard E2E tests
The system SHALL include E2E tests verifying that unauthenticated users are redirected from protected routes and can access all guest-only pages.

#### Scenario: Home page shows Sign In and Sign Up for guests
- **WHEN** an unauthenticated user visits `/`
- **THEN** buttons "Sign In" and "Sign Up" are visible

#### Scenario: Visiting /admin redirects to login
- **WHEN** an unauthenticated user visits `/admin`
- **THEN** the URL changes to `/login` with a `redirect` query parameter

#### Scenario: Visiting /profile redirects to login
- **WHEN** an unauthenticated user visits `/profile`
- **THEN** the URL changes to `/login` with a `redirect` query parameter

#### Scenario: Visiting /admin/users redirects to login
- **WHEN** an unauthenticated user visits `/admin/users`
- **THEN** the URL changes to `/login`

#### Scenario: Visiting /admin/roles redirects to login
- **WHEN** an unauthenticated user visits `/admin/roles`
- **THEN** the URL changes to `/login`

#### Scenario: All guest pages are accessible
- **WHEN** an unauthenticated user visits `/login`, `/register`, `/forgot-password`, or `/reset-password`
- **THEN** each page renders its respective heading without redirect

### Requirement: User role E2E tests
The system SHALL include E2E tests verifying behavior for authenticated users with the `user` role, including access restrictions and guest-page guards.

#### Scenario: User home page shows correct buttons
- **WHEN** a user visits `/`
- **THEN** "Profile" and "Sign Out" are visible, but "Go to Admin" is NOT visible

#### Scenario: User can access /profile in DefaultLayout
- **WHEN** a user visits `/profile`
- **THEN** the profile page renders without the admin sidebar

#### Scenario: User visiting /admin is redirected to home
- **WHEN** a user visits `/admin`
- **THEN** the URL becomes `/`

#### Scenario: User visiting /admin/users is redirected to home
- **WHEN** a user visits `/admin/users`
- **THEN** the URL becomes `/`

#### Scenario: User visiting guest pages is redirected to home
- **WHEN** a user visits `/login`, `/register`, or `/forgot-password`
- **THEN** the URL becomes `/` (guest pages are blocked for authenticated users)

#### Scenario: User can sign out
- **WHEN** a user clicks "Sign Out"
- **THEN** the page shows "Sign In" and "Sign Up" (unauthenticated state)

### Requirement: Admin role E2E tests
The system SHALL include E2E tests verifying behavior for authenticated users with the `admin` role, including sidebar filtering, restricted page redirects, and guest-page guards.

#### Scenario: Admin can access dashboard
- **WHEN** admin visits `/admin`
- **THEN** the dashboard page renders with welcome message

#### Scenario: Admin sidebar does NOT show Settings group
- **WHEN** admin views the admin panel
- **THEN** "Settings" is NOT visible in the sidebar (admin lacks `view-users`)

#### Scenario: Admin visiting /admin/users redirects to dashboard
- **WHEN** admin visits `/admin/users`
- **THEN** the URL becomes `/admin` (redirected to dashboard, stays in admin context)

#### Scenario: Admin visiting /admin/roles redirects to dashboard
- **WHEN** admin visits `/admin/roles`
- **THEN** the URL becomes `/admin`

#### Scenario: Admin home page shows Go to Admin + Profile + Sign Out
- **WHEN** admin visits `/`
- **THEN** all three buttons are visible

#### Scenario: Admin profile renders inside AdminLayout
- **WHEN** admin visits `/profile`
- **THEN** the admin sidebar is visible (AdminLayout used)

#### Scenario: Admin visiting guest pages redirects to admin dashboard
- **WHEN** admin visits `/login`, `/register`, or `/forgot-password`
- **THEN** the URL becomes `/admin` (authenticated admin redirects to admin dashboard)

### Requirement: Superadmin role E2E tests
The system SHALL include E2E tests verifying full access for superadmin, including Settings sidebar visibility, page access, and guest-page guards.

#### Scenario: Superadmin sidebar shows Settings group
- **WHEN** superadmin visits `/admin`
- **THEN** "Settings" is visible with "Users" and "Roles & Permissions" sub-items

#### Scenario: Superadmin can access /admin/users
- **WHEN** superadmin visits `/admin/users`
- **THEN** the page renders (URL stays at `/admin/users`)

#### Scenario: Superadmin can access /admin/roles
- **WHEN** superadmin visits `/admin/roles`
- **THEN** the page renders (URL stays at `/admin/roles`)

#### Scenario: Superadmin home page shows Go to Admin + Profile + Sign Out
- **WHEN** superadmin visits `/`
- **THEN** all three buttons are visible

#### Scenario: Superadmin profile renders inside AdminLayout
- **WHEN** superadmin visits `/profile`
- **THEN** the admin sidebar is visible

#### Scenario: Superadmin visiting guest pages redirects to admin dashboard
- **WHEN** superadmin visits `/login`, `/register`, or `/forgot-password`
- **THEN** the URL becomes `/admin`

### Requirement: Language switching E2E tests
The system SHALL include E2E tests verifying that the admin language switcher correctly updates all UI text between English and Indonesian, and persists the choice across page reloads.

#### Scenario: Admin panel defaults to English
- **WHEN** an admin/superadmin visits `/admin` with no prior locale set
- **THEN** navigation labels display in English (e.g., "Dashboard")

#### Scenario: Switching to Indonesian updates navigation labels
- **WHEN** the user clicks the Languages button and selects "Indonesia"
- **THEN** sidebar navigation shows "Dasbor" instead of "Dashboard"

#### Scenario: Switching to Indonesian updates page content
- **WHEN** Indonesian locale is active on the dashboard
- **THEN** the page description shows "Selamat datang" (not "Welcome")

#### Scenario: Switching back to English restores labels
- **WHEN** the user selects English from the language menu
- **THEN** navigation labels return to English

#### Scenario: Language preference persists after reload
- **WHEN** the user switches to Indonesian and reloads the page
- **THEN** navigation labels remain in Indonesian

#### Scenario: Home page buttons use Indonesian labels
- **WHEN** Indonesian locale is active and user visits `/`
- **THEN** buttons show "Buka Admin", "Profil", "Keluar" (instead of "Go to Admin", "Profile", "Sign Out")

### Requirement: Theme switching E2E tests
The system SHALL include E2E tests verifying that dark/light/system theme switching works correctly and persists across reloads.

#### Scenario: Switching to dark mode adds dark class
- **WHEN** the user selects "Dark" from the theme menu
- **THEN** the `<html>` element has class `dark`

#### Scenario: Switching to light mode removes dark class
- **WHEN** the user selects "Light" from the theme menu
- **THEN** the `<html>` element does NOT have class `dark`

#### Scenario: Theme persists after page reload
- **WHEN** the user selects dark mode and reloads the page
- **THEN** the `dark` class is still present on `<html>`

### Requirement: E2E tests are runnable via npm scripts
The system SHALL provide npm scripts for common Playwright operations.

#### Scenario: Run all E2E tests headlessly
- **WHEN** `npm run test:e2e` is executed
- **THEN** Playwright runs all tests in headless Chromium and reports results

#### Scenario: Run E2E tests in UI mode
- **WHEN** `npm run test:e2e:ui` is executed
- **THEN** Playwright opens the interactive UI mode

#### Scenario: Run E2E tests in headed mode
- **WHEN** `npm run test:e2e:headed` is executed
- **THEN** Playwright runs tests with a visible browser window
