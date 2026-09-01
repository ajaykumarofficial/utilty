// API Endpoints
export const apiEndPoints = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_OTP: '/auth/verify-otp',
  ME: '/auth/me',

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',

  // Users/Staff
  GET_USERS: '/users',
  CREATE_USER: '/users',
  UPDATE_USER: '/users/:id',
  DELETE_USER: '/users/:id',
  GET_USER: '/users/:id',
}

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  AUTH_TOKEN: 'authToken',
  THEME: 'theme',
}

// Cookie Names (for dual-portal environments)
export const COOKIE_NAMES = {
  ADMIN_ACCESS_TOKEN: 'adminAccessToken',
  ADMIN_REFRESH_TOKEN: 'adminRefreshToken',
}

// Common Constants
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
}

// Role Enums
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  STAFF: 'staff',
} as const

// Route Paths
export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Features
  USERS: '/users',
  ORDERS: '/orders',
  WAREHOUSES: '/warehouses',

  // Error
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
}
