## ADDED Requirements

### Requirement: UserInitials reusable avatar component
The system SHALL provide a reusable `UserInitials` component in `resources/app/components/shared/` that renders a shadcn-vue Avatar with computed initials from a user's name. The component MUST accept `name`, `email`, `size`, `showName`, and `showEmail` props. The initials MUST be computed as the first letters of each word in the name, uppercased, truncated to 2 characters.

#### Scenario: UserInitials renders avatar with initials
- **WHEN** `UserInitials` is rendered with `name="Super Admin"`
- **THEN** the avatar fallback displays "SA"

#### Scenario: UserInitials shows name and email when enabled
- **WHEN** `UserInitials` is rendered with `name="E2E User"`, `email="e2e_user@example.com"`, `showName`, and `showEmail` props
- **THEN** the text "E2E User" and "e2e_user@example.com" are visible adjacent to the avatar

#### Scenario: UserInitials handles single-word names
- **WHEN** `UserInitials` is rendered with `name="Admin"`
- **THEN** the avatar fallback displays "A"

#### Scenario: UserInitials respects size prop
- **WHEN** `UserInitials` is rendered with `size="lg"`
- **THEN** the avatar dimensions match the large size variant

### Requirement: LandingSection reusable wrapper component
The system SHALL provide a reusable `LandingSection` component in `resources/app/components/shared/` that wraps content in a section element with `data-animate` attribute, responsive padding (`px-4 py-20 sm:px-6 lg:px-8`), and a centered inner container (`mx-auto max-w-5xl`). The component MUST accept an optional `id` prop for anchor links and render its content via a default `<slot />`.

#### Scenario: LandingSection renders with data-animate and responsive padding
- **WHEN** `LandingSection` is rendered with child content
- **THEN** the `<section>` element has `data-animate` attribute and the padding classes `px-4 py-20 sm:px-6 lg:px-8`

#### Scenario: LandingSection applies optional id prop
- **WHEN** `LandingSection` is rendered with `id="hero"`
- **THEN** the `<section>` element has `id="hero"`

#### Scenario: LandingSection renders child content in centered container
- **WHEN** `LandingSection` wraps a heading
- **THEN** the heading is rendered inside a `<div class="mx-auto max-w-5xl">` within the section

### Requirement: useNavActive composable
The system SHALL provide a `useNavActive` composable in `resources/app/composables/useNavActive.ts` that returns an `isActive(routeName: string): boolean` function checking whether the current route name matches the given name. The composable MUST use `useRoute()` from Vue Router internally.

#### Scenario: useNavActive returns true for current route
- **WHEN** the current route is `home` and `isActive('home')` is called
- **THEN** the function returns `true`

#### Scenario: useNavActive returns false for different route
- **WHEN** the current route is `home` and `isActive('about')` is called
- **THEN** the function returns `false`

#### Scenario: useNavActive is reactive
- **WHEN** the route changes from `home` to `features`
- **THEN** `isActive('home')` changes from `true` to `false` and `isActive('features')` changes from `false` to `true`
