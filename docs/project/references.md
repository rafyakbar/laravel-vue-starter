# Project Documentation

> Complete architecture, API, database, and conventions reference for the laravel-vue-starter project.

## Overview

This project is an SPA admin dashboard built with Laravel 13 (backend) and Vue 3 (frontend). The backend provides a REST API protected by Sanctum, while the frontend uses Vue Router as a full SPA served through a single catch-all Laravel route. This documentation serves as the single source of truth for developers and AI agents to understand the system holistically.

## Key Concepts

- **SPA Architecture** — Vue 3 single-page application communicating with Laravel API via Sanctum
- **Service Layer** — Business logic separated from controllers into dedicated service classes
- **RBAC** — Role-based access control using Spatie Permission (Bouncer)
- **Media Library** — File management through Spatie Media Library
- **Fortify Auth** — Headless authentication backend (no views) designed for SPA consumption

## References

- [001_prd.md](references/001_prd.md): Product requirements and core objectives
- [002_architecture.md](references/002_architecture.md): System architecture and application flow
- [003_database_schema.md](references/003_database_schema.md): Database structure, tables, relations, and ERD
- [004_api_spec.md](references/004_api_spec.md): API endpoint specification with request/response formats
- [005_frontend_guidelines.md](references/005_frontend_guidelines.md): Frontend coding standards and UI structure
- [006_backend_guidelines.md](references/006_backend_guidelines.md): Backend standards, services, and business logic
- [007_authentication.md](references/007_authentication.md): Authentication, authorization, roles, and permissions
- [008_deployment.md](references/008_deployment.md): Deployment guide and environment/server configuration

## Links

- Laravel: https://laravel.com/docs
- Vue 3: https://vuejs.org/guide/introduction.html
- Sanctum: https://laravel.com/docs/sanctum
- Fortify: https://laravel.com/docs/fortify
- Spatie Permission: https://spatie.be/docs/laravel-permission
- Spatie Media Library: https://spatie.be/docs/laravel-medialibrary
- shadcn-vue: https://www.shadcn-vue.com
