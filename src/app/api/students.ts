import { apiRequest } from './client'
import type { CreateStudentPayload, Student } from '../types'

export const studentsApi = {
  list: (token: string) => apiRequest<Student[]>('/students', { token }),
  create: (token: string, payload: CreateStudentPayload) =>
    apiRequest<Student>('/students', { method: 'POST', token, body: payload }),
  update: (token: string, id: string, payload: CreateStudentPayload) =>
    apiRequest<Student>(`/students/${id}`, { method: 'PUT', token, body: payload }),
}
