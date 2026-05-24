# 🚀 Laravel Vue Starter

A production-ready **SPA admin dashboard** starter built with Laravel 13 and Vue 3. Provides authentication, role-based access control, media management, and a modern component system — so you can skip the boilerplate and start building features immediately.

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 13" />
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/Pest-4-F9322C?style=for-the-badge&logo=pest&logoColor=white" alt="Pest 4" />
  <img src="https://img.shields.io/badge/Playwright-1.60-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
</p>

---

## 📚 Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| 🐘 PHP | 8.4 | Runtime |
| 🏗️ Laravel | 13 | Backend framework |
| 🔐 Fortify | 1.x | Headless authentication (login, register, password reset) |
| 🍪 Sanctum | 4.x | Cookie-based SPA auth + API token issuance |
| 🛡️ Spatie Permission | 7.x | Role & permission management (RBAC) |
| 🖼️ Spatie Media Library | 11.x | File uploads with image conversions |
| 🧪 Pest | 4.x | PHP testing framework |
| ✨ Pint | 1.x | Code style formatting |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| 💚 Vue | 3.5 | Reactive UI framework (Composition API) |
| 📘 TypeScript | 5.9 | Static typing |
| ⚡ Vite | 8.x | Bundler with HMR |
| 🎨 Tailwind CSS | 4.x | Utility-first styling |
| 🧩 shadcn-vue | 2.7 | Accessible UI components (reka-ui primitives) |
| 🗂️ Pinia | 3.x | State management |
| 🧭 Vue Router | 5.x | Client-side routing |
| 📝 vee-validate | 4.x | Form validation |
| 🎭 Playwright | 1.60 | End-to-end browser testing |

### Architecture

The app uses a **single-page application** architecture:
- Laravel serves a single Blade view (catch-all route) and a JSON API
- Vue handles all UI rendering and client-side routing
- Authentication uses Sanctum's cookie-based stateful mechanism (CSRF + session)
- Business logic follows the **Service Layer pattern**: Controller → Service → Model
- Authorization checks happen in controllers via `$this->authorize()` with Spatie permissions

---

## ✨ Features

### 🔐 Authentication
- Login with **email or username** + password
- Registration with unique username/email validation
- Password reset via email link
- Email verification support
- Rate-limited login (5 attempts/min per email+IP)
- API token generation for mobile/external clients

### 👥 Role-Based Access Control (3-tier)
- **Superadmin** — All 11 permissions explicitly granted, full system access
- **Admin** — Admin panel access + profile editing (content manager)
- **User** — Profile editing only (default for new registrations)
- Permission-based route guards (frontend + backend)
- No `Gate::before` bypass — uniform permission model across all roles

### 🖼️ Media Management
- User avatar upload with automatic conversions (300px / 600px / 1200px)
- Powered by Spatie Media Library

### 🎨 Admin Dashboard
- Responsive sidebar layout (collapsible on desktop, drawer on mobile)
- Bottom navigation bar on mobile (Site, Dashboard, Menu, Profile)
- Sticky header with breadcrumb and user menu
- Permission-filtered navigation (Settings group only visible to superadmin)

### 🌐 Internationalization (i18n)
- English and Indonesian language support
- Type-safe locale system with dot-notation keys
- Language switcher in admin header
- Persists to localStorage

### 🌗 Dark Mode
- Light / Dark / System theme options
- Applied before Vue mounts (no flash)
- Persists to localStorage

### 📱 Responsive Design
- Dialog on desktop (≥768px), Drawer on mobile (<768px)
- Mobile-first approach with Tailwind breakpoints

---

## 🏁 Quick Start

### Prerequisites

- PHP 8.3+
- Composer 2.x
- Node.js 20+
- SQLite (default) or MySQL/PostgreSQL

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/laravel-vue-starter.git
cd laravel-vue-starter

# 2. Run the setup script (installs deps, generates key, migrates, builds)
composer setup
```

Or step by step:

```bash
# Install PHP dependencies
composer install

# Copy environment file and generate key
cp .env.example .env
php artisan key:generate

# Run migrations and seed the database
php artisan migrate --seed

# Install Node dependencies and build
npm install
npm run build
```

### Development

```bash
# Start all services concurrently (server + queue + vite HMR)
composer run dev
```

This launches:
- 🖥️ `php artisan serve` — Laravel server (port 8000)
- ⚙️ `php artisan queue:listen` — Queue worker
- ⚡ `npm run dev` — Vite dev server (HMR)

### Seeded Accounts

| Role | Username | Email | Password |
|------|----------|-------|----------|
| Superadmin | `superadmin` | `superadmin@example.com` | `123123` |
| Admin | `admin` | `admin@example.com` | `123123` |
| User | _(20 random)_ | _(random)_ | _(random)_ |

---

## 📁 Project Structure

```
├── app/
│   ├── Actions/Fortify/         # Auth actions (create user, reset password)
│   ├── Http/
│   │   ├── Controllers/         # Thin controllers (delegate to services)
│   │   ├── Requests/            # Form request validation
│   │   └── Resources/           # API response transformation
│   ├── Models/                  # Eloquent models
│   ├── Services/                # Business logic (User, Role, Media)
│   └── Traits/                  # Filterable, Searchable
├── resources/app/               # Vue SPA source
│   ├── components/
│   │   ├── ui/                  # shadcn-vue base components
│   │   ├── admin/               # Admin layout components
│   │   └── shared/              # App-wide shared components
│   ├── composables/             # useI18n, etc.
│   ├── locales/                 # en.ts, id.ts
│   ├── router/                  # Vue Router + guards
│   ├── services/                # API fetch wrapper
│   ├── stores/                  # Pinia (auth, preferences)
│   ├── types/                   # TypeScript interfaces
│   └── views/
│       ├── layouts/             # AdminLayout, DefaultLayout
│       └── pages/               # Route page components
├── tests/
│   ├── Feature/                 # Pest feature tests (73 tests)
│   ├── Unit/                    # Pest unit tests
│   └── e2e/                     # Playwright E2E tests (169 tests)
│       ├── playwright.config.ts
│       ├── global.setup.ts
│       ├── auth.setup.ts
│       └── tests/               # Test specs by role
└── openspec/                    # OpenSpec change management
    ├── specs/                   # System behavior specs
    └── changes/                 # Active/archived changes
```

---

## 🧪 Testing

### Pest (Backend — 73 tests)

```bash
# Run all backend tests
php artisan test --compact

# Run specific test file
php artisan test --compact --filter=UserApiTest

# Run by directory
php artisan test --compact tests/Feature/Authorization/
```

Covers: authentication flows, user CRUD, role/permission enforcement, avatar upload, API endpoints.

### Playwright (E2E — 169 tests)

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with visible browser
npm run test:e2e:headed

# Interactive UI mode (debug, time travel)
npm run test:e2e:ui

# Run specific project only
npx playwright test --config=tests/e2e/playwright.config.ts --project=admin
```

Covers: login/register/forgot-password flows, navigation guards per role, admin sidebar visibility, language switching (EN↔ID), dark mode toggle, guest page restrictions, and responsive layout testing across mobile (375x667), tablet (769x1024), and desktop (1280x720) viewports per role.

**Test projects:**

| Project | Scope | Auth State |
|---------|-------|-----------|
| `guest` | Navigation guards, page accessibility, responsive mobile/tablet | Unauthenticated |
| `auth` | Login, register, forgot-password forms | Unauthenticated |
| `user` | Home, profile, restricted page redirects, responsive mobile/tablet | User role |
| `admin` | Dashboard, sidebar, restricted pages, i18n, theme, responsive mobile/tablet, mobile bottom nav/sidebar drawer | Admin role |
| `superadmin` | Full access, settings group, i18n, responsive mobile/tablet | Superadmin role |

---

## 🤖 AI Agent

This project is optimized for AI coding agents. It includes:

- **[Laravel Boost](https://laravel.com/docs/ai)** — MCP server with 15+ tools for Laravel-aware AI assistance
- **Agent skills** (`.agent/skills/`) — Domain-specific instructions for Fortify, Pest, Vue components, Tailwind, etc.
- **OpenSpec** (`openspec/`) — Spec-driven planning framework for structured AI collaboration
- **Steering files** — Project conventions and guidelines automatically loaded into AI context

### Quick commands for AI agents:

```bash
# Search Laravel docs (version-specific)
# → Use Laravel Boost's search-docs tool

# Propose a new feature
/openspec-propose <change-name>

# Implement planned tasks
/openspec-apply-change <change-name>

# Commit changes
/git-commit
```

---

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
