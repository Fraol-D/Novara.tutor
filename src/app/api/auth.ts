import { apiRequest } from './client'
import type { AuthResponse, UserRole } from '../types'

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: UserRole
}

export const authApi = {
  login: (payload: LoginPayload) => apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: payload }),
  register: (payload: RegisterPayload) =>
    apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: payload }),
  me: (token: string) => apiRequest<AuthResponse['user']>('/auth/me', { token }),
}
