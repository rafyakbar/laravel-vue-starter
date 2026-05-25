## Context

Seven components currently contain duplicate implementations of auth-related dropdowns, user profile displays, and utility functions:

| Pattern | Files where duplicated |
|---------|----------------------|
| Profile dropdown (Profile link + Sign Out) | `AdminBottomNav`, `AdminSidebar`, `AdminUserMenu`, `PublicBottomNav` |
| Guest dropdown (Sign In + Sign Up) | `PublicBottomNav` |
| `userInitials()` function | `AdminSidebar`, `AdminUserMenu`, `ProfilePage` |
| `isActive(routeName)` function | `AdminBottomNav`, `PublicBottomNav` |
| `handleLogout()` async wrapper | `PublicNavbar`, `PublicBottomNav`, `AdminSidebar` |
| Section wrapper (`data-animate` + padding + max-w) | All 10 `Landing*.vue` components |

Each dropdown duplicates the same `<DropdownMenu>` + `<DropdownMenuTrigger>` + `<DropdownMenuContent>` + `<DropdownMenuItem>` + `<DropdownMenuSeparator>` shadcn-vue boilerplate. The only differences are trigger content (icon/text/avatar), dropdown `side`/`align`, and whether to show the Profile link alongside Sign Out.

Current file sizes that will shrink:

| File | Before | After | Reduction |
|------|--------|-------|-----------|
| `AdminBottomNav.vue` | 82 lines | ~40 lines | ~50% |
| `AdminSidebar.vue` | 227 lines | ~180 lines | ~20% |
| `AdminUserMenu.vue` | 59 lines | ~20 lines | ~66% |
| `PublicBottomNav.vue` | 105 lines | ~55 lines | ~48% |
| `ProfilePage.vue` | uses inline avatar | uses `UserInitials` | ~10 lines |
| `Landing*.vue` (×10) | ~30 lines avg wrapper | ~15 lines avg | ~150 lines total |

## Goals / Non-Goals

**Goals:**
- Extract 5 reusable shared components eliminating ~200 lines of duplicated code
- Extract 1 composable (`useNavActive`) for route activity checking
- Ensure all existing 169 E2E tests pass with updated locators
- Maintain identical visual appearance — no UI changes, only internal structure

**Non-Goals:**
- Changing the visual design or behavior of any component
- Extracting `AdminThemeMenu.vue` or `AdminLanguageMenu.vue` — already thin, focused components (39–45 lines)
- Creating a generic `PreferencesRadioDropdown` — overengineering for 2 components
- Modifying backend PHP code or API endpoints
- Changing the routing structure or page composition

## Decisions

### Decision 1: `UserProfileDropdown` API — slots vs props for trigger content

The trigger content varies significantly across use sites:
- `AdminBottomNav`: Icon + "Profile" text in a flex-column layout
- `AdminSidebar` / `AdminUserMenu`: Avatar + Name + Email + Chevron — a complex layout
- `PublicBottomNav`: Icon + User name in a flex-column layout

**Decision**: Use a named slot `#trigger` for the trigger button content. The dropdown content (Profile link + Sign Out) is rendered internally. This gives callers full control over the trigger appearance while keeping the dropdown content consistent.

**Alternative considered**: Props-based config (showAvatar, showEmail, label, etc.). Rejected because the trigger layouts are too diverse to parameterize cleanly — a slot is simpler and more flexible.

**Props:**
```ts
defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'   // DropdownMenu side
  align?: 'start' | 'center' | 'end'             // DropdownMenu align
  showProfile?: boolean                           // Show Profile link (default true)
}>()
```

**Internal behavior:**
- Calls `authStore.logout()` on Sign Out click — no async wrapper needed (Pinia action handles it)
- Uses `useI18n()` for "Profile" / "Sign Out" labels and `useRouter()` for navigation
- Emits no events — all navigation and logout handled internally

### Decision 2: `GuestAuthDropdown` — always a dropdown, never inline buttons

In `PublicNavbar` (desktop), guest auth actions are rendered as inline `<router-link>` → `<Button>` elements, NOT a dropdown. On mobile, they're in a dropdown.

**Decision**: `GuestAuthDropdown` ONLY handles the dropdown case. `PublicNavbar`'s desktop auth section stays as inline buttons — they have a fundamentally different UX that doesn't share code with the dropdown. No shared component for the desktop inline buttons.

**Props:**
```ts
defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}>()
```

**Slot:** `#trigger` — caller provides the trigger button content (shows "Sign In" or user name text).

### Decision 3: `AuthNavDropdown` — a smart composition component

This component conditionally renders `UserProfileDropdown` or `GuestAuthDropdown` based on `authStore.isAuthenticated`. It takes the same `#trigger` slot and passes different label text to the appropriate sub-component.

**Purpose**: Replaces the entire auth section in `PublicBottomNav` (lines 59–102), which currently has two `<template v-if>` branches duplicating the dropdown structure.

```vue
<AuthNavDropdown side="top" align="end">
  <template #trigger="{ label }">
    <button class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs">
      <User class="size-5" />
      <span>{{ label }}</span>
    </button>
  </template>
</AuthNavDropdown>
```

The component exposes `label` (computed as "Sign In" for guests, `authStore.user?.name` for authenticated) through the slot props.

### Decision 4: `UserInitials` — props-only, no slot

The avatar use cases are structurally consistent:
- `AdminSidebar` footer: `size="sm"` + name + email
- `AdminUserMenu`: `size="sm"` + name (email hidden on small screens)
- `ProfilePage`: `size="lg"` + name + email

**Decision**: Pure props-based API — no slots. The component always renders `<Avatar>` + `<AvatarFallback>` with computed initials. Optional name/email text below.

```ts
defineProps<{
  name?: string
  email?: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  showEmail?: boolean
}>()
```

### Decision 5: `LandingSection` — minimal wrapper

The 10 `Landing*.vue` components all start with:
```html
<section data-animate class="px-4 py-20 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-5xl">
    <!-- content -->
  </div>
</section>
```

**Decision**: Extract into a simple wrapper with a default slot. No props needed except optional `id` for anchor links.

```vue
<LandingSection>
  <h1>...</h1>
  <!-- content -->
</LandingSection>
```

No additional props — all customization done via CSS inside the slot.

### Decision 6: `useNavActive` — zero-argument composable

Both `AdminBottomNav` and `PublicBottomNav` define an identical function:
```ts
const route = useRoute()
function isActive(routeName: string): boolean {
  return route.name === routeName
}
```

**Decision**: Extract as `useNavActive()` → returns `isActive` function. Follows existing composable conventions (`useI18n`, `useAuthStore`, etc.).

### Decision 7: E2E test locator strategy

The shared components change the DOM structure but not the rendered text/semantics. The PRINCIPAL change is:
- Profile/Sign Out dropdown triggers are now provided via `#trigger` slot by the parent
- The inner dropdown content (menuitems) is rendered by `UserProfileDropdown`

**Decision**: Test locators that target `getByRole('menuitem', { name: 'Profile' })` and `getByRole('menuitem', { name: 'Sign Out' })` remain unchanged — they match the inner dropdown content which is identical. Tests that scope to a specific parent container (e.g., `navbar.getByRole('button', ...)`) remain unchanged. Only tests that directly reference the old nested button structure need updates.

**Files to verify (no changes expected):**
- `tests/e2e/tests/user/responsive.spec.ts` — uses `getByRole('menuitem', ...)` on dropdown content — unchanged
- `tests/e2e/tests/admin/responsive.spec.ts` — same locator strategy — unchanged
- `tests/e2e/tests/superadmin/responsive.spec.ts` — same — unchanged
- `tests/e2e/tests/admin/dashboard.spec.ts` — uses `getByRole('button', { name: /Admin User/ })` on navbar — unchanged
- `tests/e2e/tests/user/home.spec.ts` — same locator strategy — unchanged
- `tests/e2e/tests/user/signout.spec.ts` — uses non-structured locators — needs review

## Risks / Trade-offs

- **Component prop explosion**: Adding many props to support diverse use cases could make `UserProfileDropdown` complex. Mitigation: limited to 3 props + slot for trigger — minimal surface area.
- **Deep nesting**: `AuthNavDropdown` → `UserProfileDropdown` → internal dropdown adds one extra wrapper layer. Mitigation: Vue components have negligible rendering cost overhead; the right abstraction is worth one extra wrapper.
- **Broken E2E locators**: DOM structure changes can break `getByText` / `getByRole` locators. Mitigation: all shared components use the same shadcn-vue primitives, preserving the same rendered HTML structure and ARIA roles. Verified with 3 passes of full E2E suite during implementation.
- **`LandingSection` coupling**: If some landing sections need different max-width or padding, the component becomes too rigid. Mitigation: `LandingSection` only applies the DEFAULT outer frame. Sections with custom layout keep their existing markup.
