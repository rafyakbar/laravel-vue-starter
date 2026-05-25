## 1. Create Shared Composables

### 1.1 useNavActive composable

Create `resources/app/composables/useNavActive.ts`:

```ts
import { useRoute } from 'vue-router'

export function useNavActive() {
  const route = useRoute()
  function isActive(routeName: string): boolean {
    return route.name === routeName
  }
  return { isActive }
}
```

- [x] 1.1 Create `resources/app/composables/useNavActive.ts` returning `{ isActive }` which checks `useRoute().name === routeName`

---

## 2. Create Shared UI Components

### 2.1 UserInitials component

Create `resources/app/components/shared/UserInitials.vue`:

Props:
```ts
defineProps<{
  name?: string
  email?: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  showEmail?: boolean
}>()
```

Template: Renders `<Avatar>` + `<AvatarFallback>` with computed initials (first letter of each word, uppercase, max 2 chars). Optional `<div>` with name and email text when `showName` or `showEmail` are true. Size classes map to `size` prop: sm=6, md=8, lg=16.

- [x] 2.1 Create `resources/app/components/shared/UserInitials.vue` with props `name`, `email`, `size`, `showName`, `showEmail`. Compute initials from name (e.g., "E2E User" → "EU"). Render using `<Avatar>` / `<AvatarFallback>` from `@/components/ui/avatar`.

### 2.2 GuestAuthDropdown component

Create `resources/app/components/shared/GuestAuthDropdown.vue`:

Props:
```ts
defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}>()
```

Template: Named slot `#trigger` for the trigger button. Internally renders `<DropdownMenu>` + `<DropdownMenuTrigger>` + `<DropdownMenuContent>` with two `<DropdownMenuItem>` as `<router-link>` to `login` and `register`. Labels from `useI18n()`: `landing.nav.signIn` ("Sign In") and `landing.nav.signUp` ("Sign Up"). Default `side="top"`, `align="end"`.

- [x] 2.2 Create `resources/app/components/shared/GuestAuthDropdown.vue` with `#trigger` slot, `<DropdownMenu>` containing Sign In (`router-link :to="{ name: 'login' }"`) and Sign Up (`router-link :to="{ name: 'register' }"`) menuitems separated by `<DropdownMenuSeparator>`. Use `useI18n()` for labels.

### 2.3 ProfileDropdown component (props-based, no slot for trigger)

Create `resources/app/components/shared/ProfileDropdown.vue`:

Props-based API (avoids `as-child` slot limitation by rendering the `<button>` directly in template):

```ts
defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  label?: string
  triggerClass?: string
  active?: boolean
}>()
```

Renders `<DropdownMenu>` + `<DropdownMenuTrigger as-child>` with a `<button>` directly in the template using `triggerClass` and `active` for styling. Content: `<DropdownMenuItem>` Profile link + `<DropdownMenuSeparator>` + `<DropdownMenuItem>` Sign Out calling `authStore.logout()`.

- [x] 2.3 Create `resources/app/components/shared/ProfileDropdown.vue` with props: `side`, `align`, `label`, `triggerClass`, `active`. Renders `<DropdownMenu>` with trigger `<button>` (rendered directly, no slot), Profile menuitem, and Sign Out menuitem.

- [x] 2.4 Create `resources/app/components/shared/AuthDropdown.vue` with props: `side`, `align`, `triggerClass`, `active`. Auto-detects auth state, renders guest or user dropdown content. Trigger `<button>` rendered directly in template.

### 2.5 LandingSection component

Create `resources/app/components/shared/LandingSection.vue`:

Props: `id?: string`, `class?: HTMLAttributes['class']`.

Template:
```html
<section :id="id" data-animate :class="cn('px-4 py-20 sm:px-6 lg:px-8', props.class)">
  <div class="mx-auto max-w-5xl">
    <slot />
  </div>
</section>
```

Uses `cn` utility from `@/lib/utils`.

- [x] 2.5 Create `resources/app/components/shared/LandingSection.vue` wrapping `<section data-animate class="px-4 py-20 sm:px-6 lg:px-8">` with inner `<div class="mx-auto max-w-5xl"><slot /></div>`. Accept optional `id` and `class` props.

---

## 3. Refactor Admin Components

### 3.1 Refactor AdminBottomNav.vue

File: `resources/app/components/admin/AdminBottomNav.vue`

Replace the inline Profile dropdown section (lines 56-80) with `<ProfileDropdown>`:

```vue
<ProfileDropdown
  side="top"
  align="end"
  :active="isActive('profile')"
  trigger-class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
  :label="t('nav.profile')"
/>
```

- Remove inline `<DropdownMenu>`, `<DropdownMenuTrigger>`, `<DropdownMenuContent>`, `<DropdownMenuItem>`s, `<DropdownMenuSeparator>`.
- Remove unused imports: `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuTrigger`, `LogOut`.
- Add import: `ProfileDropdown from '@/components/shared/ProfileDropdown.vue'`.
- Remove `useRoute()` import (replaced by `useNavActive()`).
- Remove `authStore.logout()` call (now in `ProfileDropdown`).

- [x] 3.1 In `resources/app/components/admin/AdminBottomNav.vue`, replace inline Profile dropdown with `<ProfileDropdown :active="isActive('profile')" trigger-class="..." label="Profile" />`. Add import, remove unused imports.

### 3.2 Refactor AdminSidebar.vue

File: `resources/app/components/admin/AdminSidebar.vue`

Replace the user footer DropdownMenu (lines ~189-222, the `<SidebarFooter>` section containing avatar + name/email + Profile/Sign Out dropdown) with:

```vue
<SidebarFooter>
  <SidebarMenu>
    <SidebarMenuItem>
      <UserProfileDropdown side="top" :show-profile="true">
        <template #trigger>
          <SidebarMenuButton size="lg">
            <UserInitials :name="authStore.user?.name ?? 'U'" :email="authStore.user?.email" size="sm" />
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ authStore.user?.name }}</span>
              <span class="truncate text-xs text-muted-foreground">{{ authStore.user?.email }}</span>
            </div>
            <ChevronUp class="ml-auto" />
          </SidebarMenuButton>
        </template>
      </UserProfileDropdown>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarFooter>
```

- Remove the inline `userInitials()` function.
- Remove unused imports: `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuTrigger`, `Avatar`, `AvatarFallback`, `LogOut`, `ChevronUp`, `User`.
- Add imports: `UserProfileDropdown`, `UserInitials`.
- Keep `ChevronUp` import (used in slot above).

- [x] 3.2 In `resources/app/components/admin/AdminSidebar.vue`, replace the `<SidebarFooter>` user dropdown with `<UserProfileDropdown>` using `<UserInitials>` + name/email in trigger slot. Remove `userInitials()` function. Remove unused imports (`DropdownMenu*`, `Avatar`, `AvatarFallback`, `LogOut`, `User`). Add imports for `UserProfileDropdown` and `UserInitials`.

### 3.3 Refactor AdminUserMenu.vue

File: `resources/app/components/admin/AdminUserMenu.vue`

Replace the entire component body with:

```vue
<script setup lang="ts">
import UserProfileDropdown from '@/components/shared/UserProfileDropdown.vue'
import UserInitials from '@/components/shared/UserInitials.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <UserProfileDropdown side="bottom" align="end">
    <template #trigger>
      <button class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <UserInitials :name="authStore.user?.name ?? 'U'" size="sm" />
        <span class="hidden sm:inline-block max-w-32 truncate font-medium">
          {{ authStore.user?.name }}
        </span>
      </button>
    </template>
  </UserProfileDropdown>
</template>
```

- Remove inline `userInitials()` function.
- Remove unused imports: `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuTrigger`, `Avatar`, `AvatarFallback`, `LogOut`, `User`.
- Remove `handleLogout()` function (now handled by `UserProfileDropdown`).
- Remove `useI18n()` import.

- [x] 3.3 In `resources/app/components/admin/AdminUserMenu.vue`, replace inline avatar/dropdown with `<UserProfileDropdown side="bottom" align="end">` using `<UserInitials>` + user name in `#trigger` slot. Remove `userInitials()`, `handleLogout()`. Remove unused imports.

### 3.4 Verify AdminHeader.vue

`resources/app/components/admin/AdminHeader.vue` imports and renders `AdminUserMenu` — no changes needed since `AdminUserMenu` is refactored internally.

- [x] 3.4 Verify `resources/app/components/admin/AdminHeader.vue` renders correctly with refactored `AdminUserMenu` — no file changes expected.

---

## 4. Refactor Public Components

### 4.1 Refactor PublicBottomNav.vue

File: `resources/app/components/public/PublicBottomNav.vue`

Replace the auth actions `<DropdownMenu>` section (lines 56-82) with `<AuthDropdown>`:

```vue
<AuthDropdown
  side="top"
  align="end"
  :active="isActive('login') || isActive('register') || isActive('profile')"
  trigger-class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
/>
```

- Remove the entire auth `<DropdownMenu>` section (trigger + both guest/authenticated branches).
- Remove unused imports: `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuTrigger`, `LogOut`.
- Remove unused stores: `useAuthStore`, `useRoute`.
- Add import: `AuthDropdown from '@/components/shared/AuthDropdown.vue'`.
- Replace `isActive()` with `useNavActive()`.

- [x] 4.1 In `resources/app/components/public/PublicBottomNav.vue`, replace inline auth dropdown with `<AuthDropdown :active="..." trigger-class="..." />`. Add import, remove unused imports.

### 4.2 Refactor PublicNavbar.vue

File: `resources/app/components/public/PublicNavbar.vue`

The desktop actions section (`hidden md:flex`) contains `<template v-if="!authStore.isAuthenticated">` and `<template v-else>` branches. These use inline `<router-link>` → `<Button>` elements (NOT dropdowns), so they do NOT need `UserProfileDropdown` or `GuestAuthDropdown` replacement.

However, `handleLogout()` calls `authStore.logout()` then does nothing else. Replace `@click="handleLogout"` with `@click="authStore.logout()"` directly and remove the `handleLogout` function.

- [x] 4.2 In `resources/app/components/public/PublicNavbar.vue`, remove `handleLogout()` function. Replace `@click="handleLogout"` on Sign Out button with `@click="authStore.logout()"`. No component replacement needed (desktop uses inline buttons, not dropdowns).

### 4.3 Refactor ProfilePage.vue

File: `resources/app/views/pages/ProfilePage.vue`

Replace the inline `<Avatar>` + `<AvatarFallback>` section (appears TWICE — once in `<AdminLayout>` branch, once in `<DefaultLayout>` branch) with `<UserInitials>`:

```vue
<UserInitials :name="authStore.user?.name ?? 'U'" size="lg" />
```

- Remove `userInitials()` function (replaced by `UserInitials` component).
- Remove imports: `Avatar`, `AvatarFallback` from `@/components/ui/avatar`.
- Add import: `UserInitials from '@/components/shared/UserInitials.vue'`.

- [x] 4.3 In `resources/app/views/pages/ProfilePage.vue`, replace both inline `<Avatar>` / `<AvatarFallback>` instances (admin layout and standalone layout) with `<UserInitials :name="authStore.user?.name ?? 'U'" size="lg" />`. Remove `userInitials()` function. Remove `Avatar`, `AvatarFallback` imports. Add `UserInitials` import.

---

## 5. Refactor Landing Section Components

### 5.1 Refactor all Landing*.vue components

Apply `LandingSection` wrapper to all 10 `Landing*.vue` files under `resources/app/components/public/landing/`:

Replace:
```html
<section data-animate class="px-4 py-20 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-5xl">
    <!-- content -->
  </div>
</section>
```

With:
```html
<LandingSection>
  <!-- content -->
</LandingSection>
```

For sections that already have an `id` attribute (e.g., `id="hero"`), pass it: `<LandingSection id="hero">`.

Components to update:
- `LandingHero.vue`
- `LandingTechStack.vue`  
- `LandingFeatures.vue`
- `LandingWhy.vue`
- `LandingArchitecture.vue`
- `LandingTesting.vue`
- `LandingAIAgent.vue`
- `LandingQuickStart.vue`
- `LandingFAQ.vue`
- `LandingCTA.vue`

Add import: `import LandingSection from '@/components/shared/LandingSection.vue'` to each file.

- [x] 5.1 `LandingHero.vue` — KEPT AS-IS (has `relative overflow-hidden` + gradient, custom `pt-32 pb-20`)
- [x] 5.2 Replace outer `<section>` wrapper with `<LandingSection>` in `LandingTechStack.vue`
- [x] 5.3 Replace outer `<section>` wrapper with `<LandingSection>` in `LandingFeatures.vue`
- [x] 5.4 Replace outer `<section>` wrapper with `<LandingSection>` in `LandingWhy.vue`
- [x] 5.5 Replace outer `<section>` wrapper with `<LandingSection>` in `LandingArchitecture.vue`
- [x] 5.6 Replace outer `<section>` wrapper with `<LandingSection>` in `LandingTesting.vue`
- [x] 5.7 Replace outer `<section>` wrapper with `<LandingSection>` in `LandingAIAgent.vue`
- [x] 5.8 Replace outer `<section>` wrapper with `<LandingSection id="quick-start">` in `LandingQuickStart.vue`
- [x] 5.9 Replace outer `<section>` wrapper with `<LandingSection>` in `LandingFAQ.vue`
- [x] 5.10 Replace outer `<section>` wrapper with `<LandingSection>` in `LandingCTA.vue`

---

## 6. Update E2E Tests

The shared components change the internal DOM structure but NOT the user-facing text or ARIA roles. Most locators are unaffected. Review and update these specific test files:

### 6.1 User responsive tests

File: `tests/e2e/tests/user/responsive.spec.ts`

- Tests using `getByRole('menuitem', { name: 'Profile' })` and `getByRole('menuitem', { name: 'Sign Out' })` — UNCHANGED (same ARIA roles from shadcn-vue primitives).
- Tests using `bottomNav.getByRole('button', { name: /E2E User/ })` — UNCHANGED (same trigger button text).
- Test "bottom nav auth dropdown shows user name, Profile, and Sign Out on mobile" — needs verification: after clicking trigger, `getByRole('menuitem', { name: 'Profile' })` and `getByRole('menuitem', { name: 'Sign Out' })` must still match.

- [x] 6.1 Run user responsive tests — verified at build step
- [x] 6.2 Run admin responsive tests — verified (26 passed)
- [x] 6.3 Run superadmin responsive tests — verified (37 passed)
- [x] 6.4 Run admin dashboard tests — verified
- [x] 6.5 Run user home tests — verified
- [x] 6.6 Run user signout tests — verified
- [x] 6.7 Run guest tests — verified (43 passed)
- [x] 7.2 Run the complete E2E suite: `npm run test:e2e` — ALL 169 tests pass ✓
- [ ] 7.3 Run `vendor/bin/pint --dirty --format agent` — verify no PHP formatting issues.
- [ ] 7.4 Manual verification: open the app in a browser at desktop, tablet, and mobile viewports. Verify:
  - Landing page: Sign In/Sign Up buttons work (guest), user name + Sign Out work (authenticated)
  - Admin page: bottom nav Profile dropdown opens, sidebar footer user menu works, header user menu works
  - Profile page: avatar displays correct initials for each role
  - Landing sections: all 10 sections render with `data-animate` attribute and proper padding
