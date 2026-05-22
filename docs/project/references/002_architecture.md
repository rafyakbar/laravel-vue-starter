# System Architecture

## Background

This project follows an SPA (Single Page Application) architecture with a clear separation between the backend API (Laravel) and the frontend client (Vue). Laravel handles business logic, data persistence, and authentication, while Vue handles all UI and user interaction.

## High-level Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                         │
│  Vue 3 + Vue Router + Pinia + TailwindCSS + shadcn-vue      │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP (fetch)
                             │ Cookie-based session (Sanctum)
┌────────────────────────────▼────────────────────────────────┐
│                     Laravel 13 Backend                        │
│                                                              │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Routes  │→ │ Controllers│→ │ Services │→ │  Models  │  │
│  └──────────┘  └────────────┘  └──────────┘  └──────────┘  │
│       │              │                              │         │
│       │         ┌────────────┐              ┌──────────┐    │
│       │         │  Requests  │              │  Media   │    │
│       │         │ (Validate) │              │ Library  │    │
│       │         └────────────┘              └──────────┘    │
│       │                                           │         │
│  ┌────────────┐                           ┌──────────┐    │
│  │  Fortify   │                           │ Database │    │
│  │  (Auth)    │                           │ (SQLite) │    │
│  └────────────┘                           └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### SPA Page Load

1. Browser requests any URL (e.g., `/dashboard`, `/users`)
2. Laravel catch-all route (`/{any?}`) returns a Blade view with Vite entry
3. Vue app mounts, Vue Router takes over client-side routing
4. Vue makes API calls to `/api/*` to fetch data

### API Request Flow

1. Frontend sends HTTP request to `/api/*` with session cookie
2. Sanctum middleware authenticates via session cookie
3. Controller receives request, performs authorization check
4. Form Request validates input data
5. Controller calls Service class for business logic
6. Service interacts with Model (Eloquent)
7. Controller returns JSON response (via API Resource)

## Backend Directory Structure

```text
app/
├── Actions/Fortify/       # Authentication actions (create user, reset password, etc.)
├── Http/
│   ├── Controllers/       # HTTP controllers (thin, delegate to service)
│   ├── Middleware/         # Custom middleware
│   ├── Requests/          # Form request validation
│   ├── Resources/         # API resource transformers (JSON output)
│   └── Responses/         # Custom response contracts (Fortify)
├── Models/                # Eloquent models
├── Providers/             # Service providers (AppServiceProvider, FortifyServiceProvider)
├── Services/              # Business logic layer
│   ├── Media/             # Media/file operations
│   ├── Role/              # Role management
│   └── User/              # User CRUD operations
├── Traits/                # Reusable model traits (Filterable, Searchable)
└── Utilities/             # Helper utilities
```

## Frontend Directory Structure

```text
resources/app/
├── assets/css/            # Global CSS (Tailwind entry)
├── lib/                   # Utility functions (cn helper)
├── router/                # Vue Router configuration
├── stores/                # Pinia state management
├── views/
│   ├── layouts/           # Layout components (DefaultLayout)
│   └── pages/             # Page components (route destinations)
├── App.vue                # Root component
├── main.ts                # App entry point (bootstrap)
└── env.d.ts               # TypeScript environment declarations
```

## Technology Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Laravel | 13.x |
| PHP | PHP | 8.4 |
| Auth backend | Laravel Fortify | 1.x |
| API auth | Laravel Sanctum | 4.x |
| Roles/Permissions | Spatie Permission | 7.x |
| Media management | Spatie Media Library | 11.x |
| Database | SQLite (configurable) | - |
| Code style | Laravel Pint | 1.x |
| Testing | PHPUnit | 12.x |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Vue | 3.5.x |
| Bundler | Vite | 8.x |
| Language | TypeScript | 5.x |
| CSS | TailwindCSS | 4.x |
| UI primitives | radix-vue | 1.x |
| Icons | lucide-vue-next | 0.500.x |
| State | Pinia | 3.x |
| Router | Vue Router | 5.x |
| Utility | clsx + tailwind-merge | latest |

## Design Patterns

### Service Layer Pattern
Controllers only receive requests and return responses. All business logic lives in Service classes.

```text
Controller → Service → Model
     ↑                    ↓
Form Request         Database
     ↓
API Resource (response transformation)
```

### Repository-less Approach
Eloquent models are used directly in the Service layer without a Repository abstraction. Query building uses traits (Filterable, Searchable) attached to models.

### Trait-based Model Capabilities
- `Filterable` — Dynamic where clauses from filter arrays
- `Searchable` — Full-text search across multiple fields
- `HasMedia` (Spatie) — File attachment capabilities
- `HasRoles` (Spatie) — Role/permission assignment

## Routing Strategy

### Backend Routes

| File | Scope | Middleware |
|------|-------|-----------|
| `routes/web.php` | SPA catch-all | web |
| `routes/api.php` | REST API endpoints | auth:sanctum |

### Frontend Routes
Defined manually in `resources/app/router/index.ts` using standard Vue Router configuration.

## Build & Development

```bash
# Development (concurrent server + queue + vite)
composer run dev

# Build frontend for production
npm run build

# Run tests
php artisan test

# Format PHP code
vendor/bin/pint --dirty --format agent
```
