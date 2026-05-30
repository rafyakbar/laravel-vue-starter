# Database Seeding

> Source: https://spatie.be/docs/laravel-permission/v7/advanced-usage/seeding

## Flush Cache Before Seeding

Before running any seeder that creates roles or permissions, clear the cached permission data:

```php
app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
```

## Using WithoutModelEvents

If your seeder uses the `WithoutModelEvents` trait, you must flush the cache a second time after creating roles and permissions but before assigning them to users.

## Database Cache Store

When using the database as your cache store, ensure that Laravel's cache tables migration has been installed and run first.

## Recommended Seeder Flow

A typical seeder follows this sequence:

1. Clear the permission cache.
2. Create all required permissions.
3. Flush the cache again.
4. Create roles and assign the appropriate permissions to each role.

## Factory States for User Seeding

When seeding users with specific roles, leverage the `afterCreating()` callback in your factory to handle role assignment after the user record is persisted.

## Handling Large Datasets

For bulk inserts, use `Permission::insert()` or raw `DB::insert()` queries to bypass Eloquent's internal checks and improve performance. After performing direct inserts, you must manually flush the cache.

## Important Caution

Direct database queries skip the package's built-in cache management. Always call `forgetCachedPermissions()` manually after any raw insert, update, or delete operation on roles or permissions.
