import { apiRequest } from './client'
import type { CreateSessionPayload, Session } from '../types'

export const sessionsApi = {
  list: (token: string) => apiRequest<Session[]>('/sessions', { token }),
  create: (token: string, payload: CreateSessionPayload) =>
    apiRequest<Session>('/sessions', { method: 'POST', token, body: payload }),
}
