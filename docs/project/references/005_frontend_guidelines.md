# Frontend Guidelines

## Background

The frontend is built as an SPA (Single Page Application) using Vue 3 with TypeScript. Architecture and design patterns reference shadcn-vue-admin as the blueprint. All frontend code lives in `resources/app/`.

## Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Vue 3 | ^3.5 | UI framework (Composition API) |
| TypeScript | ^5.9 | Static typing |
| Vite | ^8.0 | Bundler + HMR (via laravel-vite-plugin) |
| TailwindCSS | ^4.0 | Utility-first CSS |
| Pinia | ^3.0 | State management |
| Vue Router | ^5.0 | Client-side routing |
| radix-vue | ^1.9 | Unstyled accessible UI primitives |
| lucide-vue-next | ^0.500 | Icon library |
| class-variance-authority | ^0.7 | Component variant styling |
| clsx + tailwind-merge | latest | Conditional class merging |

## Form Validation (Planned Adoption)

> **Current status**: No form validation library is installed yet.

The project plans to adopt the following stack (matching the shadcn-vue-admin reference architecture):

| Library | Purpose |
|---------|---------|
| **Zod** | Schema definition and validation |
| **vee-validate** | Form state management and submission |
| **@vee-validate/zod** | Bridge between Zod schemas and vee-validate |

### Installation (when ready)

```bash
npm install vee-validate @vee-validate/zod zod
```

### Intended Pattern

```text
Zod schema → toTypedSchema() → useForm() → handleSubmit() → API call
```

**Validator file convention** (to be placed in feature folders):

```typescript
// views/pages/<feature>/validators/<name>.validator.ts
import { z } from 'zod'

export const userValidator = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export type UserFormValues = z.infer<typeof userValidator>
```

**Form component pattern:**

```vue
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { userValidator } from '../validators/user.validator'

const formSchema = toTypedSchema(userValidator)
const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: { firstName: '', lastName: '', email: '', password: '' },
})

const onSubmit = handleSubmit((values) => {
  // Call API mutation
})
</script>
```

Until these libraries are installed, form validation is handled server-side via Laravel Form Requests with 422 error responses rendered in the frontend.

## Directory Structure

```text
resources/app/
├── assets/css/            # Global CSS (Tailwind entry point)
├── lib/                   # Utility functions
│   └── utils.ts           # cn() helper (clsx + tailwind-merge)
├── router/                # Vue Router configuration
│   └── index.ts           # Route definitions
├── stores/                # Pinia stores
│   └── index.ts           # Store exports
├── views/
│   ├── layouts/           # Layout wrapper components
│   │   └── DefaultLayout.vue
│   └── pages/             # Page components (route targets)
│       └── HomePage.vue
├── App.vue                # Root component
├── main.ts                # Entry point (bootstrap app)
└── env.d.ts               # Vite env type declarations
```

## Feature Page Convention (Reference Architecture)

When adding new feature pages, follow this folder structure (adopted from shadcn-vue-admin):

```text
views/pages/<feature>/
├── index.vue              # Main page
├── components/            # Page-specific components
│   ├── columns.ts         # Table column definitions
│   ├── data-table.vue     # Table wrapper
│   ├── <resource>-form.vue     # Create/edit form
│   └── <resource>-create.vue   # Create modal trigger
├── data/                  # Static data & schemas
│   └── schema.ts          # Zod schema + types
└── validators/            # Form validators
    └── <resource>.validator.ts
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

## UI Component System (shadcn-vue)

### Principles

- Use radix-vue as unstyled primitives (accessible by default)
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

## Composable Pattern

Business logic is encapsulated in composable functions:

```typescript
// Naming: use<Feature>()
export function useAuth() {
  const loading = ref(false)

  async function login(credentials: LoginPayload) {
    loading.value = true
    // ... logic
    loading.value = false
  }

  return { loading, login }
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
- Responsive modal pattern (from shadcn-vue-admin): Dialog on desktop, Drawer/Sheet on mobile

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Components | PascalCase | `UserForm.vue`, `DataTable.vue` |
| Composables | camelCase + `use` prefix | `useAuth()`, `useFetch()` |
| Stores | camelCase + `use...Store` | `useAuthStore()` |
| Pages | PascalCase | `HomePage.vue`, `UsersPage.vue` |
| Layouts | PascalCase + Layout suffix | `DefaultLayout.vue` |
| Utils/lib | camelCase | `utils.ts`, `formatDate.ts` |
| Validators | camelCase + `.validator.ts` | `user.validator.ts` |
| CSS files | kebab-case | `app.css` |

## Best Practices

1. **TypeScript strict**: Always define interfaces/types for props, emits, and API responses
2. **Single responsibility**: One component = one responsibility
3. **Composition API only**: Do not use Options API
4. **Import alias**: Always use `@/` instead of long relative paths
5. **Colocate code**: Page-specific code stays in that page's folder
6. **Shared code rises**: Composables and components used by more than one page move to `resources/app/` level
7. **No inline styles**: Use Tailwind utility classes
8. **Accessible**: Use semantic HTML and radix-vue primitives
9. **Server-side validation always**: Never rely solely on client-side validation

## Build & Verification

```bash
npm run build     # Production build (type-check included)
npm run dev       # Development server with HMR
```

Always run `npm run build` after frontend changes to ensure no type errors.
