# Performance Optimization

> Guidelines for achieving fast response times in local development and production.

## Background

Laravel applications on Windows (Laragon) can exhibit unexpectedly slow response times (500ms+) even on high-end hardware (i9, 32GB RAM, SSD). The primary causes are missing PHP extensions and suboptimal driver configuration. This document covers the key optimizations to achieve sub-200ms response times.

## Target Metrics

| Environment | Endpoint Type | Target Response Time |
|-------------|---------------|---------------------|
| Local dev | Simple API (GET) | < 100ms |
| Local dev | Session endpoints (logout, csrf) | < 150ms |
| Local dev | Auth with bcrypt (login, register) | < 350ms (bcrypt limited) |
| Production | Simple API (GET) | < 50ms |
| Production | Session endpoints | < 80ms |
| Production | Auth with bcrypt (login, register) | < 250ms (bcrypt limited) |

Note: Login and register endpoints are inherently slower due to bcrypt password hashing (~180ms at cost 12). This is by design for security.

## PHP OPcache (Critical)

OPcache is the single most impactful optimization. Without it, PHP parses every file from disk on every request. Laravel loads 200+ files per request — without OPcache this means 200+ disk reads and parse operations.

### Symptoms of Missing OPcache

- All endpoints consistently slow (400-1000ms+)
- No single slow query or slow middleware — everything is uniformly slow
- `php -r "var_dump(extension_loaded('Zend OPcache'));"` returns `false`

### Enable OPcache (Laragon/Windows)

Edit `php.ini` (find via `php -r "echo php_ini_loaded_file();"`)

```ini
; Uncomment this line:
zend_extension=opcache

; Add/update these settings:
opcache.enable=1
opcache.enable_cli=0
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=1
opcache.revalidate_freq=0
```

Setting `revalidate_freq=0` means OPcache checks file modification time on every request (safe for development). In production, set `revalidate_freq=60` or higher.

### Restart Required

After changing php.ini, restart Apache/Nginx in Laragon. Verify with:

```bash
php -r "var_dump(extension_loaded('Zend OPcache'), ini_get('opcache.enable'));"
# Should output: bool(true) string(1) "1"
```

### Expected Impact

| Metric | Without OPcache | With OPcache |
|--------|----------------|--------------|
| Simple GET | ~500ms | ~50ms |
| POST /login | ~950ms | ~100ms |
| File parse operations | 200+/request | 0 (cached) |

## Session & Cache Drivers

### Problem: Database Driver on SQLite

Using `SESSION_DRIVER=database` and `CACHE_STORE=database` with SQLite adds significant overhead:
- SQLite file locking is slow on Windows
- Every request does 2+ session queries (read + write)
- Spatie Permission cache uses the cache store for every auth check

### Recommended Local Development Configuration

```env
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

The `file` driver uses the filesystem directly — no locking overhead, no query parsing. On Windows with SSD this is significantly faster than SQLite database sessions.

### Production Configuration

```env
SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
```

Redis is the gold standard for production session/cache because it operates entirely in memory with minimal latency.

## Laravel Optimization Commands

### Development (safe to run anytime)

```bash
# Clear all caches during development
php artisan optimize:clear
```

### Production Only

```bash
# Cache config, routes, views, and events
php artisan optimize

# Individual caches (if needed)
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

Do NOT cache config/routes in development — it prevents `.env` and route file changes from taking effect.

## Composer Autoloader Optimization

### Development

No action needed — Composer's default autoloader is fine for development.

### Production

```bash
composer install --optimize-autoloader --no-dev
```

The `--optimize-autoloader` flag generates a classmap for all PSR-4 and PSR-0 classes, eliminating filesystem lookups.

## Windows-Specific Considerations

### Windows Defender / Antivirus

Real-time scanning can add 10-50ms per file access. Exclude these directories:

- `C:\laragon\` (entire Laragon installation)
- Your project directory (e.g., `C:\laragon\www\`)
- PHP temp directory
- Composer cache directory (`%APPDATA%\Composer`)

### Realpath Cache

PHP's realpath cache avoids repeated `stat()` calls. The default `4096K` is adequate for most projects. If you have thousands of files:

```ini
realpath_cache_size=8192K
realpath_cache_ttl=600
```

## Bcrypt Password Hashing (Expected Overhead)

After enabling OPcache and optimizing drivers, you may notice that `/login` (~300ms) and `/register` (~450ms) remain above 200ms while other endpoints are fast (60-120ms). This is not a bug — it is the intentional cost of bcrypt password hashing.

### Why Login and Register Are Slower

Both endpoints perform bcrypt operations:
- `/login`: calls `password_verify()` to check credentials against stored hash
- `/register`: calls `password_hash()` to hash the new password before storing

Bcrypt is deliberately slow to resist brute-force attacks. The "cost factor" (rounds) controls the time exponentially.

### Benchmark: Bcrypt Cost Factor vs Time (i9-13900H)

| Cost Factor | Hash Time | Verify Time | Use Case |
|-------------|-----------|-------------|----------|
| 10 | ~45ms | ~45ms | Acceptable for local development |
| 11 | ~90ms | ~90ms | Balanced |
| 12 (default) | ~186ms | ~178ms | Production standard (Laravel default) |
| 13 | ~370ms | ~370ms | High security |

### Request Time Breakdown

```text
POST /login (~300ms):
  └── Laravel boot + middleware:  ~60ms
  └── DB query (find user):       ~5ms
  └── password_verify (cost 12): ~180ms
  └── Session write + response:   ~55ms

POST /register (~450ms):
  └── Laravel boot + middleware:  ~60ms
  └── Validation:                 ~10ms
  └── password_hash (cost 12):   ~186ms
  └── DB inserts (user + role):   ~80ms
  └── Event dispatching:          ~50ms
  └── Session write + response:   ~60ms
```

### Configuration

Laravel reads the bcrypt rounds from `config/hashing.php` which defaults to the `BCRYPT_ROUNDS` env variable:

```env
# .env
BCRYPT_ROUNDS=12
```

### Should You Lower It for Development?

You can set `BCRYPT_ROUNDS=10` in your local `.env` to reduce login/register time by ~130ms. However:

- Users registered with cost 10 have different hashes than cost 12
- If you seed your database with cost 10, those passwords still work with cost 12 (bcrypt stores the cost in the hash itself)
- Never deploy with cost below 12

```env
# Local development only — saves ~130ms on auth endpoints
BCRYPT_ROUNDS=10
```

### Important: This Is Not a Performance Problem

The bcrypt overhead is a security feature, not a defect. Response times of 300-450ms for login/register are normal and expected with cost 12. All other endpoints (API reads, session checks, CSRF) should be under 100ms after OPcache + file drivers are configured.

## Database Query Performance

### N+1 Prevention

Use Laravel's `Model::preventLazyLoading()` in development to catch N+1 queries:

```php
// AppServiceProvider::boot()
Model::preventLazyLoading(!app()->isProduction());
```

### SQLite Performance (Development)

If using SQLite for development, enable WAL mode for better concurrent read/write:

```php
// database.php connection config
'sqlite' => [
    'driver' => 'sqlite',
    'database' => database_path('database.sqlite'),
    'prefix' => '',
    'foreign_key_constraints' => true,
    'busy_timeout' => 5000,
    'journal_mode' => 'wal',
    'synchronous' => 'normal',
],
```

## Frontend Build Performance

### Vite Dev Server

The Vite dev server (`npm run dev`) provides instant HMR. For testing production-like performance:

```bash
npm run build
```

### Bundle Analysis

Monitor bundle size to prevent frontend performance regression:

```bash
npx vite-bundle-visualizer
```

Current target: main bundle < 200KB gzipped.

## Monitoring & Debugging

### Laravel Telescope (Development)

Install Telescope to profile slow requests, queries, and cache operations:

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

### Quick Performance Check

```bash
# Time a simple request (includes full Laravel boot)
php artisan tinker --execute "echo round((microtime(true) - LARAVEL_START) * 1000) . 'ms';"
```

## Checklist: Diagnosing Slow Responses

1. **OPcache enabled?** — `php -r "var_dump(extension_loaded('Zend OPcache'));"`
2. **Xdebug disabled?** — `php -m | grep xdebug` (should return nothing)
3. **Session driver?** — Check `.env` `SESSION_DRIVER` (avoid `database` on SQLite)
4. **Cache driver?** — Check `.env` `CACHE_STORE` (avoid `database` on SQLite)
5. **Antivirus exclusions?** — Exclude project and PHP directories
6. **Slow queries?** — Enable query log or use Telescope
7. **N+1 queries?** — Enable `preventLazyLoading()` in dev
8. **Bcrypt cost?** — Login/register always add ~180ms at cost 12 — this is normal, not a bug

## Best Practices

- Always enable OPcache in any environment (dev and production)
- Use `file` driver for session/cache in local development, `redis` in production
- Never use `database` driver with SQLite for sessions — file locking overhead is severe on Windows
- Run `php artisan optimize` on production deployments
- Exclude development directories from antivirus real-time scanning
- Profile before optimizing — use Telescope or `LARAVEL_START` timing to measure
- Keep Xdebug disabled unless actively debugging (it adds 200-500ms per request)
