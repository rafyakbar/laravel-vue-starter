# Direct Permissions

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/direct-permissions

The recommended approach is to assign permissions to roles rather than directly to users. However, the package fully supports direct user-permission assignment when needed.

## Assigning & Revoking

```php
$user->givePermissionTo('edit articles');
$user->revokePermissionTo('edit articles');
$user->syncPermissions(['edit articles', 'delete articles']);
```

All methods accept multiple arguments, arrays, or permission models.

## Checking Permissions

| Method | Super-Admin aware? | Description |
|--------|-------------------|-------------|
| `$user->can('edit articles')` | Yes | Uses Laravel Gate; respects Super-Admin |
| `$user->hasPermissionTo('edit articles')` | No | Direct package check |
| `$user->hasAnyPermission([...])` | No | True if user has at least one listed permission |
| `$user->hasAllPermissions([...])` | No | True only if user has every listed permission |

Both permission name strings and integer IDs are accepted as arguments.
