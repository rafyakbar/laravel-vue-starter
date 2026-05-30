# UUID and ULID Support

> Source: https://spatie.be/docs/laravel-permission/v7/advanced-usage/uuid

## Updating Migrations for UUIDs

To use UUIDs as primary keys for your user models, modify the migration files:

- In both `model_has_permissions` and `model_has_roles` pivot tables, change the `unsignedBigInteger` column for `model_morph_key` to `uuid`.

## UUIDs for Roles and Permissions Themselves

If you want the `Role` and `Permission` models to use UUIDs as their primary keys:

1. Replace `bigIncrements('id')` with `uuid('uuid')->primary()->unique()` in the roles and permissions table migrations.
2. Update all foreign key references across the migration files to point to the new UUID column.

## Configuration Adjustments

Optionally rename the `model_morph_key` column from `model_id` to `model_uuid` in the config to better reflect its purpose.

## Model Changes

Extend the package's `Role` and `Permission` models and add Laravel's `HasUuids` trait to your extended classes:

```php
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Role extends \Spatie\Permission\Models\Role
{
    use HasUuids;
}
```

## Updating the Config

Point `config/permission.php` to your extended model classes so the package uses them instead of the defaults:

```php
'models' => [
    'permission' => App\Models\Permission::class,
    'role' => App\Models\Role::class,
],
```

## Important Note

This is not a comprehensive UUID implementation guide. The exact approach depends on your application's UUID strategy and whether you use UUIDs for users only or for roles and permissions as well.
