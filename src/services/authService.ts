import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './api'
import { apiEndPoints } from '@/utils/constants'
import { ApiResponse, User } from '@/types'

export const QUERY_KEY_AUTH = 'auth'
export const QUERY_KEY_USER = 'user'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  email: string
  password: string
  name: string
}

/**
 * Get current logged-in user
 */
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEY_AUTH, QUERY_KEY_USER],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>(apiEndPoints.ME)
      return data.data
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<ApiResponse<User>>(
        apiEndPoints.LOGIN,
        payload
      )
      return data.data
    },
    onSuccess: (user) => {
      queryClient.setQueryData([QUERY_KEY_AUTH, QUERY_KEY_USER], user)
      localStorage.setItem('user', JSON.stringify(user))
    },
  })
}

/**
 * Register mutation
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<ApiResponse<User>>(
        apiEndPoints.REGISTER,
        payload
      )
      return data.data
    },
  })
}

/**
 * Logout mutation
 */
export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.post(apiEndPoints.LOGOUT)
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [QUERY_KEY_AUTH] })
      localStorage.removeItem('user')
      window.location.href = '/login'
    },
  })
}
