# React Admin Portal

A modern React 19 + TypeScript + Vite admin application with authentication, routing, state management, and a standardized architecture.

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router v7
- **State Management**: Redux Toolkit + Redux Persist
- **Server State**: TanStack React Query v5
- **HTTP Client**: Axios with interceptors
- **Styling**: TailwindCSS + clsx
- **Forms**: React Hook Form + Zod
- **UI Components**: @headlessui/react, lucide-react
- **Notifications**: react-hot-toast

## 📁 Project Structure

```
src/
├── assets/              # Static assets
├── components/          # Reusable UI components
│   ├── ui/             # Primitive components (Button, Input, etc.)
│   ├── ProtectedRoute.tsx
│   └── AuthMiddleware.tsx
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── layouts/            # Layout wrapper components
├── pages/              # Feature pages (auth, dashboard, etc.)
├── redux/              # Redux store & slices
│   ├── slices/
│   └── store.ts
├── routes/             # Route configuration
│   ├── index.tsx
│   └── authRoutes.tsx
├── services/           # API services & TanStack Query hooks
│   ├── api.ts
│   └── authService.ts
├── styles/             # Global CSS/Tailwind
├── types/              # TypeScript interfaces
├── utils/              # Utility functions & helpers
│   ├── constants.ts
│   ├── helpers.ts
│   └── Loadable.tsx
├── App.tsx
└── main.tsx
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   # or
   pnpm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. **Start development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```
   The app will open at `http://localhost:5173`

## 📚 Architecture & Conventions

### API Layer

All API calls go through a centralized Axios instance with:
- **Credentials**: `withCredentials: true` for cookie-based auth
- **Portal Header**: `x-portal-type: admin` for backend routing
- **401 Refresh Queue**: Automatic token refresh with request queuing

### State Management

**Redux** for global UI state (auth, user session)
**TanStack Query** for server state (data fetching, caching)

### Routing & Guards

- **ProtectedRoute**: Checks authentication, redirects to login if not authenticated
- **AuthMiddleware**: Redirects authenticated users away from login

## 🚨 Golden Rules

1. ✅ **No hardcoded URLs** → Use `constants.ts`
2. ✅ **No raw DOM manipulation** → Use React state & refs
3. ✅ **Reuse UI components** → Before writing custom ones
4. ✅ **Handle all states** → Loading, empty, error cases
5. ✅ **Strict TypeScript** → No `any` types
6. ✅ **Lazy load pages** → Use `Loadable()` HOC
7. ✅ **Cache invalidation** → Auto-invalidate on mutations

## 📝 Scripts

```bash
yarn dev       # Start dev server
yarn build     # Build for production
yarn preview   # Preview production build
yarn lint      # Run ESLint
```

## 📖 Additional Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [TanStack Query](https://tanstack.com/query)