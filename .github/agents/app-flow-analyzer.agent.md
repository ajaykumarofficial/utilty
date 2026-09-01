# React Frontend Architecture & Agent Guidelines

Standardized architecture, folder structure, coding conventions, API communication, routing, and state management rules for creating and scaling React + TypeScript frontend applications.

---

## 1. Core Technology Stack & Recommended Libraries

| Purpose | Library / Tool | Standard Usage |
|---|---|---|
| **Framework & Build** | `Vite` + `React 19` + `TypeScript` | Non-negotiable standard foundation. Strict type-safety enabled. |
| **Routing** | `react-router-dom` (v6/v7) | `createBrowserRouter`, layout routes, lazy page loading via `Loadable`. |
| **Server State & Caching** | `@tanstack/react-query` (v5) | All server GET/POST/PUT/DELETE queries and mutations with automated cache invalidation. |
| **Global Client State** | `@reduxjs/toolkit` + `react-redux` | Lightweight global UI state, user sessions, auth state with `redux-persist`. |
| **HTTP Client** | `axios` | Centralized Axios instance, `withCredentials: true`, 401 token refresh queue interceptor. |
| **Styling & Design System** | `TailwindCSS` + `clsx` + `tailwind-merge` (`cn` helper) | Utility-first styling with modern aesthetic tokens, glassmorphism, responsive utilities. |
| **Icons** | `lucide-react` | Unified, consistent iconography. |
| **Form Handling & Validation** | `react-hook-form` or `Formik` + `Yup` / `Zod` | Controlled forms, schema-based validation with custom UI error rendering. |
| **Toast & Alerts** | `react-hot-toast` | Non-blocking, beautiful toast notifications for success/error feedback. |
| **UI Primitives / Modals** | `@headlessui/react` | Accessible headless dropdowns, dialogs, transitions, and tabs. |
| **Date Handling** | `moment` or `date-fns` | Uniform date/time formatting. |
| **Data Visualizations** | `recharts` | Responsive charts and analytics graphs. |
| **PWA & Offline Fallback** | `vite-plugin-pwa` | Auto-updating Service Worker, precached routing fallback (`/index.html`). |

---

## 2. Directory & Folder Structure Standard

Every React project must strictly follow this modular, domain-driven structure:

```
src/
├── assets/                  # Static assets (images, logos, svg icons, fonts)
├── components/              # Shared, reusable UI components across the application
│   ├── ui/                  # Atom/Primitive components (Button, Input, Badge, Loader, Modal, Dropdown)
│   ├── tables/              # Reusable DataTable, TableHeader, TablePagination
│   ├── forms/               # Reusable Form components (FormField, SelectField, DatePickerField)
│   ├── charts/              # Reusable Chart wrappers (BarChart, LineChart, AreaChart)
│   ├── AuthMiddleware.tsx   # Auth guard for public/guest-only routes (redirects if already logged in)
│   └── ProtectedRoute.tsx   # Security guard for authenticated routes (checks token/role/permissions)
├── context/                 # React context providers (Theme, Toast, Sidebar state if not in Redux)
├── hooks/                   # Global, reusable custom React hooks
│   ├── useAuth.ts           # Authentication & session accessor hook
│   ├── useDebounce.ts       # Input debouncing hook for search filters
│   └── usePagination.ts     # Client/Server table pagination state hook
├── layouts/                 # Root layout wrappers with Outlets
│   ├── AdminLayout.tsx      # Authenticated app shell (Sidebar, Header, Content Area, Footer)
│   ├── AuthLayout.tsx       # Guest authentication layout (Centered Card, Split Screen)
│   └── components/          # Layout-specific subcomponents (Sidebar, Navbar, UserDropdown)
├── pages/                   # Feature & domain modules (1 folder per major feature/route)
│   ├── auth/                # Login, Register, ForgotPassword, ResetPassword, VerifyOTP
│   ├── dashboard/           # Main dashboard metrics & overview
│   ├── <feature-name>/      # e.g., warehouse-management, orders, staff, customers
│   │   ├── <Feature>Page.tsx     # Main page component or list view
│   │   ├── <Feature>Modal.tsx    # Add / Edit / View modal dialogs
│   │   ├── <Feature>Detail.tsx   # (Optional) Nested detail view
│   │   ├── components/           # Feature-specific subcomponents
│   │   └── use<Feature>.ts       # Feature-specific controller hook (optional abstraction)
│   └── error/               # 404 NotFound, 403 Forbidden, 500 ServerError
├── redux/                   # Redux Toolkit store, rootReducer, and feature slices
│   ├── slices/              # e.g., authSlice.ts, userSlice.ts, uiSlice.ts
│   └── store.ts             # Redux store configuration with redux-persist
├── routes/                  # Central routing definitions
│   ├── index.tsx            # Root createBrowserRouter with catch-all fallback (*)
│   ├── authRoutes.tsx       # Unauthenticated guest routes (/login, /forgot-password)
│   └── protectedRoutes.tsx  # Authenticated feature routes (/dashboard, /orders, etc.)
├── services/                # API communication layer (TanStack Query + Axios)
│   ├── api.ts               # Core Axios instance, interceptors, refresh queue
│   └── <feature>Service.ts  # TanStack query/mutation hooks (e.g., orderService.ts)
├── styles/                  # Global CSS, Tailwind imports, custom font faces
├── types/                   # TypeScript interfaces, DTOs, Enums, API Models
│   ├── index.ts             # Core domain models, user entities, common response types
│   └── <feature>.ts         # Domain-specific DTOs and payload interfaces
└── utils/                   # Pure utility functions, constants, helpers
    ├── constants.ts         # API endpoints (apiEndPoints), Enum constants, storage keys
    ├── helpers.ts           # Formatters (currency, dates, phone, string helpers, `cn()`)
    └── Loadable.tsx         # Lazy loading Suspense wrapper HOC
```

---

## 3. API Handling & Network Layer Architecture

### 3.1 Centralized Axios Client (`src/services/api.ts`)
1. **Cookie-First Security**: Always set `withCredentials: true`. Session tokens reside in `httpOnly` secure cookies to mitigate XSS vulnerabilities.
2. **Portal Header Isolation**: Send a disambiguation header (e.g., `'x-portal-type': 'admin'`) so the backend correctly handles dual portals on the same domain.
3. **Queue-Based 401 Refresh Interceptor**: If an access token expires (`401 Unauthorized`), the interceptor pauses outgoing requests in a queue, calls the refresh token endpoint once, and replays all failed requests seamlessly.

```typescript
import axios from 'axios';
import { apiEndPoints } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-portal-type': 'admin',
  },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (err: any) => void }> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/refresh-token') || originalRequest.url?.includes('/login')) {
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await axios.post(`${API_BASE_URL}${apiEndPoints.REFRESH_TOKEN}`, {}, { withCredentials: true, headers: { 'x-portal-type': 'admin' } });
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

### 3.2 Service & TanStack Query Layer Pattern (`src/services/<domain>Service.ts`)
Group all API calls for a domain together with query/mutation hooks and query keys:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { apiEndPoints } from '../utils/constants';
import { Warehouse, ApiResponse } from '../types';

export const QUERY_KEY_WAREHOUSES = 'warehouse-list';
export const QUERY_KEY_WAREHOUSE_DETAIL = 'warehouse-detail';

// Query hook
export const useGetWarehouses = () => {
  return useQuery({
    queryKey: [QUERY_KEY_WAREHOUSES],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Warehouse[]>>(apiEndPoints.GET_WAREHOUSES);
      return data.data;
    },
  });
};

// Mutation hook with automated cache invalidation
export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Warehouse>) => {
      const { data } = await api.post<ApiResponse<Warehouse>>(apiEndPoints.CREATE_WAREHOUSE, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_WAREHOUSES] });
    },
  });
};
```

---

## 4. Routing Architecture & Route Guards

### 4.1 Lazy Loading HOC (`src/utils/Loadable.tsx`)
```typescript
import { Suspense, ComponentType, ReactNode } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Loadable = (Component: ComponentType, fallback: ReactNode = (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <LoadingSpinner size="lg" />
  </div>
)) => (props: any) => (
  <Suspense fallback={fallback}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
```

### 4.2 Route Organization & Root Catch-All (`src/routes/index.tsx`)
1. Separate routes into `authRoutes` and `protectedRoutes`.
2. Always add a wildcard `{ path: '*', element: <Navigate to="/dashboard" replace /> }` at the root and layout levels to prevent 404 dead-ends.

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { protectedRoutes } from './protectedRoutes';

export const router = createBrowserRouter([
  authRoutes,
  protectedRoutes,
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
```

### 4.3 Route Guards (`ProtectedRoute.tsx` & `AuthMiddleware.tsx`)
- **`ProtectedRoute`**: Verifies user session/cookie exists; redirects unauthenticated visitors to `/login`. Optionally checks role/permissions and renders a 403 screen if forbidden.
- **`AuthMiddleware`**: Checks if user is already authenticated; if so, redirects away from login/register to `/dashboard`.

---

## 5. Page & Component Creation Standards

### 5.1 Page Layout Blueprint (`src/pages/<feature>/<Feature>Page.tsx`)
Every dashboard list/management page should adhere to this standard anatomy:
1. **Header Section**: Page Title, Breadcrumbs, Action Buttons (e.g. "+ Add New", "Export Excel").
2. **Filter & Search Bar**: Search input with debouncing, status/role dropdown filters, date range pickers.
3. **Data Table**: Clean `DataTable` component with typed columns, sorting, action dropdowns (Edit, Delete, View).
4. **Pagination**: Bottom pagination bar with page size selector.
5. **Modals**: Self-contained `Add/Edit/View` dialogs with Formik or React Hook Form validation.

### 5.2 Modal & Form Blueprint (`src/pages/<feature>/<Feature>Modal.tsx`)
- Props interface must define `isOpen: boolean`, `onClose: () => void`, `mode: 'add' | 'edit' | 'view'`, `initialData?: T`.
- Reset form values on open/close.
- Display backend error messages and toast success upon completion.

---

## 6. TypeScript Models & Enums (`src/types/index.ts`)

- **Strict Interfaces**: Never use `any` for core data entities.
- **Unified API Response Schema**:
  ```typescript
  export interface ApiResponse<T = any> {
    message: string;
    data: T;
    status?: boolean;
  }
  ```
- **Shared Domain Enums**: Store enum strings in `src/utils/constants.ts` and export corresponding union types in `src/types/index.ts`.

---

## 7. Golden Rules for Frontend Coding

1. **Zero Raw Hardcoded URLs**: All API paths must be declared in `src/utils/constants.ts` under `apiEndPoints`.
2. **Never Overwrite Cookie Names**: In dual-portal environments (Admin + Customer on same host), use distinct cookie names (`staffAccessToken` vs `customerAccessToken`).
3. **No Direct DOM Manipulation**: Use React state, refs, and headless component primitives.
4. **Clean Code & Ponytail Simplicity**:
   - Reuse existing UI components (`DataTable`, `LoadingSpinner`, `Button`, `Modal`) before writing custom ones.
   - Delete unused imports, commented debug code, and empty hooks.
   - Handle loading, empty, and error states gracefully in all views.
