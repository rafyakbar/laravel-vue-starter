# Upgrading

> Source: https://spatie.be/docs/laravel-permission/v7/upgrading

## General Upgrade Checklist

1. Bump the version in `composer.json` and run `composer update`.
2. Compare the published migration stub with the new version; create additional migrations if the schema changed.
3. Re-publish or manually update `config/permission.php`.
4. Update any classes that extend package models.
5. Review overridden methods and traits for signature changes.
6. Check for contract or interface modifications.

## v6 to v7 Breaking Changes

| Area | Change |
|------|--------|
| Minimum versions | PHP 8.3+, Laravel 12+ |
| Service provider | Now extends `PackageServiceProvider` from `spatie/laravel-package-tools` |
| Lumen | Support removed entirely |
| Event classes | Renamed with `Event` suffix (e.g., `PermissionAttached` → `PermissionAttachedEvent`) |
| Command classes | Renamed with `Command` suffix |
| Removed method | `PermissionRegistrar::clearClassPermissions()` — use `clearPermissionsCollection()` instead |
| Return types | Methods like `givePermissionTo()`, `assignRole()` now return `static` |
