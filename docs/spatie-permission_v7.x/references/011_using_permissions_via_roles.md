# Using Permissions via Roles

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/role-permissions

## Assigning & Removing Roles

```php
$user->assignRole('writer');
$user->removeRole('writer');
$user->syncRoles(['writer', 'admin']);
```

All methods accept multiple arguments or arrays.

## Role-Side Assignment

Assign or remove a role from the role object itself:

```php
$role->assignToModels([$user1, $user2]);
$role->removeFromModels($user1);
$role->syncModels([$user2]);
```

## Checking Roles on a User

```php
$user->hasRole('writer');
$user->hasAnyRole(['writer', 'admin']);
$user->hasAllRoles(Role::all());
$user->hasExactRoles(Role::all());  // Must match exactly, no more, no fewer
```

## Managing Role Permissions

```php
$role->givePermissionTo('edit articles');
$role->hasPermissionTo('edit articles');
$role->revokePermissionTo('edit articles');
$role->syncPermissions(['edit articles', 'delete articles']);
```

## Accessing the Permission Collection

```php
$role->permissions;                    // Eloquent collection
$role->permissions->pluck('name');     // Collection of name strings
```

## Direct Permissions Alongside Roles

Users can hold direct permissions in addition to those inherited from roles:

```php
$user->givePermissionTo('delete articles');  // Direct permission
```

Verify direct permissions with:

```php
$user->hasDirectPermission('delete articles');
$user->hasAllDirectPermissions([...]);
$user->hasAnyDirectPermission([...]);
```
