# Teams Permissions

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/teams-permissions

Teams permissions provide multi-tenant scoping, allowing roles and permissions to be isolated per team or organization.

## Configuration

Enable teams support in your `config/permission.php` file:

```php
'teams' => true,
'team_foreign_key' => 'custom_team_id', // optional, defaults to 'team_id'
```

You must configure this **before** running migrations. If the package is already installed, use:

```bash
php artisan permission:setup-teams
```

## Setting the Global Team ID

Use middleware to set the active team context globally:

```php
setPermissionsTeamId(session('team_id'));
```

**Important:** The middleware must run before `SubstituteBindings` in the priority chain; otherwise you may receive a 404 response instead of a 403.

## Creating Roles with Teams

- Pass a `team_id` when creating a role to scope it to a specific team.
- A `null` team_id creates a **global role** (name must be unique across all teams).
- A non-null team_id creates a **team-scoped role** (the same name can exist on different teams).

## Switching Teams

When a user switches teams, reset cached relations before performing authorization checks:

```php
setPermissionsTeamId($newTeamId);
$user->unsetRelation('roles')->unsetRelation('permissions');
```

## Super Admin with Teams

To grant a Super Admin role globally, assign it inside the team model's `boot()` method while temporarily setting the team_id context.
