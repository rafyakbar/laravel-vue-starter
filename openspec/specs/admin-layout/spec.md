## ADDED Requirements

### Requirement: Admin layout provides sidebar navigation on desktop
The system SHALL render a sidebar-based admin layout for all `/admin` routes on viewports ≥ 768px, with a collapsible sidebar containing navigation items.

#### Scenario: Desktop renders sidebar with navigation
- **WHEN** an authenticated user visits any `/admin` route on a viewport ≥ 768px
- **THEN** a sidebar is visible containing navigation items: Dashboard, and a Settings group with Users and Roles & Permissions

#### Scenario: Sidebar is collapsible on desktop
- **WHEN** the user clicks the sidebar collapse toggle
- **THEN** the sidebar collapses to icon-only mode and the main content area expands

### Requirement: Admin layout provides off-canvas drawer on mobile
The system SHALL render navigation as an off-canvas drawer (Sheet) on viewports < 768px, triggered by a hamburger button.

#### Scenario: Mobile hides sidebar and shows bottom nav
- **WHEN** an authenticated user visits any `/admin` route on a viewport < 768px
- **THEN** the sidebar is hidden and a fixed bottom navigation bar is visible

#### Scenario: Hamburger opens full navigation drawer
- **WHEN** the user taps the hamburger icon in the bottom navigation
- **THEN** an off-canvas drawer slides in from the left containing all navigation items

### Requirement: Bottom navigation bar on mobile
The system SHALL provide a fixed bottom navigation bar on mobile with quick-access items: Home (links to `/`), Dashboard, Settings, and a hamburger toggle for the full sidebar drawer.

#### Scenario: Bottom nav displays four items
- **WHEN** the bottom navigation is visible on mobile
- **THEN** it shows icons and labels for Home, Dashboard, Settings, and a hamburger menu toggle

#### Scenario: Home button navigates to public home
- **WHEN** the user taps "Home" in the bottom navigation
- **THEN** the router navigates to `/` (the public home page)

#### Scenario: Active route is highlighted in bottom nav
- **WHEN** the user is on the Dashboard page
- **THEN** the Dashboard item in the bottom navigation is visually highlighted as active

### Requirement: Sticky header with breadcrumb and user menu
The system SHALL render a sticky header at the top of the admin content area containing a breadcrumb (current page title) and a user dropdown menu.

#### Scenario: Header remains visible on scroll
- **WHEN** the user scrolls down within the admin content area
- **THEN** the header remains fixed at the top of the viewport (sticky positioning)

#### Scenario: Header displays current page title as breadcrumb
- **WHEN** the user is on the Users page
- **THEN** the header breadcrumb displays "Users"

#### Scenario: User menu shows profile and logout options
- **WHEN** the user clicks their avatar/name in the header
- **THEN** a dropdown menu appears with options: "Profile" (link) and "Sign Out" (action)

#### Scenario: Sign out from user menu logs out and redirects
- **WHEN** the user clicks "Sign Out" in the user dropdown
- **THEN** the auth store logout action is triggered and the user is redirected to `/`

### Requirement: Navigation items with grouped structure
The system SHALL organize navigation items as: Dashboard (top-level), and a collapsible Settings group containing Users and Roles & Permissions sub-items.

#### Scenario: Settings group is collapsible
- **WHEN** the user clicks the "Settings" group heading in the sidebar
- **THEN** the group expands or collapses to show/hide its children (Users, Roles & Permissions)

#### Scenario: Placeholder pages show badge indicator
- **WHEN** the user navigates to Users or Roles & Permissions
- **THEN** a badge reading "Coming Soon" is visible on the page indicating the feature is not yet implemented

### Requirement: BasicPage component wraps admin page content
The system SHALL provide a `BasicPage` component that renders a page title, optional description, optional actions slot, and a content area.

#### Scenario: Page renders title and description
- **WHEN** a page uses `<BasicPage title="Users" description="Manage user accounts">`
- **THEN** the page displays an H1 heading "Users" and a subtitle "Manage user accounts"

#### Scenario: Actions slot renders top-right buttons
- **WHEN** a page provides content in the `#actions` slot of BasicPage
- **THEN** the action content renders aligned to the right of the page header area

### Requirement: Admin routes are nested under layout
The system SHALL configure Vue Router so that all `/admin/*` routes render within the `AdminLayout` component, sharing the sidebar and header without re-mounting on navigation.

#### Scenario: Navigating between admin pages preserves layout
- **WHEN** the user navigates from Dashboard to Users
- **THEN** only the page content area re-renders; the sidebar and header remain mounted

#### Scenario: Admin routes require authentication
- **WHEN** an unauthenticated user navigates to any `/admin/*` route
- **THEN** the router guard redirects to `/login`
