import { apiRequest } from './client'
import type { SetupStatus } from '../types'

export const accountApi = {
  getSetupStatus: (token: string) => apiRequest<SetupStatus>('/account/setup', { token }),
  saveLocation: (token: string, payload: { country: string; state?: string; phone: string }) =>
    apiRequest<{ setupStep: number }>('/account/setup/location', { method: 'PATCH', token, body: payload }),
  saveProfilePicture: (token: string, payload: { profilePictureUrl?: string }) =>
    apiRequest<{ setupStep: number; profilePictureUrl?: string | null }>('/account/setup/profile-picture', {
      method: 'PATCH',
      token,
      body: payload,
    }),
  saveRole: (token: string, payload: { role: 'PARENT' | 'TUTOR' }) =>
    apiRequest<{ role: 'PARENT' | 'TUTOR'; setupCompleted: boolean; setupStep: number }>('/account/setup/role', {
      method: 'PATCH',
      token,
      body: payload,
    }),
}
