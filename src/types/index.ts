// Core API Response Schema
export interface ApiResponse<T = any> {
  message: string
  data: T
  status?: boolean
}

// User & Auth Types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'staff'
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Common UI Types
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
