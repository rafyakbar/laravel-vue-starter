## MODIFIED Requirements

### Requirement: Bottom navigation bar on mobile
The system SHALL provide a fixed bottom navigation bar on mobile with four items: Site, Dashboard, Menu, and Profile.

#### Scenario: Bottom nav displays four items
- **WHEN** the bottom navigation is visible on mobile
- **THEN** it shows icons and labels for Site (Globe), Dashboard (LayoutDashboard), Menu (Menu icon), and Profile (User icon)

#### Scenario: Site button navigates to public home
- **WHEN** the user taps "Site" in the bottom navigation
- **THEN** the router navigates to `/` (the public home page)

#### Scenario: Menu button opens sidebar drawer
- **WHEN** the user taps "Menu" in the bottom navigation
- **THEN** the off-canvas sidebar drawer opens

#### Scenario: Profile button opens user popup
- **WHEN** the user taps "Profile" in the bottom navigation
- **THEN** a dropdown popup appears with "Profile" link and "Sign Out" action (with LogOut icon)

#### Scenario: Active route is highlighted in bottom nav
- **WHEN** the user is on the Dashboard page
- **THEN** the Dashboard item in the bottom navigation is visually highlighted as active

## ADDED Requirements

### Requirement: Sidebar contains a "Site" navigation item
The system SHALL include a "Site" item in the sidebar navigation, positioned at the bottom of the navigation content area (before the user footer), linking to the public home page.

#### Scenario: Site item is visible in sidebar
- **WHEN** the sidebar is rendered
- **THEN** a "Site" item with a Globe icon is visible below the main navigation group

#### Scenario: Site item navigates to public home
- **WHEN** the user clicks "Site" in the sidebar
- **THEN** the router navigates to `/` (the public home page)

#### Scenario: Site item is visible in icon-only collapsed mode
- **WHEN** the sidebar is collapsed to icon-only mode
- **THEN** the Globe icon for "Site" remains visible with a tooltip showing "Site"

### Requirement: Sign Out actions include a LogOut icon
The system SHALL display a LogOut icon alongside the "Sign Out" label in all user menu dropdowns (sidebar footer, header user menu, mobile bottom nav profile popup).

#### Scenario: Sign Out has icon in sidebar footer
- **WHEN** the user opens the sidebar footer dropdown
- **THEN** the "Sign Out" item displays a LogOut icon to its left

#### Scenario: Sign Out has icon in header user menu
- **WHEN** the user opens the header user dropdown
- **THEN** the "Sign Out" item displays a LogOut icon to its left
