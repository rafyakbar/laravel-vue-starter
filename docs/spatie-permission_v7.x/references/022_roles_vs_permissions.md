# Roles vs Permissions — Design Best Practices

> Source: https://spatie.be/docs/laravel-permission/v7/best-practices/roles-vs-permissions

Understanding the distinction between roles and permissions leads to a cleaner, more maintainable authorization system.

## Core Concepts

| Concept | Purpose |
|---|---|
| **Roles** | Group users by responsibility (e.g., "Manager", "Editor"). Assign roles to users. |
| **Permissions** | Represent granular actions (e.g., "view document", "edit document"). Assign permissions to roles. |

## Key Principles

- **Users inherit permissions through roles.** Direct permission assignments to users should be rare.
- **Permission names should be static and developer-controlled.** They represent specific actions in your code.
- **Role names can change freely.** They are administrative labels that can be renamed without breaking authorization logic.

## Where to Check What

| Layer | Check |
|---|---|
| Views / Blade templates | Permission names (`@can`) |
| Policies | Permission names (`$user->can()`) |
| Controllers | Permission names (`$user->can()`) |
| Middleware / Routes | Role names are acceptable when grouping makes sense |

## The Golden Rule

Always use `@can` and `can()` (permission-based checks) instead of `hasRole()` (role-based checks) throughout your application. This ensures that renaming or restructuring roles never breaks your authorization logic.
