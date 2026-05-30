# UI Options for Managing Permissions

> Source: https://spatie.be/docs/laravel-permission/v7/advanced-usage/ui-options

## No Built-In UI

The package intentionally does not ship with a user interface for managing roles and permissions. You are expected to build one that fits your application's specific needs.

## Do You Need a UI?

Before building an admin panel, consider whether a UI is actually necessary. Many applications have a fixed set of roles and permissions that are better managed through seeders and code. The "No Compromises" podcast episode discusses this decision in depth.

## Available Options

If you do need a UI, several community-built solutions exist:

### Video Tutorials

- **Code With Tony** — A video series walking through the creation of an admin panel for role and permission management.
- **Mark Twigg** — A series covering the underlying theory of Gates, Roles, and Users in Laravel's authorization system.

### FilamentPHP

- A dedicated Filament plugin is available for managing roles and permissions within a Filament admin panel.

### Laravel Nova

- Packages by **@vyuldashev** and **@paras-malhotra** provide Nova resources for role and permission management.

### Standalone Packages

- **Laravel User Management** by Mekaeil — A ready-made user management solution.
- **InfyOm** — UI boilerplate generation that includes permission management screens.
- **LiveWire Base Admin Panel** by AliQasemzadeh — A Livewire-based admin panel starter.
- **JetAdmin** and **QuickPanel** — TALL stack (Tailwind, Alpine, Laravel, Livewire) admin solutions.

## Choosing the Right Approach

Select a UI option based on your existing tech stack (Blade, Livewire, Inertia, Filament, Nova) and the level of customization you require. For simple applications, seeders and code-based management may be sufficient.
