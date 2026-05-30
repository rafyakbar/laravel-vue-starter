# Performance Tips

> Source: https://spatie.be/docs/laravel-permission/v7/best-practices/performance

For most small-to-medium applications, the default behavior performs well. These optimizations are only necessary at scale.

## Assigning Permissions Efficiently

When adding or removing permissions frequently, prefer assigning from the permission side:

```php
// Potentially faster
$permission->assignRole($role);

// Instead of
$role->givePermissionTo($permission);
```

## Bulk Creating Records

For large databases, using `saveOrFail()` can outperform `create()`:

```php
Permission::make(['name' => 'edit articles'])->saveOrFail();

// Instead of
Permission::create(['name' => 'edit articles']);
```

## Manual Cache Management

The package automatically resets its cache when you use built-in methods like `givePermissionTo()` or `assignRole()`. However, if you modify the database directly (bypassing package methods), you must reset the cache manually:

```php
use Spatie\Permission\PermissionRegistrar;

app(PermissionRegistrar::class)->forgetCachedPermissions();
```

## When to Optimize

These tips are generally unnecessary for small applications. Focus on them only when you observe measurable performance issues related to permission checks or database operations.
