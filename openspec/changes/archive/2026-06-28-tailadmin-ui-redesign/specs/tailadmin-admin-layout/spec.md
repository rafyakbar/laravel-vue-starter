## ADDED Requirements

### Requirement: AdminHeader matches TailAdmin header spec
The system SHALL render `AdminHeader` with height `h-16` (64px), sticky top positioning (`sticky top-0 z-[9999]`), a bottom border using `border-b border-gray-200 dark:border-gray-800`, and background `bg-white dark:bg-gray-900`. All existing header contents (SidebarTrigger, breadcrumb, theme menu, language menu, user menu) SHALL be preserved.

#### Scenario: Header height and border in light mode
- **WHEN** the admin layout is rendered in light mode
- **THEN** the header element has height 64px, background `#ffffff`, and a visible bottom border in `#e4e7ec`

#### Scenario: Header in dark mode
- **WHEN** the admin layout is rendered in dark mode
- **THEN** the header background is `#101828` and the border is `#1d2939`

---

### Requirement: AdminLayout uses TailAdmin container pattern
The system SHALL wrap page content in a container with `mx-auto max-w-[1536px] p-4 md:p-6`, removing the current bottom padding offset used for the mobile bottom nav (this is handled separately by AdminBottomNav).

#### Scenario: Content container max-width
- **WHEN** the admin layout renders on a wide screen (>1536px)
- **THEN** the content area is centered and constrained to 1536px width

---

### Requirement: AdminSidebar active nav items match TailAdmin style
The system SHALL style active sidebar nav items as `bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-500` and inactive items as `text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white/90`. All existing sidebar logic (collapsible groups, icon-only mode, permission-based filtering, dropdown on collapsed state, footer user profile) SHALL be preserved.

#### Scenario: Active nav item in light mode
- **WHEN** the user is on the Dashboard page and the sidebar is rendered in light mode
- **THEN** the Dashboard nav item has a brand-50 background and brand-600 text

#### Scenario: Active nav item in dark mode
- **WHEN** the user is on the Dashboard page and the sidebar is in dark mode
- **THEN** the Dashboard nav item has a brand-500/15 background and brand-500 text

#### Scenario: Inactive nav item hover in light mode
- **WHEN** the user hovers over an inactive nav item in light mode
- **THEN** the item shows a gray-100 background

#### Scenario: Inactive nav item hover in dark mode
- **WHEN** the user hovers over an inactive nav item in dark mode
- **THEN** the item shows a white/5 background

---

### Requirement: AdminSidebar background matches TailAdmin
The system SHALL render the sidebar with `bg-white dark:bg-black` (resolved via `--sidebar` CSS var which is `#ffffff` light / `#101828` dark). The sidebar border SHALL use `border-gray-200 dark:border-gray-800`.

#### Scenario: Sidebar background in light mode
- **WHEN** the admin area is rendered in light mode
- **THEN** the sidebar background is white (`#ffffff`)

#### Scenario: Sidebar background in dark mode
- **WHEN** the admin area is rendered in dark mode
- **THEN** the sidebar background is near-black (`#101828`)

---

### Requirement: BasicPage title uses TailAdmin heading style
The system SHALL render the page title in `BasicPage.vue` as `text-xl font-semibold text-gray-800 dark:text-white/90` and the description as `text-sm text-gray-500 dark:text-gray-400`.

#### Scenario: Page title in light mode
- **WHEN** a page using `BasicPage` is rendered in light mode
- **THEN** the `h1` title uses font-semibold weight and gray-800 color

#### Scenario: Page title in dark mode
- **WHEN** a page using `BasicPage` is rendered in dark mode
- **THEN** the `h1` title uses white/90 color

---

### Requirement: Dark/Light/System theme switching continues to work
The system SHALL preserve the existing theme switching mechanism (AdminThemeMenu + preferencesStore) so users can still select light, dark, or system theme. All TailAdmin tokens SHALL respond correctly to the `.dark` class on `<html>`.

#### Scenario: Switching to dark mode applies TailAdmin dark tokens
- **WHEN** the user selects "dark" from the theme menu
- **THEN** the `.dark` class is added to `<html>` and all TailAdmin dark mode colors are active

#### Scenario: Switching to system theme follows OS preference
- **WHEN** the user selects "system" and the OS is in dark mode
- **THEN** the `.dark` class is applied and TailAdmin dark tokens are active
