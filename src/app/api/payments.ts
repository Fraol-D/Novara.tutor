import { apiRequest } from './client'
import type { CreatePaymentPayload, Payment } from '../types'

export const paymentsApi = {
  list: (token: string) => apiRequest<Payment[]>('/payments', { token }),
  create: (token: string, payload: CreatePaymentPayload) =>
    apiRequest<Payment>('/payments', { method: 'POST', token, body: payload }),
  updateStatus: (token: string, id: string, status: 'paid' | 'unpaid') =>
    apiRequest<Payment>(`/payments/${id}/status`, { method: 'PATCH', token, body: { status } }),
}
