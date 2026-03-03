export type AuthResponse = {
  user: {
    id: string
    email: string
    fullName: string
  }
  accessToken: string
}

export type Student = {
  id: string
  fullName: string
  grade: string
  parentName: string
  parentPhone: string
  subjects: string[]
  monthlyFee: string
  status: 'active' | 'inactive'
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export type CreateStudentPayload = {
  fullName: string
  grade: string
  parentName: string
  parentPhone: string
  subjects: string[]
  monthlyFee: number
  status?: 'active' | 'inactive'
}

export type Session = {
  id: string
  studentId: string
  tutorId?: string | null
  subject: string
  date: string
  attended: boolean
  createdAt: string
  updatedAt: string
  student?: {
    id: string
    fullName: string
  }
}

export type CreateSessionPayload = {
  studentId: string
  tutorId?: string
  subject: string
  date: string
  attended?: boolean
}

export type Payment = {
  id: string
  studentId: string
  month: string
  amount: string
  status: 'paid' | 'unpaid'
  paidAt?: string | null
  createdAt: string
  updatedAt: string
  student?: {
    id: string
    fullName: string
  }
}

export type CreatePaymentPayload = {
  studentId: string
  month: string
  amount: number
  status?: 'paid' | 'unpaid'
}
