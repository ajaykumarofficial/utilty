import { createBrowserRouter } from 'react-router-dom'
import { authRoutes, protectedRoutes, notFoundRoute } from './authRoutes'

export const router = createBrowserRouter([
  authRoutes,
  protectedRoutes,
  notFoundRoute,
])
