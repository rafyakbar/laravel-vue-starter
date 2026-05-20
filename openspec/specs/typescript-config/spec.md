## ADDED Requirements

### Requirement: TypeScript compiles Vue and TS files without errors
The system SHALL include TypeScript configuration that allows `vue-tsc --noEmit` to pass with zero errors on the initial project scaffold.

#### Scenario: Type-checking passes on clean project
- **WHEN** `npx vue-tsc --noEmit` is executed
- **THEN** the command exits with code 0 and no type errors

### Requirement: Path alias @ resolves to resources/app
The TypeScript configuration SHALL define a path alias `@/*` that maps to `resources/app/*`, matching the Vite resolve alias.

#### Scenario: Imports using @ alias resolve in IDE
- **WHEN** a `.ts` or `.vue` file imports `import { cn } from '@/lib/utils'`
- **THEN** TypeScript resolves the import to `resources/app/lib/utils.ts` without errors

### Requirement: Vue single-file component types are recognized
The TypeScript configuration SHALL include a type shim so that `.vue` file imports are recognized as valid modules.

#### Scenario: Importing .vue files in TypeScript
- **WHEN** a `.ts` file contains `import App from './App.vue'`
- **THEN** TypeScript does not report a "cannot find module" error

### Requirement: Strict mode is enabled
The TypeScript configuration SHALL enable strict mode (`"strict": true`) for maximum type safety.

#### Scenario: Null checks are enforced
- **WHEN** code accesses a potentially null value without a null check
- **THEN** TypeScript reports a compile-time error

### Requirement: TypeScript targets modern ES output
The TypeScript configuration SHALL target `ESNext` for module and emit, deferring bundling to Vite.

#### Scenario: Modern syntax is preserved
- **WHEN** source code uses optional chaining (`?.`) or nullish coalescing (`??`)
- **THEN** TypeScript does not downlevel these to older syntax (Vite handles browser targeting)
