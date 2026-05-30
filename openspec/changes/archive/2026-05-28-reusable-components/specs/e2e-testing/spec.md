## MODIFIED Requirements

### Requirement: User role E2E tests
The system SHALL include E2E tests verifying behavior for authenticated users with the `user` role, including access restrictions, guest-page guards, and responsive viewport tests. Tests SHALL use Playwright role-based locators (`getByRole`, `getByText`) which MUST remain compatible with the shared `AuthNavDropdown` and `UserProfileDropdown` component structure.

#### Scenario: User home page shows user name and Sign Out in navbar
- **WHEN** a user visits `/`
- **THEN** user name text and "Sign Out" button are visible in the authenticated navbar via shared `UserProfileDropdown`

#### Scenario: User can sign out from bottom nav
- **WHEN** a user clicks "Sign Out" from the bottom nav auth dropdown (now rendered by `AuthNavDropdown`)
- **THEN** the page shows guest "Sign In" button (unauthenticated state)

### Requirement: Admin role E2E tests
The system SHALL include E2E tests verifying behavior for authenticated users with the `admin` role, including sidebar filtering, restricted page redirects, guest-page guards, and responsive viewport tests using shared components.

#### Scenario: Admin dashboard bottom nav Profile dropdown works with shared UserProfileDropdown
- **WHEN** admin views the admin panel at 375x667
- **THEN** the bottom nav Profile button opens a dropdown with "Profile" and "Sign Out" options rendered by `UserProfileDropdown`

#### Scenario: Admin responsive sidebar footer uses UserInitials
- **WHEN** admin views the admin panel
- **THEN** the sidebar footer displays user initials computed by the shared `UserInitials` component

### Requirement: Superadmin role E2E tests
The system SHALL include E2E tests verifying full access for superadmin, including responsive viewport tests that interact with the shared `UserProfileDropdown` component.

#### Scenario: Superadmin responsive bottom nav uses UserProfileDropdown
- **WHEN** superadmin views the admin panel at 375x667
- **THEN** the bottom nav Profile dropdown shows "Profile" and "Sign Out" via `UserProfileDropdown`