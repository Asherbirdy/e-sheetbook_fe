# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an e-SheetBook frontend application built with React, Vite, Chakra UI v3, Preact Signals, Zustand, and TanStack Query. It provides a spreadsheet/file management interface with authentication and dashboard features.

## Technology Stack

- **Build Tool**: Vite 5.x with SWC for fast React compilation
- **UI Framework**: Chakra UI v3 with Emotion for styling
- **State Management**:
  - Zustand for global state
  - Preact Signals for component-level state
- **Data Fetching**: TanStack Query (React Query) for server state
- **Routing**: React Router v6 with file-based routing via `vite-plugin-pages`
- **Testing**: Vitest with React Testing Library
- **Type Checking**: TypeScript with strict mode enabled

## Development Commands

```bash
# Start development server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with coverage
npm test:coverage

# Type check without emitting files
npm run type-check

# Lint code
npm run lint

# Detect unused dependencies
npm run knip
```

## Code Architecture

### File-based Routing

Routes are automatically generated from `src/pages/**/*.tsx` files using `vite-plugin-pages`. The convention:
- `src/pages/index.tsx` → `/`
- `src/pages/login.tsx` → `/login`
- `src/pages/dashboard/index.tsx` → `/dashboard`
- `src/pages/[...all].tsx` → catch-all 404 route

Routes are imported via `~react-pages` (auto-generated) and used with `useRoutes()` in `App.tsx`.

### Route Guards System

The project implements a comprehensive route protection system in `src/router/`:

**Available Guards** (`src/router/guards.ts`):
- `dashboardBeforeEnter`: Checks token, redirects to `/` if missing
- `authBeforeEnter`: Verifies authentication status
- `guestBeforeEnter`: Allows only unauthenticated users (redirects authenticated users to `/dashboard`)
- `adminBeforeEnter`: Requires both authentication and `userRole === 'admin'`

**Usage with ProtectedRoute component** (recommended):
```tsx
<Route path="/dashboard" element={
  <ProtectedRoute guard={dashboardBeforeEnter}>
    <Dashboard />
  </ProtectedRoute>
} />
```

Guards support async operations and return `boolean | Promise<boolean>`. See `src/router/README.md` for complete documentation.

### API Layer Architecture

**Custom Axios Wrapper** (`src/api/http/axios/Axios.ts`):
- Class-based Axios instance with interceptor support
- Automatic abort for duplicate requests via `AbortAxios`
- Configurable retry mechanism (currently disabled: `count: 0`)
- Request/response interceptors defined in `requestInterceptors.ts`
- Base URL configured in `src/api/http/config.ts` as `localhost:8080`

**API Modules** (`src/api/apis/`):
- `useAuthApi`: Login, register, send OTP
- `useFileApi`: File CRUD operations
- `useSheetApi`: Spreadsheet operations
- `useUserApi`: User profile operations

All API functions return `AxiosPromise<T>` for proper type inference with TanStack Query.

### State Management with Zustand

Stores are located in `src/stores/`. Example pattern:
```typescript
import { create } from 'zustand'

interface Store {
  state: Type
  action: () => void
}

export const useStore = create<Store>((set) => ({
  state: initialValue,
  action: () => set((state) => ({ ... })),
}))
```

See `src/stores/counterStore.ts` for reference implementation.

### State Management with Preact Signals (REQUIRED)

**IMPORTANT**: For component-level state (form inputs, UI toggles, etc.), you MUST use Preact Signals with `useSignal()` instead of React's `useState`. This is a project-wide standard.

**Installation**: `@preact/signals-react` and `@preact/signals-react-transform` are already installed as dev dependencies.

**Critical Setup**: The Vite config (`vite.config.ts`) MUST include the Preact Signals transform plugin:
```typescript
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // 啟用 Preact Signals 自動追蹤
      babel: {
        plugins: [['@preact/signals-react-transform']],
      },
    }),
  ],
})
```
This enables automatic tracking of signals in React components. Without this, input fields and other reactive elements will not update properly.

**Note**: Must use `@vitejs/plugin-react` (not `@vitejs/plugin-react-swc`) to support Babel plugins.

**Standard Component State Structure (REQUIRED)**:

Every TSX component MUST follow this standardized state structure for consistency and maintainability:

```typescript
import { useSignal } from '@preact/signals-react'

const MyComponent = () => {
  // ✅ REQUIRED: Standard state structure with 'data' and 'features'
  const state = {
    // data: Business data / form data
    data: {
      email: useSignal(''),
      password: useSignal(''),
      username: useSignal(''),
      // ... other business data
    },
    // features: UI state / interaction state
    features: {
      showPassword: useSignal(false),
      isLoading: useSignal(false),
      // Validation errors
      errors: {
        email: useSignal(''),
        password: useSignal(''),
      },
      // Touch tracking for validation
      touched: {
        email: useSignal(false),
        password: useSignal(false),
      },
    },
  }

  // ✅ REQUIRED: Destructure state in functions for cleaner code
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { data, features } = state
    data.email.value = e.target.value

    if (features.touched.email.value) {
      features.errors.email.value = validateEmail(e.target.value)
    }
  }

  return (
    <input
      value={state.data.email.value}
      onChange={handleChange}
    />
  )
}
```

**Structure Rules**:
1. **state.data**: Contains all business data, form inputs, and user data
2. **state.features**: Contains UI state (loading, visibility), validation (errors, touched), and interaction state
3. **Single useSignal per field**: Each individual value uses its own `useSignal()` - never use `useState`
4. **Consistent naming**: Always use `state` as the root object name
5. **Group related signals**: errors and touched should be nested objects under `features`
6. **Destructure in functions (REQUIRED)**: Every function that accesses `state.data` or `state.features` MUST destructure them at the start: `const { data, features } = state`. This improves code readability and reduces repetitive `state.` prefixes

**Alternative for simple components** (when only data or only features):
```typescript
// For components with only data (no UI state)
const state = {
  data: {
    name: useSignal(''),
    age: useSignal(0),
  },
}

// For components with only features (no business data)
const state = {
  features: {
    isOpen: useSignal(false),
    activeTab: useSignal(0),
  },
}
```

**Key Rules**:
1. **Use useSignal()**: Always use `useSignal()` hook inside components (not `signal()` outside)
2. **Organized Structure**: Group related signals in an object structure for clarity
3. **Fine-grained Updates**: Each signal updates independently - `formState.email.value = 'new value'`
4. **Direct Access**: Read and compare values directly - `if (formState.email.value === '') { ... }`
5. **Each Instance Independent**: Every component instance has its own independent state
6. **Use Cases**:
   - ✅ Form inputs and validation
   - ✅ UI toggles (modals, dropdowns, tooltips)
   - ✅ Component-specific state
   - ❌ Don't use for global app state (use Zustand)
   - ❌ Don't use for server data (use TanStack Query)

**Benefits**:
- ✅ Fine-grained reactivity like Vue 3 (only re-renders affected parts)
- ✅ Direct property access and updates
- ✅ No spread operators or immutability concerns
- ✅ Each component instance has independent state
- ✅ Simpler, more intuitive code
- ✅ Better performance than useState

**Reference Implementation**: See `src/pages/login.tsx` for a complete example.

**Migration from useState**:
```typescript
// ❌ Old way (DO NOT USE)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

setEmail('new@email.com')
if (email === '') { ... }

// ✅ New way (REQUIRED)
const formState = {
  email: useSignal(''),
  password: useSignal(''),
}

formState.email.value = 'new@email.com'
if (formState.email.value === '') { ... }
```

### Layout System

Two main layouts in `src/layout/`:

1. **DashboardLayout** (`DashboardLayout.tsx`):
   - Responsive sidebar (drawer on mobile, persistent on desktop)
   - Dashboard header with color mode toggle and user menu
   - Page transitions using Framer Motion
   - Sidebar collapse at `md` breakpoint (60 units margin-left)
   - Currently has dashboard guard commented out in useEffect

2. **DefaultLayout** (`DefaultLayout.tsx`):
   - Simple layout for public pages

### Type Organization

Types are organized by domain in `src/types/`:
- `api/auth/`: Login, Register, SendOTP types
- `api/file/`: File CRUD operation types
- `api/sheet/`: Sheet CRUD operation types
- `api/user/`: User-related types
- `app/`: Application-level types
- `common/`: Shared types

All types are re-exported from `src/types/index.ts` for centralized imports.

### Path Aliases

The project uses `@/*` alias pointing to `src/*`:
- Configured in `tsconfig.json` (`baseUrl: "./src"`)
- Configured in `vite.config.ts` using `vite-tsconfig-paths`
- Always use `@/` imports for src files

### Auto-imports

React hooks are auto-imported via `unplugin-auto-import`:
- No need to manually import `useState`, `useEffect`, etc.
- Generates `auto-imports.d.ts` for TypeScript

## Component Patterns

### Chakra UI v3 Components

Located in `src/components/ui/`, these are Chakra v3 "composition" components:
- `provider.tsx`: Chakra theme provider setup
- `color-mode.tsx`: Color mode utilities
- `dialog.tsx`, `drawer.tsx`, `menu.tsx`: Composed overlay components
- `toaster.tsx`: Toast notification system

Always use these composed components instead of importing directly from `@chakra-ui/react`.

### UI Styling Best Practices

**Priority order for styling:**
1. **Chakra UI props** (primary approach): Use Chakra's built-in style props (e.g., `bg`, `color`, `p`, `m`, `w`, `h`, etc.)
2. **Chakra's styling utilities**: Use `sx` prop or styled system when needed
3. **Avoid**: Inline styles (`style={{}}`) and CSS classes (`className`) unless absolutely necessary

**Examples:**
```tsx
// ✅ Good - Use Chakra props
<Box bg="gray.100" p={4} borderRadius="md">
  <Text fontSize="lg" color="brand.primary">Hello</Text>
</Box>

// ❌ Avoid - Inline styles
<div style={{ backgroundColor: '#f0f0f0', padding: '16px' }}>
  <p style={{ fontSize: '18px' }}>Hello</p>
</div>

// ❌ Avoid - CSS classes
<div className="container">
  <p className="text-large">Hello</p>
</div>
```

This ensures consistency with Chakra's theming system, responsive design, and color mode support.

### Common Components

In `src/components/common/`:
- `Dashboard/`: Sidebar, header, and navigation components
- `Website/`: Public website header
- `ColorModeSwitcher.tsx`: Theme toggle button

## Authentication Flow

1. Token stored in `localStorage.getItem('token')`
2. User role stored in `localStorage.getItem('userRole')`
3. Axios interceptor adds token to requests (see `requestInterceptors.ts`)
4. Guards check localStorage for route protection
5. API endpoints at `localhost:8080` (configured in `src/api/http/config.ts`)

## Testing

Tests use Vitest with jsdom environment:
- Test files: `*.test.ts` or `*.test.tsx`
- Coverage reports with `@vitest/coverage-v8`
- React Testing Library for component tests

## Important Conventions

1. **Component Files**: Use PascalCase for component files (e.g., `DashboardLayout.tsx`)
2. **Utility Files**: Use camelCase for utility files (e.g., `counterStore.ts`)
3. **Type Files**: Suffix with `Type.ts` for type definitions (e.g., `LoginType.ts`)
4. **Enum Files**: Suffix with `Enum.ts` for enums (e.g., `RoutesEnum.ts`)
5. **API Exports**: Use object with methods pattern (e.g., `export const useAuthApi = { login, register }`)
6. **Store Exports**: Use `useXxxStore` naming for Zustand stores
7. **UI Styling**: Always prioritize Chakra UI style props over inline styles or CSS classes (see UI Styling Best Practices)
8. **Component State (REQUIRED)**: Use Preact Signals for ALL component-level state instead of `useState`. Always group related signals in a single state object defined outside the component (see State Management with Preact Signals)
9. **Form Handling**: DO NOT use Formik, Yup, or other form libraries. Use Chakra UI components with Preact Signals for form state management

## Known Configuration

- Dev server opens automatically on port 3000
- TypeScript strict mode enabled
- ESLint configured for React with TypeScript
- Knip for detecting unused dependencies (config in `knip.config.ts`)
- All API requests include `withCredentials: true` for cookies/sessions
