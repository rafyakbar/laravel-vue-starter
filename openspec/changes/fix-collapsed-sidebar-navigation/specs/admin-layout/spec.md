## MODIFIED Requirements

### Requirement: Collapsed sidebar menu items are clickable and functional

The system SHALL ensure all sidebar menu items remain fully interactive when the sidebar is collapsed to icon-only mode (`collapsible="icon"`). Leaf items (without children) SHALL display a tooltip on hover showing the item label. Group items (with children) SHALL open a floating dropdown menu when clicked, displaying all child items with their icons and labels.

#### Scenario: Leaf item shows tooltip on hover in collapsed mode
- **WHEN** the sidebar is collapsed to icon-only mode and the user hovers over a leaf menu item (e.g., Dashboard icon)
- **THEN** a tooltip appears displaying the item's label (e.g., "Dashboard")

#### Scenario: Leaf item navigates when clicked in collapsed mode
- **WHEN** the sidebar is collapsed and the user clicks a leaf menu item icon (e.g., Dashboard)
- **THEN** the router navigates to the corresponding route (e.g., `/admin`)

#### Scenario: Group item opens dropdown menu in collapsed mode
- **WHEN** the sidebar is collapsed and the user clicks a group menu item icon (e.g., Settings)
- **THEN** a floating dropdown menu appears to the right of the sidebar, showing all child items with their icons and labels

#### Scenario: Dropdown menu child items are navigable
- **WHEN** the dropdown menu is open in collapsed mode and the user clicks a child item (e.g., "Users" or "Roles & Permissions")
- **THEN** the router navigates to the child item's route and the dropdown closes

#### Scenario: Dropdown menu closes on outside click
- **WHEN** the dropdown menu is open in collapsed mode and the user clicks outside the menu
- **THEN** the dropdown menu closes without navigation

### Requirement: Expanded sidebar group items use inline collapsible

The system SHALL use an inline `Collapsible` pattern for group items when the sidebar is expanded. Clicking the group heading expands or collapses the child items within the sidebar content area.

#### Scenario: Settings group expands inline in expanded mode
- **WHEN** the sidebar is expanded and the user clicks the "Settings" group heading
- **THEN** the group expands inline to show child items (Users, Roles & Permissions) within the sidebar

#### Scenario: Settings group collapses inline in expanded mode
- **WHEN** the Settings group is expanded and the user clicks the group heading again
- **THEN** the group collapses, hiding the child items

## REMOVED Requirements

### Requirement: Settings group is collapsible (in all states)

**Reason**: The original requirement assumed `Collapsible` works in both expanded and collapsed states, but `SidebarMenuSub` and `SidebarMenuSubButton` are hidden via `group-data-[collapsible=icon]:hidden` CSS in collapsed mode, making the collapsible toggle non-functional.

**Migration**: Replaced by two state-specific behaviors:
- Expanded mode: inline `Collapsible` (existing behavior preserved)
- Collapsed mode: floating `DropdownMenu` (new behavior)
