# Installation in Laravel

> Source: https://spatie.be/docs/laravel-permission/v7/installation-laravel

## Step-by-Step Setup

1. **Review prerequisites** — confirm your User model meets the requirements documented on the Prerequisites page.

2. **Check for config conflicts** — make sure `config/permission.php` does not already exist.

3. **Install via Composer:**

```bash
composer require spatie/laravel-permission
```

4. **Service provider** — auto-registers in modern Laravel. If needed, add it manually to `bootstrap/providers.php`.

5. **Publish assets:**

```bash
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

6. **Pre-migration configuration** — before running migrations, address any of the following that apply:
   - UUID/ULID primary key adjustments
   - Set `'teams' => true` in the config if using the teams feature
   - MySQL 8+ index length fixes
   - Install the cache migration if using the database cache driver

7. **Clear cached config:**

```bash
php artisan optimize:clear
```

8. **Run migrations:**

```bash
php artisan migrate
```

9. **Add the trait** to your User model:

```php
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
}
```
