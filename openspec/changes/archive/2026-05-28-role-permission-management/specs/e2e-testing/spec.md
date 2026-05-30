## ADDED Requirements

### Requirement: Superadmin E2E tests for role management page
The system SHALL include Playwright E2E tests verifying that superadmin users can interact with the role management page.

#### Scenario: Superadmin can access roles page
- **WHEN** a superadmin user navigates to `/admin/roles`
- **THEN** the page loads with the "Roles & Permissions" heading visible
- **AND** the seeded roles (superadmin, admin, user) are displayed in the table

#### Scenario: Superadmin can open create role dialog
- **WHEN** a superadmin clicks the "Create Role" button
- **THEN** a dialog with the heading "Create Role" becomes visible

#### Scenario: Superadmin can create a new role via UI
- **WHEN** a superadmin fills the role name field and clicks "Save"
- **THEN** the dialog closes and the new role name appears in the table

#### Scenario: Superadmin can open edit dialog
- **WHEN** a superadmin clicks the edit button on a role row
- **THEN** a dialog with the heading "Edit Role" becomes visible

#### Scenario: Superadmin can open delete confirmation
- **WHEN** a superadmin clicks the delete button on a role row
- **THEN** a confirmation dialog with the text "Are you sure you want to delete this role?" becomes visible

#### Scenario: Superadmin can search roles
- **WHEN** a superadmin types "super" in the search input
- **THEN** the table displays the "superadmin" role

### Requirement: Superadmin role management responsive — Mobile viewport (375x667)
The system SHALL include Playwright E2E tests verifying role management page behavior on mobile viewports.

#### Scenario: Roles page accessible via sidebar drawer on mobile
- **WHEN** a superadmin navigates to `/admin/roles` on a 375x667 viewport
- **THEN** the bottom nav is visible (`nav.md:hidden`)
- **AND** the "Roles & Permissions" heading is visible
- **AND** the roles table is visible

#### Scenario: Create role dialog works on mobile
- **WHEN** a superadmin clicks "Create Role" on a 375x667 viewport
- **THEN** the dialog opens and the role name input and permission checkboxes are visible and interactable

#### Scenario: Search input works on mobile
- **WHEN** a superadmin types in the search input on a 375x667 viewport
- **THEN** the table filters results accordingly

#### Scenario: Bottom nav remains visible on roles page mobile
- **WHEN** a superadmin is on `/admin/roles` at 375x667
- **THEN** the bottom nav shows Site, Dashboard, Menu, and Profile buttons

#### Scenario: Menu button opens sidebar drawer with Roles link on mobile
- **WHEN** a superadmin clicks the Menu button in the bottom nav on `/admin/roles` at 375x667
- **THEN** the sidebar drawer opens showing the "Roles & Permissions" link

### Requirement: Superadmin role management responsive — Tablet viewport (769x1024)
The system SHALL include Playwright E2E tests verifying role management page behavior on tablet viewports.

#### Scenario: Roles page with sidebar visible on tablet
- **WHEN** a superadmin navigates to `/admin/roles` on a 769x1024 viewport
- **THEN** the sidebar is visible alongside the roles table
- **AND** the bottom nav is hidden

#### Scenario: Create role dialog works on tablet
- **WHEN** a superadmin clicks "Create Role" on a 769x1024 viewport
- **THEN** the dialog opens centered with the role name input and permission checkboxes visible

#### Scenario: Table displays all columns on tablet
- **WHEN** a superadmin views the roles table on a 769x1024 viewport
- **THEN** Role Name, Permissions, and Users columns are all visible

### Requirement: Admin role cannot access role management on any viewport
The system SHALL include Playwright E2E tests verifying that admin users are redirected away from the roles page on all viewports.

#### Scenario: Admin redirected from roles page on mobile
- **WHEN** an admin user navigates to `/admin/roles` on a 375x667 viewport
- **THEN** the user is redirected to `/admin` (dashboard)

#### Scenario: Admin redirected from roles page on tablet
- **WHEN** an admin user navigates to `/admin/roles` on a 769x1024 viewport
- **THEN** the user is redirected to `/admin` (dashboard)
