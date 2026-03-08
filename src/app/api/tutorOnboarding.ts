import { apiRequest } from './client'
import type {
  ProficiencyLevel,
  TutorApplication,
  Weekday,
} from '../types'

export const tutorOnboardingApi = {
  get: (token: string) => apiRequest<TutorApplication>('/tutor-onboarding', { token }),
  saveLanguages: (token: string, languages: Array<{ language: string; proficiency: ProficiencyLevel }>) =>
    apiRequest<TutorApplication>('/tutor-onboarding/languages', {
      method: 'PUT',
      token,
      body: { languages },
    }),
  saveEducation: (
    token: string,
    entries: Array<{
      type: 'HIGH_SCHOOL' | 'COLLEGE' | 'OTHER_CERTIFICATION'
      institutionName: string
      studyArea?: string
      startDate?: string
      endDate?: string
      completedYear?: number
      graduated?: boolean
      transcriptUrl?: string
      certificateUrl?: string
    }>
  ) =>
    apiRequest<TutorApplication>('/tutor-onboarding/education', {
      method: 'PUT',
      token,
      body: { entries },
    }),
  saveExperience: (
    token: string,
    entries: Array<{
      type: 'TEACHING' | 'WORK'
      organizationName: string
      title: string
      description?: string
      startDate?: string
      endDate?: string
      currentlyWorking?: boolean
    }>
  ) =>
    apiRequest<TutorApplication>('/tutor-onboarding/experience', {
      method: 'PUT',
      token,
      body: { entries },
    }),
  saveAvailability: (
    token: string,
    slots: Array<{
      day: Weekday
      startTime: string
      endTime: string
      timezone?: string
      totalHours?: number
    }>
  ) =>
    apiRequest<TutorApplication>('/tutor-onboarding/availability', {
      method: 'PUT',
      token,
      body: { slots },
    }),
  saveVideos: (token: string, videos: Array<{ language: string; url: string }>) =>
    apiRequest<TutorApplication>('/tutor-onboarding/videos', {
      method: 'PUT',
      token,
      body: { videos },
    }),
  submit: (token: string) =>
    apiRequest<TutorApplication>('/tutor-onboarding/submit', { method: 'POST', token }),
}
