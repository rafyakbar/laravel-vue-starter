## Context

The SPA auth flow is complete: users can login/register/logout, and the router guards protect `/admin`. Currently `/admin` renders a single `AdminPage.vue` with a welcome message and sign out button. There is no navigation structure, no sidebar, and no way to reach sub-pages.

The project uses shadcn-vue (radix-vue + TailwindCSS 4 + CVA) with lucide-vue-next icons. The existing pattern uses `DefaultLayout.vue` as a simple full-height wrapper. The admin area needs its own layout with sidebar navigation.

## Goals / Non-Goals

**Goals:**
- Sidebar layout with collapsible toggle on desktop
- Off-canvas drawer (Sheet) on mobile with hamburger toggle
- Sticky header with breadcrumb and user dropdown menu (profile + logout)
- Bottom navigation bar on mobile (Home, Dashboard, Settings, hamburger)
- Navigation items: Dashboard, Settings → Users, Settings → Roles & Permissions
- Reusable `BasicPage` component for consistent page structure
- Placeholder pages for Dashboard, Users, Roles & Permissions
- Responsive across desktop, tablet, and mobile

**Non-Goals:**
- Actual user management CRUD (separate change)
- Dark mode toggle (future)
- Notification system
- Settings persistence (sidebar collapsed state via cookie — future)
- Search functionality in header
- Real breadcrumb logic (just page title for now)

## Decisions

### 1. Layout structure using shadcn-vue Sidebar component (confirmed available)

**Choice:** Use shadcn-vue's Sidebar component system (`SidebarProvider`, `Sidebar`, `SidebarContent`, `SidebarInset`, `SidebarRail`). Installed via `npx shadcn-vue@latest add sidebar`.

**Rationale:** shadcn-vue provides a full sidebar system with built-in collapsible behavior (`collapsible="icon"` for icon-only mode), mobile detection via `useSidebar()` composable (exposes `isMobile`, `openMobile`, `setOpenMobile`), keyboard shortcut (cmd+b), and state persistence via `storage-key` prop. No need for custom responsive logic or VueUse.

**Key composable:** `useSidebar()` provides `{ state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar }` — used by BottomNav to trigger mobile drawer.

**Alternative considered:** Custom sidebar with Sheet — more work, duplicates what shadcn-vue already provides.

**Layout structure:**
```text
Desktop:
┌──────────────────────────────────────────────────┐
│ Sidebar        │ Header (sticky)                  │
│ (collapsible)  │──────────────────────────────────│
│                │ Main Content (BasicPage)         │
│ Nav items      │                                  │
│                │                                  │
│ User footer    │                                  │
└──────────────────────────────────────────────────┘

Mobile:
┌──────────────────────────────────────────────────┐
│ Header (sticky)                                   │
│──────────────────────────────────────────────────│
│ Main Content (BasicPage)                          │
│                                                   │
│                                                   │
│──────────────────────────────────────────────────│
│ Bottom Nav: Home | Dashboard | Settings | ☰       │
└──────────────────────────────────────────────────┘
```

### 2. Mobile: off-canvas drawer + bottom navigation

**Choice:** On mobile (< 768px), the sidebar becomes a Sheet (off-canvas drawer) triggered by calling `useSidebar().setOpenMobile(true)` from the bottom nav hamburger button. The shadcn-vue Sidebar component handles mobile mode internally — when `isMobile` is true, it renders as a Sheet automatically.

**Bottom nav state management:** No shared state needed. The BottomNav component imports `useSidebar()` directly and calls `setOpenMobile(true)` on hamburger click. The Sidebar component already listens to `openMobile` state.

**Responsive strategy:** Pure Tailwind CSS classes (`md:hidden` / `hidden md:flex`). No VueUse or custom media query composables needed — the Sidebar component handles its own mobile detection internally.

**Components:**
- shadcn-vue `Sidebar` (auto-renders as Sheet on mobile)
- Custom `AdminBottomNav.vue` (fixed bottom bar, hidden on md+)

### 3. Navigation items with grouped structure

**Choice:** Flat navigation with a collapsible "Settings" group:
```
Dashboard          → /admin
Settings (group)
  └── Users        → /admin/users
  └── Roles & Permissions → /admin/roles
```

**Rationale:** Minimal navigation for now. Settings is a logical group for admin/config pages. Each sub-page gets a "coming soon" badge indicator. Dashboard is top-level.

### 4. Router structure with nested admin routes

**Choice:** Replace the current single `/admin` route with a layout route that has children:

```typescript
{
  path: '/admin',
  component: () => import('@/views/layouts/AdminLayout.vue'),
  meta: { requiresAuth: true },
  children: [
    { path: '', name: 'admin.dashboard', component: DashboardPage },
    { path: 'users', name: 'admin.users', component: UsersPage },
    { path: 'roles', name: 'admin.roles', component: RolesPage },
  ],
}
```

**Rationale:** Nested routes let the `AdminLayout` wrap all admin pages with shared sidebar/header without re-rendering the layout on navigation. Vue Router handles this natively.

### 5. BasicPage component for page consistency

**Choice:** A shared `BasicPage.vue` component that provides:
- Page title (h1)
- Optional description
- Optional actions slot (top-right, for buttons like "Create User")
- `sticky` prop for sticky header within page content

```vue
<BasicPage title="Users" description="Manage user accounts">
  <template #actions>
    <Button>Create User</Button>
  </template>
  <!-- page content -->
</BasicPage>
```

**File:** `resources/app/components/shared/BasicPage.vue`

### 6. Header with user menu and breadcrumb from route meta

**Choice:** Sticky header containing:
- `SidebarTrigger` button (uses `useSidebar().toggleSidebar()` — collapses on desktop, opens drawer on mobile)
- Separator (vertical divider)
- Breadcrumb: reads `route.meta.title` (string) from the current matched route. Each admin child route defines `meta: { title: 'Page Name' }`.
- User dropdown menu (avatar + name, profile link, logout action)

**Breadcrumb implementation:** The header component uses `useRoute()` and reads `route.meta.title`. No need for complex breadcrumb path building — each page defines its own title in route meta. Example: `{ path: 'users', name: 'admin.users', meta: { title: 'Users' } }`.

**Components:** shadcn-vue `DropdownMenu`, `Avatar`, `Breadcrumb`, `Separator`, `Tooltip`

### 7. shadcn-vue components to add

Required new components (via CLI):
```bash
npx shadcn-vue@latest add sheet sidebar dropdown-menu separator breadcrumb badge avatar tooltip
```

## New File Map

```
resources/app/
├── views/layouts/
│   └── AdminLayout.vue              # SidebarProvider + AdminSidebar + SidebarInset + AdminBottomNav
├── components/
│   ├── shared/
│   │   └── BasicPage.vue            # Reusable page wrapper (title, description, actions slot)
│   └── admin/
│       ├── nav-items.ts             # NavItem interface + navigation config array
│       ├── AdminSidebar.vue         # Sidebar with collapsible nav, user footer dropdown
│       ├── AdminHeader.vue          # Sticky header (SidebarTrigger, breadcrumb, AdminUserMenu)
│       ├── AdminUserMenu.vue        # User dropdown (Profile link, Sign Out)
│       └── AdminBottomNav.vue       # Mobile fixed bottom nav (Home, Dashboard, Settings, Menu)
├── views/pages/admin/
│   ├── DashboardPage.vue            # Dashboard with welcome card
│   ├── UsersPage.vue                # Users placeholder with "Coming Soon" badge
│   ├── RolesPage.vue                # Roles & Permissions placeholder with "Coming Soon" badge
│   └── ProfilePage.vue             # Profile page with user info (avatar, name, email, roles)
└── router/
    └── index.ts                     # (modified — nested admin routes with meta.title)
```

## Risks / Trade-offs

- **[Resolved] shadcn-vue CLI v2.7 requires `resolvedPaths` in `components.json`** — The project was initialized with an older CLI version. Fix: add `aliases.composables` to `components.json` and `compilerOptions.paths` to root `tsconfig.json`, then re-run `npx shadcn-vue@latest init -d`.
- **[Risk] shadcn-vue Sidebar CLI adds many sub-component files** → This is expected. The CLI generates ~45 files under `components/ui/sidebar/`. These are stable and rarely need editing.
- **[Trade-off] Breadcrumb is simple (page title only from route meta)** — No dynamic nested breadcrumb path. Good enough for MVP, can enhance later with recursive route matching.
- **[Trade-off] Sidebar collapse state persists via `storage-key="admin-sidebar"` prop** — Uses `localStorage` under the hood. Acceptable for client-only state.
- **[Trade-off] Bottom nav is custom (not shadcn-vue)** — No existing component for this; built with Tailwind utility classes and lucide icons.
- **[Resolved] Nested routes change the admin route name** — `admin` became `admin.dashboard`. All references updated: guards, RegisterPage, HomePage, auth store logout redirect.
- **[Trade-off] No VueUse dependency** — shadcn-vue Sidebar handles mobile detection internally. Bottom nav uses Tailwind `md:hidden`.
- **[Resolved] Logout redirect bug** — During implementation, auth store logout was accidentally set to `admin.dashboard`. Corrected to `home`.
