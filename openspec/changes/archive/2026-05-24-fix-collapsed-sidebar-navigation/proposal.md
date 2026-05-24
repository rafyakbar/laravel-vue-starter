## Why

When the admin sidebar is collapsed to icon-only mode (`collapsible="icon"`), menu items become unusable:

1. **Items with children (Settings group)** — clicking the Settings icon toggles a `Collapsible`, but all child items are hidden via `group-data-[collapsible=icon]:hidden` CSS. The toggle has no visible effect, making user/role management inaccessible in collapsed mode.
2. **Items without children (Dashboard)** — no tooltip appears on hover, so users can't identify the icon's purpose. The icon is clickable but provides no visual feedback.

This breaks the core collapsed sidebar UX: users who collapse the sidebar to save screen space lose access to all navigation except the Site link.

## What Changes

- **Collapsed sidebar items without children** gain `tooltip` props so hover reveals the label (Dashboard → "Dashboard" tooltip).
- **Collapsed sidebar items with children (Settings group)** switch from `Collapsible` to `DropdownMenu` — clicking the icon opens a floating dropdown with child items (Users, Roles & Permissions), each with its icon and label.
- **Expanded sidebar** behavior remains unchanged — `Collapsible` continues to work as before.
- **Sidebar state awareness** — `AdminSidebar.vue` reads `state` from `useSidebar()` to conditionally render the correct interaction pattern.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `admin-layout`: Collapsed sidebar navigation now supports clickable menu items — leaf items show tooltips on hover, items with children open a floating dropdown menu instead of a non-functional collapsible.

## Impact

- **Modified files**: `resources/app/components/admin/AdminSidebar.vue` (conditional rendering based on `state`, add `DropdownMenu` for collapsed group items, add `tooltip` to leaf items)
- **Dependencies**: None — uses existing shadcn-vue components (`DropdownMenu`, `Tooltip`) already installed
- **No backend changes**
- **No breaking changes** — expanded sidebar behavior is identical
