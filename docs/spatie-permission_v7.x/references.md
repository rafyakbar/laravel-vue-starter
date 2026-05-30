# Spatie Laravel Permission v7.x

> Manage user permissions and roles in Laravel applications using the spatie/laravel-permission package.

## Overview

This documentation covers the spatie/laravel-permission v7.x package, which provides a flexible way to manage user permissions and roles in Laravel applications. It targets Laravel developers who need role-based access control (RBAC) with support for direct permissions, wildcard permissions, teams, multiple guards, and more. The package integrates with Laravel's Gate and authorization layer.

## Key Concepts

- **Roles** — Named groups that bundle permissions together and are assigned to users
- **Permissions** — Granular access rules (e.g., "edit articles") that control what actions are allowed
- **HasRoles Trait** — The trait added to the User model to enable all package features
- **Gate Integration** — All permissions are registered on Laravel's Gate, enabling `can()` and `@can` checks
- **Guard Names** — Namespaces for permissions/roles when using multiple authentication guards
- **Wildcard Permissions** — Dot-separated permission strings with `*` wildcards for flexible access schemes
- **Teams Permissions** — Multi-tenant support where roles/permissions are scoped per team
- **Super Admin** — A pattern using `Gate::before()` to grant all permissions to a designated role

## References

- [001_introduction.md](references/001_introduction.md): Package overview and core capabilities
- [002_support_us.md](references/002_support_us.md): How to support the package maintainers
- [003_prerequisites.md](references/003_prerequisites.md): Requirements, compatibility, and model constraints
- [004_installation_in_laravel.md](references/004_installation_in_laravel.md): Step-by-step installation guide
- [005_upgrading.md](references/005_upgrading.md): Upgrade paths between major versions
- [006_questions_and_issues.md](references/006_questions_and_issues.md): Where to get help and report bugs
- [007_changelog.md](references/007_changelog.md): Link to version history
- [008_about_us.md](references/008_about_us.md): About Spatie and package origins
- [009_basic_usage.md](references/009_basic_usage.md): Core API for creating roles, permissions, and assigning them
- [010_direct_permissions.md](references/010_direct_permissions.md): Assigning permissions directly to users
- [011_using_permissions_via_roles.md](references/011_using_permissions_via_roles.md): Role assignment, checking, and permission management via roles
- [012_enums.md](references/012_enums.md): Using PHP BackedEnums for roles and permissions
- [013_teams_permissions.md](references/013_teams_permissions.md): Multi-team permission scoping
- [014_wildcard_permissions.md](references/014_wildcard_permissions.md): Dot-separated wildcard permission syntax
- [015_blade_directives.md](references/015_blade_directives.md): Blade template directives for authorization checks
- [016_defining_a_super_admin.md](references/016_defining_a_super_admin.md): Implementing super-admin via Gate::before/after
- [017_using_multiple_guards.md](references/017_using_multiple_guards.md): Working with multiple authentication guards
- [018_artisan_commands.md](references/018_artisan_commands.md): CLI commands for managing roles and permissions
- [019_middleware.md](references/019_middleware.md): Route and controller middleware for access control
- [020_passport_client_credentials_grant_usage.md](references/020_passport_client_credentials_grant_usage.md): Integration with Laravel Passport client credentials
- [021_example_app.md](references/021_example_app.md): Setting up a demo application
- [022_roles_vs_permissions.md](references/022_roles_vs_permissions.md): Best practices for roles vs permissions design
- [023_model_policies.md](references/023_model_policies.md): Using Laravel model policies with the package
- [024_performance_tips.md](references/024_performance_tips.md): Optimization strategies for large datasets
- [025_testing.md](references/025_testing.md): Testing considerations and cache clearing
- [026_database_seeding.md](references/026_database_seeding.md): Seeding roles and permissions
- [027_exceptions.md](references/027_exceptions.md): Handling package exceptions
- [028_extending.md](references/028_extending.md): Extending models and adding custom fields
- [029_cache.md](references/029_cache.md): Cache configuration, reset, and optimization
- [030_events.md](references/030_events.md): Event classes fired on role/permission changes
- [031_custom_permission_check.md](references/031_custom_permission_check.md): Replacing the default Gate-based permission check
- [032_uuid_ulid.md](references/032_uuid_ulid.md): Using UUIDs and ULIDs with the package
- [033_phpstorm_interaction.md](references/033_phpstorm_interaction.md): PhpStorm Blade directive configuration
- [034_other.md](references/034_other.md): Schema diagrams and miscellaneous resources
- [035_timestamps.md](references/035_timestamps.md): Managing timestamps on pivot tables
- [036_ui_options.md](references/036_ui_options.md): UI packages and resources for managing permissions

## Links

- Website: https://spatie.be/docs/laravel-permission/v7
- GitHub: https://github.com/spatie/laravel-permission
- Documentation: https://spatie.be/docs/laravel-permission/v7/introduction
