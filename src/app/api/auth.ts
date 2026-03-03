import { apiRequest } from './client'
import type { AuthResponse } from '../types'

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  fullName: string
  email: string
  password: string
}

export const authApi = {
  login: (payload: LoginPayload) => apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: payload }),
  register: (payload: RegisterPayload) =>
    apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: payload }),
}
