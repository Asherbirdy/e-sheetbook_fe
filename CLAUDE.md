# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Convention

**CRITICAL**: All responses and code comments MUST be written in Traditional Chinese (繁體中文).

- ✅ **Responses to user**: Always use Traditional Chinese
- ✅ **Code comments**: Always use Traditional Chinese
- ✅ **Git commit messages**: Always use Traditional Chinese
- ✅ **Documentation files (except CLAUDE.md)**: Use Traditional Chinese
- ⚠️ **This CLAUDE.md file**: Keep in English for compatibility with Claude Code

**Examples:**
```typescript
// ✅ Correct - Traditional Chinese comments
const handleLogin = () => {
  // 驗證用戶輸入的電子郵件格式
  if (!isValidEmail(email)) {
    showError('請輸入有效的電子郵件地址')
    return
  }
}

// ❌ Wrong - English comments
const handleLogin = () => {
  // Validate user email format
  if (!isValidEmail(email)) {
    showError('Please enter a valid email address')
    return
  }
}
```

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
- **Date Handling**: Day.js for date parsing, formatting, and manipulation
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

**Structure Rules for `useSignal()`**:

When using `useSignal()` in function components, declare `data` and `features` as **separate, independent constants**:

```typescript
// ✅ Correct - Separate data and features
const data = {
  email: useSignal(''),
  password: useSignal(''),
}

const features = {
  isLoading: useSignal(false),
  error: useSignal(''),
  // Can have nested structure for organization
  validation: {
    emailTouched: useSignal(false),
    passwordTouched: useSignal(false),
  },
}

// ❌ Wrong - Do NOT nest under a state object
const state = {
  data: { email: useSignal('') },
  features: { isLoading: useSignal(false) },
}
```

**Structure Rules for `signal()`**:

When using `signal()` (outside components), use a `state` object:

```typescript
// ✅ Correct - Use state object for signal()
const state = {
  info: signal({ count: 0 }),
  config: signal({ theme: 'light' }),
}
```

**Key Rules**:
1. **Use useSignal() inside components**: Always use `useSignal()` hook inside components (not `signal()` outside)
2. **Separate data and features**: Declare `data` and `features` as independent constants, never nested under `state`
3. **Organized Structure**: Group related signals within `data` or `features` for clarity
4. **Nested organization allowed**: You can nest objects within `features` for better organization (e.g., `edit: { isDialogOpen: useSignal(false) }`)
5. **Fine-grained Updates**: Each signal updates independently - `data.email.value = 'new value'`
6. **Direct Access**: Read and compare values directly - `if (data.email.value === '') { ... }`
7. **Destructure in functions**: Functions can destructure `data` and `features` for cleaner code: `const { data, features } = { data, features }`
8. **Each Instance Independent**: Every component instance has its own independent state
9. **Use Cases**:
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
- ✅ Clear separation between data and UI state

**Reference Implementation**: See `src/components/app/file/FileMenu.tsx` for a complete example.

**Migration from useState**:
```typescript
// ❌ Old way (DO NOT USE)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [isLoading, setIsLoading] = useState(false)

setEmail('new@email.com')
if (email === '') { ... }

// ✅ New way (REQUIRED)
const data = {
  email: useSignal(''),
  password: useSignal(''),
}

const features = {
  isLoading: useSignal(false),
  error: useSignal(''),
}

data.email.value = 'new@email.com'
if (data.email.value === '') { ... }
features.isLoading.value = true
```

**Complex Example with Nested Features**:
```typescript
const data = {
  fileName: useSignal('document.txt'),
  content: useSignal(''),
}

const features = {
  // Organize by feature area
  edit: {
    isDialogOpen: useSignal(false),
    isSubmitting: useSignal(false),
  },
  delete: {
    isDialogOpen: useSignal(false),
    isDeleting: useSignal(false),
  },
  validation: {
    error: useSignal(''),
    touched: useSignal(false),
  },
}

// Usage
features.edit.isDialogOpen.value = true
features.validation.error.value = 'Invalid input'
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

The following are auto-imported via `unplugin-auto-import` (configured in `vite.config.ts`):

**React hooks**: All standard React hooks are available without imports
- `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, etc.

**Preact Signals**: Core signal functions
- `useSignal` - Create signals inside components (primary method)
- `signal` - Create signals outside components
- `computed`, `effect`, `batch`

**TanStack Query**: React Query hooks
- `useQuery` - Fetch and cache data
- `useMutation` - Mutate data
- `useQueryClient` - Access query client
- `useInfiniteQuery`, `useQueries`, `useIsFetching`, `useIsMutating`

**React Router DOM**: Navigation and routing hooks
- `useNavigate` - Programmatic navigation
- `useParams` - Access URL parameters
- `useLocation` - Access location object
- `useSearchParams` - Access/modify query params
- `useMatch`, `useOutlet`, `useRoutes`

**Important**: The `auto-imports.d.ts` file is generated automatically and must be included in `tsconfig.json` for TypeScript to recognize these globals. No manual imports needed for any of the above.

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

### Component Export Convention (REQUIRED)

**IMPORTANT**: All reusable components MUST be exported through `src/components/index.ts` for centralized imports.

**Structure Pattern**:
```typescript
// src/components/index.ts

// ** pages
export * from './page/Dashboard/Login/LoginForm'

// ** common
export * from './page/Dashboard/DashboardHeader'
export * from './page/Website/WebsiteHeader'

// ** app - file (組件按功能分組)
export * from './app/file/FileAddButton'
export * from './app/file/FileMenu'
export * from './app/file/FileAccordion'

// ** app - sheet
export * from './app/sheet/SheetViewer'
```

**Key Rules**:
1. **Centralized exports**: Always export through `index.ts`, never import directly from component files
2. **Group by feature**: Use comment headers to organize exports by feature area (pages, common, app/file, app/sheet, etc.)
3. **Alphabetical order**: Within each group, maintain alphabetical order for easier maintenance
4. **Barrel exports**: Use `export *` pattern to re-export all named exports from component files

**Usage Examples**:
```typescript
// ✅ Correct - Import from centralized index
import { FileMenu, FileAccordion, FileAddButton } from '@/components'

// ❌ Wrong - Direct import from component file
import { FileMenu } from '@/components/app/file/FileMenu'
```

**Benefits**:
- ✅ Single source of truth for all component imports
- ✅ Easier refactoring (only update one file when moving components)
- ✅ Cleaner import statements
- ✅ Better code organization and discoverability

**When creating new components**:
1. Create the component file in the appropriate directory (e.g., `src/components/app/file/NewComponent.tsx`)
2. Immediately add the export to `src/components/index.ts`
3. Group the export with related components using comment headers

### Date Handling with Day.js

**IMPORTANT**: For all date parsing, formatting, and manipulation, use Day.js instead of native JavaScript Date methods.

**Installation**: `dayjs` is already installed as a dependency.

**Usage Pattern**:
```typescript
import dayjs from 'dayjs'

// Formatting dates
const formatted = dayjs(dateString).format('YYYY/MM/DD')
const time = dayjs(dateString).format('HH:mm:ss')
const full = dayjs(dateString).format('YYYY/MM/DD HH:mm:ss')

// Parsing dates
const date = dayjs('2024-01-01')

// Manipulating dates
const tomorrow = dayjs().add(1, 'day')
const lastMonth = dayjs().subtract(1, 'month')

// Comparing dates
const isAfter = dayjs(date1).isAfter(date2)
const isBefore = dayjs(date1).isBefore(date2)

// Getting date parts
const year = dayjs().year()
const month = dayjs().month() // 0-11
const day = dayjs().date()
```

**Common Format Patterns**:
- `YYYY/MM/DD` - Year/Month/Day (e.g., 2024/01/15)
- `YYYY-MM-DD` - ISO format (e.g., 2024-01-15)
- `MM/DD/YYYY` - US format (e.g., 01/15/2024)
- `HH:mm:ss` - 24-hour time (e.g., 14:30:00)
- `YYYY/MM/DD HH:mm` - Date and time (e.g., 2024/01/15 14:30)

**Why Day.js?**
- ✅ Lightweight (2KB) compared to alternatives
- ✅ Same API as Moment.js but smaller bundle size
- ✅ Immutable and chainable
- ✅ Plugin support for extended functionality
- ✅ Better cross-browser compatibility
- ✅ TypeScript support

**Reference**: See `src/components/common/Dashboard/Sidebar/SidebarFileContent.tsx:17-19` for implementation example.

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

1. **Language (CRITICAL)**: All responses and code comments MUST be in Traditional Chinese (繁體中文). Git commit messages should also use Traditional Chinese. Only this CLAUDE.md file should remain in English (see Language Convention section)
2. **Component Files**: Use PascalCase for component files (e.g., `DashboardLayout.tsx`)
3. **Utility Files**: Use camelCase for utility files (e.g., `counterStore.ts`)
4. **Type Files**: Suffix with `Type.ts` for type definitions (e.g., `LoginType.ts`)
5. **Enum Files**: Suffix with `Enum.ts` for enums (e.g., `RoutesEnum.ts`)
6. **API Exports**: Use object with methods pattern (e.g., `export const useAuthApi = { login, register }`)
7. **Store Exports**: Use `useXxxStore` naming for Zustand stores
8. **UI Styling**: Always prioritize Chakra UI style props over inline styles or CSS classes (see UI Styling Best Practices)
9. **Component State (REQUIRED)**: Use Preact Signals for ALL component-level state instead of `useState`. Declare `data` and `features` as separate, independent constants using `useSignal()`. Never nest them under a `state` object (see State Management with Preact Signals)
10. **Component Exports (REQUIRED)**: All reusable components MUST be exported through `src/components/index.ts` for centralized imports. Group exports by feature area with comment headers (see Component Export Convention)
11. **Form Handling**: DO NOT use Formik, Yup, or other form libraries. Use Chakra UI components with Preact Signals for form state management
12. **Date Handling (REQUIRED)**: Always use Day.js for date operations instead of native JavaScript Date methods (see Date Handling with Day.js)

## Known Configuration

- Dev server opens automatically on port 3000
- TypeScript strict mode enabled
- ESLint configured for React with TypeScript
- Knip for detecting unused dependencies (config in `knip.config.ts`)
- All API requests include `withCredentials: true` for cookies/sessions
