## Why

The SPA auth flow is complete but the `/admin` area is a single placeholder page with no navigation. To build any admin feature (user management, roles, settings), we first need the admin shell: a sidebar layout with navigation, responsive behavior, and a reusable page wrapper. Without this, every new admin page would need to solve navigation independently.

## What Changes

- Add a sidebar-based admin layout with collapsible navigation (desktop) and off-canvas drawer (mobile)
- Add a sticky header with breadcrumb and user menu (profile link + logout)
- Add a mobile bottom navigation bar with Home, Dashboard, Settings, and hamburger toggle
- Add navigation items: Dashboard, Settings group (Users, Roles & Permissions)
- Add a `BasicPage` component (title, description, actions slot) for consistent page structure
- Add placeholder pages: Dashboard, Users, Roles & Permissions, Profile
- Profile page shows user info (avatar initials, name, email, roles) with "Coming Soon" for editing
- Install shadcn-vue components: Sidebar, Collapsible, Sheet, DropdownMenu, Separator, Breadcrumb, Badge, Avatar, Tooltip
- Fix `components.json` and root `tsconfig.json` for shadcn-vue CLI v2.7 compatibility (`resolvedPaths` requirement)

## Capabilities

### New Capabilities

- `admin-layout`: Sidebar-based admin shell with responsive navigation (collapsible sidebar on desktop, off-canvas drawer + bottom nav on mobile), sticky header with breadcrumb and user menu, and BasicPage wrapper component

### Modified Capabilities

- `vue-spa-shell`: Adding `/admin` sub-routes (dashboard, users, roles) nested under the admin layout, updating route structure from single admin page to layout with children

## Impact

- **New dependencies (npm)**: None (all from existing packages — shadcn-vue, lucide-vue-next, radix-vue)
- **New shadcn-vue components**: Sidebar, Collapsible, Sheet, DropdownMenu, Separator, Breadcrumb, Badge, Avatar, Tooltip
- **New files**: ~20 files (layout components, navigation, pages, BasicPage)
- **Modified files**: `resources/app/router/index.ts` (nested admin routes), `resources/app/stores/auth.ts` (logout redirect fix), `components.json` + `tsconfig.json` (CLI compatibility), `resources/app/views/pages/admin/AdminPage.vue` (deleted, replaced)
- **Backend changes**: None
