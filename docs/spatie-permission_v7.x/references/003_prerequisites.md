# Prerequisites

> Source: https://spatie.be/docs/laravel-permission/v7/prerequisites

## Version Requirements

| Laravel | Package Version | PHP |
|---------|----------------|-----|
| 12 / 13 | `^7.0` | 8.3+ |

## User Model Constraints

- The model must implement `Illuminate\Contracts\Auth\Access\Authorizable`.
- Do **not** define properties or methods named `role`, `roles`, `permission`, or `permissions` on the User model — these names conflict with the `HasRoles` trait.

## Configuration File

Publishing the package creates `config/permission.php`. Ensure no existing file with that name is already present to avoid conflicts.

## Database Considerations

### MySQL 8.0+ Index Key Length

The `utf8mb4` charset can cause index key length errors. Mitigation options:

- Use InnoDB with Dynamic `ROW_FORMAT` (default in modern MySQL).
- Call `Schema::defaultStringLength(125)` in `AppServiceProvider`.
- Manually shorten field lengths in the published migration.

### UUID / ULID Primary Keys

The package defaults to auto-incrementing integer primary keys. If your application uses UUIDs or ULIDs, you will need to adjust the migration accordingly.

### Foreign Keys

The migration uses cascading deletes to maintain referential integrity across the permission tables.
