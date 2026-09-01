import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { ROUTES } from '@/utils/constants'

interface AuthMiddlewareProps {
  children: React.ReactNode
}

/**
 * Middleware for auth-only routes (login, register, forgot-password)
 * Redirects authenticated users to dashboard
 */
export function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <>{children}</>
}

export default AuthMiddleware
