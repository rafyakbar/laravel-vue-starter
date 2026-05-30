# Using Enums

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/enums

PHP Backed Enums are supported for defining roles and permissions, providing type safety across your application.

## Defining an Enum

```php
enum RolesEnum: string
{
    case WRITER = 'writer';
    case EDITOR = 'editor';
}
```

## Creating Roles with Enums

```php
use Spatie\Permission\Models\Role;

Role::findOrCreate(enum_value(RolesEnum::WRITER), 'web');
```

## Authorization with Enums

```php
$user->hasPermissionTo(PermissionsEnum::VIEWPOSTS);
```

In Blade templates, unwrap the enum value:

```blade
@can(enum_value(PermissionsEnum::VIEWPOSTS))
    <!-- authorized content -->
@endcan
```

## Supported Methods

The following methods accept enum cases directly:

- `assignRole()` / `removeRole()`
- `givePermissionTo()` / `revokePermissionTo()`
- `hasPermissionTo()` / `hasAnyPermission()`
- `hasDirectPermission()`
- `hasRole()` / `hasAllRoles()` / `hasExactRoles()`

## Limitation

Using `$casts` on the Permission model to automatically cast to enums is **not** supported in v6 or v7.
