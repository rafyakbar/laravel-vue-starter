# Caching

> Source: https://spatie.be/docs/laravel-permission/v7/advanced-usage/cache

## Why Caching Matters

Role and permission data is cached to avoid repeated database queries on every authorization check, significantly improving performance.

## Automatic Cache Refresh

The package's built-in methods handle cache invalidation automatically:

- `givePermissionTo()`, `revokePermissionTo()`, `syncPermissions()`
- `assignRole()`, `removeRole()`, `syncRoles()`

Creating or deleting `Role` and `Permission` records also triggers a cache clear through the `RefreshesPermissionCache` trait.

## User-Specific Assignments

Assigning roles or permissions directly to a user only affects the in-memory state and does not require a cache reset.

## Manual Cache Reset

When needed, you can clear the cache programmatically or via Artisan:

```php
app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
```

```bash
php artisan permission:cache-reset
```

## Laravel Octane

If your application runs on Octane and the cache persists across requests, set `register_octane_reset_listener` to `true` in the configuration file.

## Configuration Options

| Setting | Default | Description |
|---|---|---|
| `cache.expiration_time` | 24 hours | How long cached data remains valid |
| `cache.key` | `spatie.permission.cache` | The cache key prefix used |
| `cache.store` | Default Laravel store | Any configured Laravel cache driver |

## Disabling the Cache

Set `cache.store` to `array` in the config file, or set `CACHE_DRIVER=array` in your `.env` file to effectively disable persistent caching.

## Multi-Tenant Applications

When switching between tenants, you may need to call `initializeCache()` to reload the correct permission set for the active tenant.

## Database Cache Driver

If you use the database as your cache store, make sure Laravel's cache tables migration has been published and executed.

## File Cache Driver

When PHP CLI and PHP-FPM run under different system users, the file cache driver may encounter permission conflicts. Consider using a different cache store in such environments.
