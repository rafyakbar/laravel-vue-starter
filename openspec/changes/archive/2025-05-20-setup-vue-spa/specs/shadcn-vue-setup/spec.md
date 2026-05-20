## ADDED Requirements

### Requirement: shadcn-vue dependencies are installed
The system SHALL have all required shadcn-vue peer dependencies installed: `radix-vue`, `class-variance-authority`, `clsx`, `tailwind-merge`, and `lucide-vue-next`.

#### Scenario: Dependencies resolve without errors
- **WHEN** `npm install` completes
- **THEN** all shadcn-vue peer dependencies are present in `node_modules` and importable

### Requirement: cn utility function is available
The system SHALL provide a `cn()` utility function at `@/lib/utils.ts` that merges Tailwind classes using `clsx` and `tailwind-merge`.

#### Scenario: cn merges classes correctly
- **WHEN** `cn('px-4 py-2', 'px-6')` is called
- **THEN** it returns `'px-6 py-2'` (tailwind-merge deduplicates conflicting utilities)

#### Scenario: cn handles conditional classes
- **WHEN** `cn('base', false && 'hidden', 'extra')` is called
- **THEN** it returns `'base extra'` (falsy values are excluded)

### Requirement: shadcn-vue components.json configuration exists
The system SHALL include a `components.json` at the project root that configures shadcn-vue for the project's directory structure and Tailwind CSS 4.

#### Scenario: shadcn-vue CLI can add components
- **WHEN** `npx shadcn-vue@latest add button` is executed
- **THEN** the component is created at `resources/app/components/ui/button/` following the paths in `components.json`

### Requirement: CSS variables for shadcn-vue theming are defined
The system SHALL define HSL-based CSS variables in `resources/app/assets/css/app.css` for shadcn-vue's design token system (background, foreground, primary, secondary, etc.).

#### Scenario: Theme variables are available at runtime
- **WHEN** the application loads in the browser
- **THEN** CSS custom properties `--background`, `--foreground`, `--primary`, `--primary-foreground`, etc. are defined on `:root`

#### Scenario: Dark mode variables are scoped to .dark class
- **WHEN** the `<html>` element has class `dark`
- **THEN** dark-mode CSS variable values override the light-mode defaults

### Requirement: Tailwind CSS 4 is configured for shadcn-vue
The system SHALL configure Tailwind CSS 4 to use the shadcn-vue CSS variables via the `@theme` directive for colors, border-radius, and other design tokens.

#### Scenario: Tailwind utilities use theme tokens
- **WHEN** a component uses class `bg-primary text-primary-foreground`
- **THEN** the rendered styles use the HSL values from the CSS variables
