# Deployment & Environment Configuration

## Background

This document covers development environment setup, environment variable configuration, and production deployment steps.

## Prerequisites

| Requirement | Minimum Version |
|-------------|----------------|
| PHP | 8.3+ |
| Composer | 2.x |
| Node.js | 18+ (LTS recommended) |
| npm | 9+ |
| SQLite | 3.x (or MySQL/PostgreSQL) |

## Quick Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd laravel-vue-starter

# 2. Run setup script (installs deps, generates key, migrates, builds)
composer setup
```

Or manual step-by-step:

```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database & run migrations
touch database/database.sqlite
php artisan migrate

# Install Node dependencies
npm install

# Build frontend assets
npm run build
```

## Development

### Start Development Server

```bash
# Start all services concurrently (server + queue + vite)
composer run dev
```

This runs 3 processes simultaneously:
- `php artisan serve` — Laravel dev server (port 8000)
- `php artisan queue:listen --tries=1` — Queue worker
- `npm run dev` — Vite dev server (HMR)

### Individual Commands

```bash
php artisan serve         # Laravel server only
npm run dev               # Vite HMR only
php artisan queue:listen  # Queue worker only
```

## Environment Variables

### Core Application

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_NAME` | Application name | `"Laravel Vue Starter"` |
| `APP_ENV` | Environment | `local`, `production` |
| `APP_KEY` | Encryption key | Auto-generated |
| `APP_DEBUG` | Debug mode | `true` (dev), `false` (prod) |
| `APP_URL` | Application URL | `http://localhost:8000` |

### Database

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_CONNECTION` | Database driver | `sqlite`, `mysql`, `pgsql` |
| `DB_HOST` | Database host | `127.0.0.1` |
| `DB_PORT` | Database port | `3306` (mysql), `5432` (pgsql) |
| `DB_DATABASE` | Database name/path | `database/database.sqlite` |
| `DB_USERNAME` | Database user | `root` |
| `DB_PASSWORD` | Database password | `""` |

### Sanctum (SPA Auth)

| Variable | Description | Example |
|----------|-------------|---------|
| `SANCTUM_STATEFUL_DOMAINS` | Domains allowed for cookie auth | `localhost:5173,localhost:8000` |
| `SESSION_DOMAIN` | Cookie domain | `localhost` |

### Session

| Variable | Description | Example |
|----------|-------------|---------|
| `SESSION_DRIVER` | Session storage | `database` |
| `SESSION_LIFETIME` | Session lifetime (minutes) | `120` |

### Mail (for password reset & email verification)

| Variable | Description | Example |
|----------|-------------|---------|
| `MAIL_MAILER` | Mail driver | `smtp`, `log` |
| `MAIL_HOST` | SMTP host | `mailpit` (dev) |
| `MAIL_PORT` | SMTP port | `1025` (mailpit) |
| `MAIL_FROM_ADDRESS` | From email | `noreply@example.com` |

### Queue

| Variable | Description | Example |
|----------|-------------|---------|
| `QUEUE_CONNECTION` | Queue driver | `database`, `redis`, `sync` |

### Media Library (File Storage)

| Variable | Description | Example |
|----------|-------------|---------|
| `FILESYSTEM_DISK` | Default disk | `local`, `public`, `s3` |
| `MEDIA_DISK` | Media library disk | `public` |

## Production Deployment

### Build Steps

```bash
# 1. Install production PHP deps
composer install --optimize-autoloader --no-dev

# 2. Build frontend
npm ci
npm run build

# 3. Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 4. Run migrations
php artisan migrate --force

# 5. Link storage
php artisan storage:link
```

### Server Requirements

- PHP 8.3+ with extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, GD/Imagick
- Web server: Nginx (recommended) or Apache
- Process manager: Supervisor (for queue worker)
- HTTPS: Required for Sanctum secure cookies in production

### Nginx Configuration (Minimal)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/project/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Queue Worker (Supervisor)

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/project/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/project/storage/logs/worker.log
```

### Scheduled Tasks (Cron)

```cron
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

## Storage & File Permissions

```bash
# Set proper permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Create storage symlink
php artisan storage:link
```

## Database Migrations (Production)

```bash
# Run pending migrations (with force flag for production)
php artisan migrate --force

# Rollback last batch (careful!)
php artisan migrate:rollback

# Check migration status
php artisan migrate:status
```

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| Vite manifest not found | Run `npm run build` or `npm run dev` |
| 419 CSRF mismatch | Check `SANCTUM_STATEFUL_DOMAINS` and `SESSION_DOMAIN` |
| 401 Unauthenticated (SPA) | Ensure request includes credentials/cookies |
| Permission denied (storage) | Fix file permissions: `chmod -R 775 storage` |
| Queue not processing | Start worker: `php artisan queue:listen` |

### Verification Commands

```bash
# Check application status
php artisan about

# Verify routes
php artisan route:list

# Check config value
php artisan config:show app.url

# Clear all caches
php artisan optimize:clear

# Run tests
php artisan test --compact
```

## Laravel Cloud

This project can be deployed to Laravel Cloud for managed hosting. See https://cloud.laravel.com/ for details.
