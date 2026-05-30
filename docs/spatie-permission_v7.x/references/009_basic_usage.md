# Basic Usage

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/basic-usage

## Setup

Add the `HasRoles` trait to your User model:

```php
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
}
```

## Creating Roles & Permissions

```php
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

$role = Role::create(['name' => 'writer']);
$permission = Permission::create(['name' => 'edit articles']);
```

## Linking Roles and Permissions

```php
$role->givePermissionTo($permission);
$permission->assignRole($role);

$role->syncPermissions($permissions);
$permission->syncRoles($roles);

$role->revokePermissionTo($permission);
$permission->removeRole($role);
```

## Retrieving User Permissions

```php
$user->getPermissionNames();        // Collection of permission name strings
$user->permissions;                 // All permissions (direct + via roles)
$user->getDirectPermissions();      // Only directly assigned permissions
$user->getPermissionsViaRoles();    // Only permissions inherited through roles
$user->getAllPermissions();         // Full merged collection
```

## Query Scopes

```php
User::role('writer')->get();
User::withoutRole('editor')->get();
User::permission('edit articles')->get();
```

## Eloquent Relationships

```php
User::with('roles')->get();
Role::all()->pluck('name');
```
