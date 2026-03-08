export type UserRole = 'parent' | 'tutor'

export type ProficiencyLevel = 'NATIVE' | 'FLUENT' | 'COMFORTABLE'
export type EducationType = 'HIGH_SCHOOL' | 'COLLEGE' | 'OTHER_CERTIFICATION'
export type ExperienceType = 'TEACHING' | 'WORK'
export type Weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
export type PackagePlan = 'GROW' | 'THRIVE' | 'EXCEL'
export type ReportType = 'MASTERY' | 'PREREQUISITE'

export type AuthResponse = {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    fullName: string
    role: 'PARENT' | 'TUTOR' | null
    setupStep: number
    setupCompleted: boolean
    country?: string | null
    state?: string | null
    phone?: string | null
    profilePictureUrl?: string | null
  }
  accessToken: string
}

export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  role: UserRole | null
  setupStep: number
  setupCompleted: boolean
  country?: string | null
  state?: string | null
  phone?: string | null
  profilePictureUrl?: string | null
}

export type SetupStatus = {
  firstName: string
  lastName: string
  email: string
  role: 'PARENT' | 'TUTOR' | null
  country?: string | null
  state?: string | null
  phone?: string | null
  profilePictureUrl?: string | null
  setupStep: number
  setupCompleted: boolean
}

export type TutorLanguageSkill = {
  id: string
  language: string
  proficiency: ProficiencyLevel
  demoVideo?: {
    id: string
    url: string
  } | null
}

export type TutorEducationEntry = {
  id: string
  type: EducationType
  institutionName: string
  studyArea?: string | null
  startDate?: string | null
  endDate?: string | null
  completedYear?: number | null
  graduated: boolean
  transcriptUrl?: string | null
  certificateUrl?: string | null
}

export type TutorExperienceEntry = {
  id: string
  type: ExperienceType
  organizationName: string
  title: string
  description?: string | null
  startDate?: string | null
  endDate?: string | null
  currentlyWorking: boolean
}

export type TutorAvailabilityEntry = {
  id: string
  day: Weekday
  startTime: string
  endTime: string
  timezone: string
  totalHours?: string | null
}

export type TutorDemoVideo = {
  id: string
  languageSkillId: string
  url: string
}

export type TutorApplication = {
  id: string
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  currentStep: number
  submittedAt?: string | null
  languageSkills: TutorLanguageSkill[]
  educationEntries: TutorEducationEntry[]
  experienceEntries: TutorExperienceEntry[]
  availabilitySlots: TutorAvailabilityEntry[]
  languageDemoVideos: TutorDemoVideo[]
}

export type ChildTimeSlot = {
  id: string
  day: Weekday
  startTime: string
  endTime: string
  timezone: string
}

export type ParentChild = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth?: string | null
  grade?: string | null
  country?: string | null
  state?: string | null
  schoolInUsa?: boolean | null
  packagePlan?: PackagePlan | null
  profilePictureUrl?: string | null
  notes?: string | null
  timeSlots: ChildTimeSlot[]
}

export type AssessmentReport = {
  id: string
  type: ReportType
  subject: string
  title: string
  summary: string
  score?: number | null
  publishedAt: string
  child: {
    id: string
    firstName: string
    lastName: string
  }
}

export type ParentDashboard = {
  parent: {
    id: string
    fullName: string
    email: string
  }
  children: ParentChild[]
}

export type AcademicGpsResponse = {
  child: ParentChild | null
  customSyllabus: Array<{ id: string; subject: string; content: unknown }>
  academicRoadmap: Array<{ id: string; subject: string; content: unknown }>
  message?: string
}

export type CreateChildPayload = {
  firstName: string
  lastName: string
  dateOfBirth?: string
  grade?: string
  country?: string
  state?: string
  schoolInUsa?: boolean
  packagePlan?: PackagePlan
  profilePictureUrl?: string
  notes?: string
  timeSlots: Array<{
    day: Weekday
    startTime: string
    endTime: string
    timezone?: string
  }>
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
