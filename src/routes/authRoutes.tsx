import { Navigate, RouteObject } from 'react-router-dom'
import AuthMiddleware from '@/components/AuthMiddleware'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ROUTES } from '@/utils/constants'
import Loadable from '@/utils/Loadable'

// Lazy load pages
const LoginPage = Loadable(
  () => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const RegisterPage = Loadable(
  () => import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage }))
)
const DashboardPage = Loadable(
  () => import('@/pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const NotFoundPage = Loadable(
  () => import('@/pages/error/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

// Auth Routes
export const authRoutes: RouteObject = {
  path: '/',
  children: [
    {
      path: ROUTES.LOGIN,
      element: (
        <AuthMiddleware>
          <LoginPage />
        </AuthMiddleware>
      ),
    },
    {
      path: ROUTES.REGISTER,
      element: (
        <AuthMiddleware>
          <RegisterPage />
        </AuthMiddleware>
      ),
    },
  ],
}

// Protected Routes
export const protectedRoutes: RouteObject = {
  path: '/',
  children: [
    {
      path: ROUTES.DASHBOARD,
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),
    },
  ],
}

// Catch-all route
export const notFoundRoute: RouteObject = {
  path: '*',
  element: <NotFoundPage />,
}
