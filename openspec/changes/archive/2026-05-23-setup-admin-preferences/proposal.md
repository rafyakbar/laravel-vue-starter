## Why

The admin panel currently has no theme control, no language support, and several UX gaps in navigation. Users cannot switch between light/dark mode or choose their preferred language. The mobile bottom navigation is inconsistent with the desktop sidebar (missing "Site" link, "Settings" item is misleading, no profile access). Sign out buttons lack icons, reducing visual clarity.

## What Changes

- Add dark mode support with three options: light, dark, system (follows OS preference)
- Add language switcher with English and Indonesian support using a lightweight composable-based i18n approach (no heavy library)
- Add a `usePreferencesStore` Pinia store persisting theme and locale to `localStorage`
- Add a preferences dropdown in the admin header (theme toggle + language switcher)
- Restructure mobile bottom navigation: `[Site, Dashboard, Menu, Profile]`
  - "Site" (Globe icon) → navigates to `/`
  - "Dashboard" (LayoutDashboard icon) → navigates to `/admin`
  - "Menu" (Menu icon) → opens sidebar drawer
  - "Profile" (User icon) → opens a popup with Profile link and Sign Out
- Add "Site" navigation item to the sidebar (Globe icon, link to `/`, positioned at bottom of nav items before footer)
- Add `LogOut` icon to all Sign Out actions (sidebar footer dropdown, header user menu)

## Capabilities

### New Capabilities

- `admin-preferences`: User preferences system — theme (light/dark/system) and locale (en/id) stored in localStorage, applied on app load, toggled via header controls

### Modified Capabilities

- `admin-layout`: Bottom nav restructured (Site/Dashboard/Menu/Profile), sidebar gains "Site" item, Sign Out gains LogOut icon

## Impact

- **New dependencies (npm)**: None — i18n implemented as a composable with JSON locale files, no external library
- **New files**: `resources/app/stores/preferences.ts`, `resources/app/composables/useI18n.ts`, `resources/app/locales/en.ts`, `resources/app/locales/id.ts`, `resources/app/components/admin/AdminPreferencesMenu.vue`
- **Modified files**: `AdminHeader.vue` (add preferences menu), `AdminSidebar.vue` (add Site item, add LogOut icon), `AdminUserMenu.vue` (add LogOut icon), `AdminBottomNav.vue` (restructure items), `main.ts` (apply saved theme on load)
- **Backend changes**: None — preferences are client-side only
