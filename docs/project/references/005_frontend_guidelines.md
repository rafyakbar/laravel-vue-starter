# Frontend Guidelines

## Background

The frontend is built as an SPA (Single Page Application) using Vue 3 with TypeScript. It uses shadcn-vue components with an admin dashboard layout pattern. All frontend code lives in `resources/app/`.

## Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Vue 3 | ^3.5 | UI framework (Composition API) |
| TypeScript | ^5.9 | Static typing |
| Vite | ^8.0 | Bundler + HMR (via laravel-vite-plugin) |
| TailwindCSS | ^4.1 | Utility-first CSS |
| Pinia | ^3.0 | State management |
| Vue Router | ^5.0 | Client-side routing |
| reka-ui | ^2.9 | Unstyled accessible UI primitives (shadcn-vue base) |
| @lucide/vue | ^1.16 | Icon library |
| class-variance-authority | ^0.7 | Component variant styling |
| clsx + tailwind-merge | ^2.1 / ^3.6 | Conditional class merging |
| vee-validate | ^4.15 | Form state management |
| vue-sonner | ^2.0 | Toast notifications |
| vaul-vue | ^0.4 | Drawer component (mobile modals) |
| @vueuse/core | ^14.3 | Utility composables |

### Package Notes

- **TypeScript 6.0** is stable (released Jan 2026). Project remains on 5.9 for vue-tsc compatibility. Upgrade when vue-tsc supports TS 6.
- **reka-ui** is the successor of radix-vue (v1). shadcn-vue now uses reka-ui as its primitive layer.
- **@lucide/vue** replaces the older `lucide-vue-next` package.

## Form Validation

> **Current status**: vee-validate is not installed yet.

The project uses **vee-validate** for client-side form state management. Server-side validation via Laravel Form Requests remains the single source of truth.

**No Zod.** Laravel Form Requests already define all validation rules. Duplicating them client-side adds complexity without benefit. Client-side validation is limited to instant UX feedback (required fields, basic format checks). The server is always the authority.

### Core Pattern

```text
TypeScript interface → useForm() → handleSubmit() → API call → setErrors() from 422 response
```

### Form Type Definitions

Define form types as TypeScript interfaces in the feature's `types/` or alongside the form component:

```typescript
// views/pages/<feature>/types.ts
export interface UserFormValues {
  firstName: string
  lastName: string
  email: string
  password: string
}
```

### Form Component Pattern (script)

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import type { UserFormValues } from '../types'

const { handleSubmit, setErrors, resetForm, isSubmitting } = useForm<UserFormValues>({
  initialValues: { firstName: '', lastName: '', email: '', password: '' },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await api.post('/api/users', values)
  } catch (e: any) {
    if (e.response?.status === 422) {
      setErrors(e.response.data.errors)
    }
  }
})
</script>
```

### Form Template Pattern

The UI form components follow a strict hierarchy. `FormField` (re-exported from vee-validate's `Field`) integrates with shadcn-vue styled wrappers:

```vue
<template>
  <form @submit="onSubmit" class="space-y-6">
    <FormField v-slot="{ componentField }" name="firstName">
      <FormItem>
        <FormLabel>First Name</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" :disabled="isSubmitting" class="w-full">
      Save
    </Button>
  </form>
</template>
```

**Component hierarchy:**
- `FormField` — binds to a field name, provides slot props (`componentField`, `value`, `errors`)
- `FormItem` — wrapper that provides injection context for label/message IDs
- `FormLabel` — accessible label linked to the field
- `FormControl` — wraps the actual input element
- `FormMessage` — displays field-level validation errors

### Form Component Imports

The shadcn-vue form components re-export vee-validate internals:

```typescript
// components/ui/form/index.ts
export { Form, Field as FormField, FieldArray as FormFieldArray } from 'vee-validate'
export { default as FormControl } from './FormControl.vue'
export { default as FormDescription } from './FormDescription.vue'
export { default as FormItem } from './FormItem.vue'
export { default as FormLabel } from './FormLabel.vue'
export { default as FormMessage } from './FormMessage.vue'
```

Always import from `@/components/ui/form`, not directly from `vee-validate`.

### Server Error Mapping

Laravel returns 422 errors in this format:

```json
{
  "message": "The email field is required.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

Map these to vee-validate fields using `setErrors()`:

```typescript
catch (e: any) {
  if (e.response?.status === 422) {
    const mapped: Record<string, string> = {}
    for (const [key, messages] of Object.entries(e.response.data.errors)) {
      mapped[key] = (messages as string[])[0]
    }
    setErrors(mapped)
  }
}
```

## Directory Structure

```text
resources/app/
├── assets/css/            # Global CSS (Tailwind entry point)
├── components/
│   ├── ui/                # shadcn-vue base components (Button, Input, Dialog, etc.)
│   ├── prop-ui/           # Composed UI patterns (Modal, StatusBadge, etc.)
│   └── shared/            # App-wide shared components
├── composables/           # Shared composables (useAuth, useFetch, etc.)
├── lib/                   # Utility functions
│   └── utils.ts           # cn() helper (clsx + tailwind-merge)
├── router/                # Vue Router configuration
│   └── index.ts           # Route definitions + guards
├── services/              # API service layer
├── stores/                # Pinia stores
├── types/                 # Shared TypeScript types
├── views/
│   ├── layouts/           # Layout wrapper components
│   │   └── DefaultLayout.vue
│   └── pages/             # Page components (route targets)
│       └── HomePage.vue
├── App.vue                # Root component
├── main.ts                # Entry point (bootstrap app)
└── env.d.ts               # Vite env type declarations
```

## Feature Page Convention

When adding new feature pages, follow this folder structure:

```text
views/pages/<feature>/
├── index.vue              # Main page
├── components/            # Page-specific components
│   ├── columns.ts         # Table column definitions (TanStack)
│   ├── data-table.vue     # Table wrapper
│   ├── data-table-toolbar.vue   # Table filters/search
│   ├── <resource>-form.vue      # Create/edit form
│   ├── <resource>-create.vue    # Create modal trigger
│   └── <resource>-delete.vue    # Delete confirmation
├── data/                  # Static data & type schemas
│   └── schema.ts          # TypeScript types + enums for this feature
└── types.ts               # Form value interfaces
```

## Vite Configuration

```typescript
export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/app/assets/css/app.css', 'resources/app/main.ts'],
      refresh: true,
    }),
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'resources/app'),
    },
  },
})
```

- **Entry points**: CSS + main.ts
- **Path alias**: `@` → `resources/app/`
- **HMR**: Enabled via laravel-vite-plugin

## shadcn-vue Configuration

```json
{
  "style": "default",
  "typescript": true,
  "tailwind": {
    "config": "",
    "css": "resources/app/assets/css/app.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "framework": "vite",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## UI Component System (shadcn-vue)

### Principles

- Use reka-ui as unstyled primitives (accessible by default)
- Style via TailwindCSS utility classes
- Variant management via `class-variance-authority` (cva)
- Class merging via `cn()` helper function

### cn() Helper

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Component Variants (CVA Pattern)

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

## Admin Layout Pattern

The application uses a sidebar-based admin layout:

```text
┌─────────────────────────────────────────────────┐
│ Sidebar │ Header (breadcrumb, search, actions)   │
│         │────────────────────────────────────────│
│ Nav     │ Main Content                           │
│ items   │                                        │
│         │                                        │
│ Footer  │                                        │
└─────────────────────────────────────────────────┘
```

- **SidebarProvider** wraps the entire layout with collapsible state
- **Sidebar** contains navigation, team switcher, and footer
- **SidebarInset** hosts the header + main content area
- Sidebar is collapsible (icon-only mode) with persistent state via cookie

### Page Layout Component

Wrap page content in a consistent layout component with title, description, and action slots:

```vue
<script setup>
import BasicPage from '@/components/shared/BasicPage.vue'
</script>

<template>
  <BasicPage title="Users" description="Manage user accounts" sticky>
    <template #actions>
      <UserCreate />
    </template>

    <DataTable :data="users" :columns="columns" />
  </BasicPage>
</template>
```

## Responsive Modal Pattern

Modals adapt to screen size: **Dialog on desktop (≥768px), Drawer on mobile (<768px)**. Implemented via a shared composable:

```typescript
// components/prop-ui/modal/use-modal.ts
import { createSharedComposable, useMediaQuery } from '@vueuse/core'
import { Dialog, DialogContent, ... } from '@/components/ui/dialog'
import { Drawer, DrawerContent, ... } from '@/components/ui/drawer'

const useSharedModal = createSharedComposable(() => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const Modal = computed(() => ({
    Root: isDesktop.value ? Dialog : Drawer,
    Content: isDesktop.value ? DialogContent : DrawerContent,
    // ... other sub-components
  }))

  return { isDesktop, Modal }
})

export function useModal() {
  return useSharedModal()
}
```

Usage:

```vue
<script setup>
import { Modal, ModalContent, ModalTrigger } from '@/components/prop-ui/modal'

const isOpen = ref(false)
</script>

<template>
  <Modal v-model:open="isOpen">
    <ModalTrigger as-child>
      <Button>Create User</Button>
    </ModalTrigger>
    <ModalContent>
      <UserForm @close="isOpen = false" />
    </ModalContent>
  </Modal>
</template>
```

## Data Fetching (SPA + Sanctum)

### Authentication Flow

This SPA uses Sanctum's cookie-based (stateful) authentication:

```text
1. GET /sanctum/csrf-cookie   → Sets XSRF-TOKEN cookie
2. POST /login                → Authenticates, sets session cookie
3. GET /api/users/auth        → Returns current user (with roles/permissions)
4. All subsequent /api/* calls include session cookie automatically
```

### API Service Pattern

```typescript
// services/api.ts
const API_BASE = '/api'

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw { response: await response.json(), status: response.status }
  }

  return response.json()
}
```

### CSRF Cookie

Before login/register (unauthenticated mutations), fetch the CSRF cookie:

```typescript
await fetch('/sanctum/csrf-cookie', { credentials: 'include' })
```

## Toast Notifications

Use `vue-sonner` for toast notifications:

```vue
<!-- App.vue or layout -->
<script setup>
import { Toaster } from 'vue-sonner'
</script>

<template>
  <Toaster />
  <router-view />
</template>
```

```typescript
// In any component
import { toast } from 'vue-sonner'

toast.success('User created successfully')
toast.error('Failed to save changes')
```

## Composable Pattern

Business logic is encapsulated in composable functions:

```typescript
// Naming: use<Feature>()
export function useAuth() {
  const loading = ref(false)
  const user = ref<User | null>(null)

  async function login(credentials: LoginPayload) {
    loading.value = true
    try {
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' })
      await request('/login', { method: 'POST', body: JSON.stringify(credentials) })
    } finally {
      loading.value = false
    }
  }

  return { loading, user, login }
}
```

## Component Pattern

All components use `<script setup lang="ts">` with Composition API:

```vue
<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [data: FormData]
}>()
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <slot />
  </div>
</template>
```

## State Management (Pinia)

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  function setUser(newUser: User) {
    user.value = newUser
    isAuthenticated.value = true
  }

  function clearUser() {
    user.value = null
    isAuthenticated.value = false
  }

  return { user, isAuthenticated, setUser, clearUser }
})
```

## Responsive Design

- **Mobile-first** approach using Tailwind breakpoints
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Responsive modal pattern: Dialog on desktop, Drawer on mobile (see above)

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Components | PascalCase | `UserForm.vue`, `DataTable.vue` |
| Composables | camelCase + `use` prefix | `useAuth()`, `useFetch()` |
| Stores | camelCase + `use...Store` | `useAuthStore()` |
| Pages | PascalCase | `HomePage.vue`, `UsersPage.vue` |
| Layouts | PascalCase + Layout suffix | `DefaultLayout.vue` |
| Utils/lib | camelCase | `utils.ts`, `formatDate.ts` |
| Types/Interfaces | PascalCase | `UserFormValues`, `LoginPayload` |
| CSS files | kebab-case | `app.css` |

## Best Practices

1. **TypeScript strict**: Always define interfaces/types for props, emits, and API responses
2. **Single responsibility**: One component = one responsibility
3. **Composition API only**: Do not use Options API
4. **Import alias**: Always use `@/` instead of long relative paths
5. **Colocate code**: Page-specific code stays in that page's folder
6. **Shared code rises**: Composables and components used by more than one page move to `resources/app/` level
7. **No inline styles**: Use Tailwind utility classes
8. **Accessible**: Use semantic HTML and reka-ui primitives
9. **Server-side validation is king**: Never rely solely on client-side validation. Laravel Form Requests are the source of truth.
10. **Don't duplicate validation logic**: Client-side checks are UX conveniences (required, email format). Complex business rules live only in Laravel.
11. **Credentials always included**: All fetch calls to the API must include `credentials: 'include'` for Sanctum cookies

## Build & Verification

```bash
npm run build     # Production build (type-check included)
npm run dev       # Development server with HMR
```

Always run `npm run build` after frontend changes to ensure no type errors.
