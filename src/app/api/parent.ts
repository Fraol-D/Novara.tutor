import { apiRequest } from './client'
import type {
  AcademicGpsResponse,
  AssessmentReport,
  CreateChildPayload,
  ParentChild,
  ParentDashboard,
  ReportType,
} from '../types'

export const parentApi = {
  dashboard: (token: string) => apiRequest<ParentDashboard>('/parent/dashboard', { token }),
  listChildren: (token: string) => apiRequest<ParentChild[]>('/parent/children', { token }),
  createChild: (token: string, payload: CreateChildPayload) =>
    apiRequest<ParentChild>('/parent/children', { method: 'POST', token, body: payload }),
  updateChild: (token: string, childId: string, payload: Partial<CreateChildPayload>) =>
    apiRequest<ParentChild>(`/parent/children/${childId}`, { method: 'PUT', token, body: payload }),
  replaceTimeSlots: (
    token: string,
    childId: string,
    payload: { slots: CreateChildPayload['timeSlots'] }
  ) => apiRequest<ParentChild>(`/parent/children/${childId}/time-slots`, { method: 'PUT', token, body: payload }),
  getAcademicGps: (token: string, params: { childId?: string; subject?: string }) => {
    const query = new URLSearchParams()
    if (params.childId) query.set('childId', params.childId)
    if (params.subject) query.set('subject', params.subject)
    const suffix = query.toString() ? `?${query.toString()}` : ''
    return apiRequest<AcademicGpsResponse>(`/parent/academic-gps${suffix}`, { token })
  },
  getAssessmentReports: (
    token: string,
    params: { childId?: string; subject?: string; type?: ReportType }
  ) => {
    const query = new URLSearchParams()
    if (params.childId) query.set('childId', params.childId)
    if (params.subject) query.set('subject', params.subject)
    if (params.type) query.set('type', params.type)
    const suffix = query.toString() ? `?${query.toString()}` : ''
    return apiRequest<AssessmentReport[]>(`/parent/assessment-reports${suffix}`, { token })
  },
}
