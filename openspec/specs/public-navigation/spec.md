## ADDED Requirements

### Requirement: PublicNavbar displays navigation and branding
The system SHALL display a responsive navigation bar with logo/brand, navigation links (Home, Features, Pricing, About, Contact), and auth-aware action buttons.

#### Scenario: Desktop navigation display
- **WHEN** viewport width is ≥ 768px (md breakpoint)
- **THEN** all navigation links are visible horizontally with logo on left and auth buttons on right

#### Scenario: Mobile navigation display
- **WHEN** viewport width is < 768px
- **THEN** navigation links are hidden behind a hamburger menu button (Lucide Menu icon)

#### Scenario: Mobile menu toggle
- **WHEN** user clicks hamburger menu button
- **THEN** Sheet drawer slides in from right showing all navigation links with overlay

#### Scenario: Mobile menu close
- **WHEN** user clicks close button (X icon) or clicks overlay
- **THEN** Sheet drawer closes with smooth animation

### Requirement: PublicNavbar shows auth-aware actions
The system SHALL display different action buttons based on user authentication state.

#### Scenario: Guest user actions
- **WHEN** user is not authenticated (authStore.isAuthenticated === false)
- **THEN** navbar shows "Sign In" (primary button) and "Sign Up" (outline button)

#### Scenario: Authenticated user actions
- **WHEN** user is authenticated (authStore.isAuthenticated === true)
- **THEN** navbar shows user avatar/name with dropdown menu containing Profile link and Logout option

#### Scenario: Authenticated user navigation
- **WHEN** authenticated user clicks Profile in dropdown
- **THEN** user is navigated to profile page

#### Scenario: Logout action
- **WHEN** user clicks Logout in dropdown
- **THEN** user is logged out and returned to home page

### Requirement: PublicFooter displays site information
The system SHALL display a footer with brand name, copyright, navigation links, social media icons, and legal links.

#### Scenario: Footer content display
- **WHEN** user scrolls to bottom of any public page
- **THEN** footer shows brand logo/name, copyright year, navigation columns, social icons (GitHub, Twitter, LinkedIn)

#### Scenario: Footer responsive layout
- **WHEN** viewport is mobile (< 768px)
- **THEN** footer columns stack vertically with proper spacing

#### Scenario: Social link navigation
- **WHEN** user clicks a social media icon
- **THEN** external link opens in new tab with noopener noreferrer

### Requirement: Navbar scroll behavior
The system SHALL handle navbar appearance on scroll for better UX.

#### Scenario: Navbar at page top
- **WHEN** user is at top of page (scrollY < 50px)
- **THEN** navbar has transparent/minimal background

#### Scenario: Navbar on scroll
- **WHEN** user scrolls down (scrollY ≥ 50px)
- **THEN** navbar gains solid background (background/80 backdrop-blur) and subtle shadow

### Requirement: Navbar theme awareness
The system SHALL adapt navbar appearance based on current theme (light/dark mode).

#### Scenario: Light mode navbar
- **WHEN** theme is light mode
- **THEN** navbar uses light background with dark text

#### Scenario: Dark mode navbar
- **WHEN** theme is dark mode
- **THEN** navbar uses dark background with light text
