# Testing

> Source: https://spatie.be/docs/laravel-permission/v7/advanced-usage/testing

## Cache Clearing in Tests

Always clear the permission cache inside your test's `setUp()` method to avoid stale data between test cases:

```php
$this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
```

## LazilyRefreshDatabase Compatibility

When using `LazilyRefreshDatabase`, wrap your seeder calls inside a `DatabaseRefreshed` event listener. Make sure to invoke `forgetCachedPermissions()` **after** seeding completes, not before.

## Disabling or Shortening Cache

To prevent cache interference during testing, you can either:

- Set the cache driver to `array` in your `phpunit.xml` configuration.
- Reduce the cache expiration time to 1 second so entries expire almost instantly.

## Using Factories for Roles and Permissions

If your application permits user-defined roles or permissions, you may want to create factories. To do so:

1. Extend the base `Role` and `Permission` models.
2. Add the `HasFactory` trait to your extended models.
3. Define the corresponding factory classes.

## Seeders vs. Factories

Most applications rely on seeders to establish a fixed set of roles and permissions rather than using factories. Factories are more appropriate when roles and permissions are dynamic and managed by end users.
