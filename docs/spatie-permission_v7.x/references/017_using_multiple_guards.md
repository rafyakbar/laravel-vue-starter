# Using Multiple Guards

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/multiple-guards

Guards act as namespaces — each guard maintains its own separate set of roles and permissions.

## Creating Guard-Specific Roles and Permissions

Every guard requires its own records. For example, "edit-article" must be created separately for each guard:

```php
Role::create(['guard_name' => 'admin', 'name' => 'manager']);
```

## Checking with a Specific Guard

```php
$user->hasPermissionTo('publish articles', 'admin');
```

In Blade:

```blade
@role('super-admin', 'admin')
```

## Forcing a Single Guard on a Model

Set the property and default method on your User model:

```php
protected $guard_name = 'web';

public function getDefaultGuardName(): string { return 'web'; }
```

## Guard Resolution Order

The package determines the guard in this priority:

1. `guardName()` method on the model
2. `$guard_name` property on the model
3. First matching guard found in `config/auth.php`
4. `auth.defaults.guard` fallback

## Multi-Guard Users

To allow a user to operate under multiple guards, set `$guard_name` to an array or have `guardName()` return one:

```php
protected $guard_name = ['web', 'admin'];
```

## Tip

If your application uses a single non-web guard, reorder `config/auth.php` so that guard appears first in the list.
