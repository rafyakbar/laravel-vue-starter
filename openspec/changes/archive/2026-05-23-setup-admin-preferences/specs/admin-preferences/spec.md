## ADDED Requirements

### Requirement: Theme preference with light, dark, and system options
The system SHALL allow users to switch between light, dark, and system (OS-following) themes. The selected theme SHALL be persisted to localStorage and applied immediately without page reload.

#### Scenario: User selects dark theme
- **WHEN** the user selects "Dark" in the preferences menu
- **THEN** the `dark` class is added to `<html>` and the UI switches to dark mode immediately

#### Scenario: User selects light theme
- **WHEN** the user selects "Light" in the preferences menu
- **THEN** the `dark` class is removed from `<html>` and the UI switches to light mode immediately

#### Scenario: User selects system theme
- **WHEN** the user selects "System" in the preferences menu
- **THEN** the theme follows the OS `prefers-color-scheme` setting and updates automatically if the OS setting changes

#### Scenario: Theme persists across page refreshes
- **WHEN** the user refreshes the page after selecting a theme
- **THEN** the previously selected theme is restored from localStorage before the app mounts (no flash)

### Requirement: Language preference with English and Indonesian options
The system SHALL allow users to switch between English (en) and Indonesian (id) languages. The selected locale SHALL be persisted to localStorage and applied immediately.

#### Scenario: User switches to Indonesian
- **WHEN** the user selects "Indonesia" in the preferences menu
- **THEN** navigation labels and UI text switch to Indonesian immediately

#### Scenario: User switches to English
- **WHEN** the user selects "English" in the preferences menu
- **THEN** navigation labels and UI text switch to English immediately

#### Scenario: Locale persists across page refreshes
- **WHEN** the user refreshes the page after selecting a locale
- **THEN** the previously selected locale is restored from localStorage

### Requirement: Preferences menu in admin header
The system SHALL provide a preferences dropdown menu in the admin header, accessible via a SunMoon icon button, containing theme and language controls.

#### Scenario: Preferences menu opens on click
- **WHEN** the user clicks the preferences icon button in the header
- **THEN** a dropdown menu appears with theme options (Light, Dark, System) and language options (English, Indonesia)

#### Scenario: Active theme and locale are visually indicated
- **WHEN** the preferences menu is open
- **THEN** the currently active theme and locale options are visually highlighted (e.g., checkmark or active state)

### Requirement: Preferences store persists theme and locale
The system SHALL provide a `usePreferencesStore` Pinia store that manages theme and locale state, persisting changes to localStorage.

#### Scenario: Store initializes from localStorage
- **WHEN** the app loads
- **THEN** the preferences store reads theme and locale from localStorage, defaulting to system/en if not set
