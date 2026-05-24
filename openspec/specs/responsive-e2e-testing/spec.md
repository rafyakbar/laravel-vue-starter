## ADDED Requirements

### Requirement: Responsive viewport tests
The E2E test suite SHALL include responsive tests that verify layout and navigation behavior at mobile (375x667) and tablet (768x1024) viewports for all roles, using `test.use({ viewport })` in describe blocks within dedicated `responsive.spec.ts` files per role.

#### Scenario: Guest mobile viewport tests verify bottom nav and hidden desktop elements
- **WHEN** the guest responsive spec runs with `test.use({ viewport: { width: 375, height: 667 } })`
- **THEN** tests verify PublicBottomNav is visible, desktop nav links and auth buttons are hidden, navbar is solid bg-background, bottom nav persists after scroll, and navigation links work

#### Scenario: Guest tablet viewport tests verify desktop nav and hidden bottom nav
- **WHEN** the guest responsive spec runs with `test.use({ viewport: { width: 768, height: 1024 } })`
- **THEN** tests verify PublicNavbar desktop links and auth buttons are visible, PublicBottomNav is hidden, and navbar has backdrop blur

#### Scenario: User mobile viewport tests verify bottom nav and hidden desktop elements
- **WHEN** the user responsive spec runs with `test.use({ viewport: { width: 375, height: 667 } })`
- **THEN** tests verify PublicBottomNav auth dropdown shows user name with Profile and Sign Out, Admin button is NOT visible, Sign Out logs user out, Profile navigates to /profile, and /admin redirects to /

#### Scenario: User tablet viewport tests verify desktop navbar and hidden bottom nav
- **WHEN** the user responsive spec runs with `test.use({ viewport: { width: 768, height: 1024 } })`
- **THEN** tests verify PublicNavbar shows user name and Sign Out, bottom nav is hidden, Admin button is NOT visible, and user name navigates to /profile

#### Scenario: Admin mobile viewport tests verify AdminBottomNav and sidebar drawer
- **WHEN** the admin responsive spec runs with `test.use({ viewport: { width: 375, height: 667 } })`
- **THEN** tests verify AdminBottomNav is visible with Site/Dashboard/Menu/Profile, Menu button opens sidebar drawer, sidebar shows Dashboard and Site but NOT Settings, Profile dropdown shows Sign Out, theme/language switching works, and Admin button is NOT visible on landing page mobile

#### Scenario: Admin tablet viewport tests verify sidebar and hidden bottom nav
- **WHEN** the admin responsive spec runs with `test.use({ viewport: { width: 768, height: 1024 } })`
- **THEN** tests verify sidebar is visible without Settings group, bottom nav is hidden, and header with SidebarTrigger is visible

#### Scenario: Superadmin mobile viewport tests verify sidebar with Settings group
- **WHEN** the superadmin responsive spec runs with `test.use({ viewport: { width: 375, height: 667 } })`
- **THEN** tests verify Menu button opens sidebar showing Settings group with Users and Roles & Permissions, can navigate to /admin/users and /admin/roles, and language switching works on mobile

#### Scenario: Superadmin tablet viewport tests verify full sidebar
- **WHEN** the superadmin responsive spec runs with `test.use({ viewport: { width: 768, height: 1024 } })`
- **THEN** tests verify sidebar shows Settings group, bottom nav is hidden, and Admin button + Sign Out are visible in landing page navbar

### Requirement: Responsive tests follow existing patterns
Responsive tests SHALL follow the same patterns as existing E2E tests: use `data-slot` and CSS class selectors for scoping, use `waitForLoadState('networkidle')` for page loads, clear localStorage for theme/locale tests, and use Playwright role-based locators (`getByRole`, `getByText`).

#### Scenario: Responsive spec files use existing Playwright project configuration
- **WHEN** responsive spec files are placed in role test directories
- **THEN** they run under the same Playwright project (guest, user, admin, superadmin) using the project's storageState, with `test.use({ viewport })` overriding only the viewport per describe block

#### Scenario: Responsive tests scope locators to avoid strict mode violations
- **WHEN** responsive tests assert on elements that appear in multiple containers
- **THEN** they scope to `[data-slot="public-navbar"]` for desktop navbar, `nav.md\\:hidden` for bottom nav, and `[data-sidebar="content"]` for admin sidebar
