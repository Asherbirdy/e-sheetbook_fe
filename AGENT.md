# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Convention

**CRITICAL**: All responses and code comments MUST be written in Traditional Chinese (繁體中文).

- ✅ **Responses to user**: Always use Traditional Chinese
- ✅ **Code comments**: Always use Traditional Chinese
- ✅ **Git commit messages**: Always use Traditional Chinese
- ⚠️ **This AGENT.md file**: Keep in English for compatibility with Claude Code


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


## Code Architecture
### Layout Patterns
#### Nested Routes with Outlet
The project uses React Router's `Outlet` component to create nested layouts. This allows for shared layout components (like `DashboardLayout`) to wrap multiple routes while only swapping out the content area.

**Example**:

```tsx
// src/pages/dashboard.tsx
import { Outlet } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout'

const DashboardRoute = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}

export default DashboardRoute
```

**Key Points**:
- The `Outlet` component acts as a placeholder for child routes
- The parent route (`DashboardRoute`) provides the shared layout
- Child routes will be rendered where the `Outlet` is placed
- This pattern is commonly used for wrapping authenticated routes with common UI elements

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

### State Management with Preact Signals (REQUIRED)

**IMPORTANT**: For component-level state (form inputs, UI toggles, etc.), you MUST use Preact Signals with `useSignal()` instead of React's `useState`. This is a project-wide standard.

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
  validation: {
    emailTouched: useSignal(false),
    passwordTouched: useSignal(false),
  },
}

```

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

### Component Export Convention (REQUIRED)

**IMPORTANT**: All reusable components MUST be exported through `src/components/index.ts` for centralized imports.
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

**When creating new components**:
1. Create the component file in the appropriate directory (e.g., `src/components/app/file/NewComponent.tsx`)
2. Immediately add the export to `src/components/index.ts`
3. Group the export with related components using comment headers

### Date Handling with Day.js
**IMPORTANT**: For all date parsing, formatting, and manipulation, use Day.js instead of native JavaScript Date methods.
