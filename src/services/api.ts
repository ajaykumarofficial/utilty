import axios from 'axios'
import { apiEndPoints } from '@/utils/constants'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-portal-type': 'admin',
  },
})

let isRefreshing = false
let failedQueue: Array<{ resolve: () => void; reject: (err: any) => void }> = []

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()))
  failedQueue = []
}

/**
 * Response interceptor: Handle 401 with token refresh queue
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh token or login endpoints
      if (
        originalRequest.url?.includes('/refresh-token') ||
        originalRequest.url?.includes('/login')
      ) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject: (err) => reject(err),
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axios.post(
          `${API_BASE_URL}${apiEndPoints.REFRESH_TOKEN}`,
          {},
          {
            withCredentials: true,
            headers: { 'x-portal-type': 'admin' },
          }
        )

        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        // Clear auth state and redirect to login
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

/**
 * Request interceptor for adding auth token or custom headers
 */
api.interceptors.request.use(
  (config) => {
    // Add any custom headers or token here
    return config
  },
  (error) => Promise.reject(error)
)

export default api
