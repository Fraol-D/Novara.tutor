import { FormEvent, useEffect, useMemo, useState } from 'react'
import { authApi } from './api/auth'
import { studentsApi } from './api/students'
import type { Student } from './types'

const TOKEN_KEY = 'tutorflow_access_token'

export default function DashboardApp() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const [students, setStudents] = useState<Student[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [studentForm, setStudentForm] = useState({
    fullName: '',
    grade: '',
    parentName: '',
    parentPhone: '',
    subjects: '',
    monthlyFee: '',
    status: 'active' as 'active' | 'inactive',
  })

  const studentCountText = useMemo(() => {
    if (loadingStudents) return 'Loading students...'
    return `${students.length} students loaded`
  }, [loadingStudents, students.length])

  useEffect(() => {
    if (!token) {
      setStudents([])
      return
    }

    setLoadingStudents(true)
    setErrorMessage(null)

    studentsApi
      .list(token)
      .then((data) => setStudents(data))
      .catch((error: Error) => {
        setErrorMessage(error.message)
        if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('expired')) {
          handleLogout()
        }
      })
      .finally(() => setLoadingStudents(false))
  }, [token])

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthLoading(true)
    setErrorMessage(null)

    try {
      const response =
        authMode === 'login'
          ? await authApi.login({ email, password })
          : await authApi.register({ fullName, email, password })

      localStorage.setItem(TOKEN_KEY, response.accessToken)
      setToken(response.accessToken)
      setPassword('')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleCreateStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) {
      setErrorMessage('Please log in first.')
      return
    }

    setSaveLoading(true)
    setErrorMessage(null)

    try {
      const payload = {
        fullName: studentForm.fullName,
        grade: studentForm.grade,
        parentName: studentForm.parentName,
        parentPhone: studentForm.parentPhone,
        subjects: studentForm.subjects
          .split(',')
          .map((subject) => subject.trim())
          .filter(Boolean),
        monthlyFee: Number(studentForm.monthlyFee),
        status: studentForm.status,
      }

      const createdStudent = await studentsApi.create(token, payload)
      setStudents((previous) => [createdStudent, ...previous])
      setStudentForm({
        fullName: '',
        grade: '',
        parentName: '',
        parentPhone: '',
        subjects: '',
        monthlyFee: '',
        status: 'active',
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not create student')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setStudents([])
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark p-6">
        <div className="max-w-md mx-auto rounded-xl border border-primary/20 p-6 bg-white dark:bg-background-dark">
          <h1 className="text-2xl font-semibold mb-2">TutorFlow Dashboard Access</h1>
          <p className="text-sm text-text/70 dark:text-text-dark/70 mb-6">
            Sign in to continue to the app dashboard.
          </p>

          <form className="space-y-3" onSubmit={handleAuthSubmit}>
            {authMode === 'register' && (
              <input
                className="w-full rounded-lg border border-primary/30 px-3 py-2 bg-transparent"
                placeholder="Full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            )}

            <input
              className="w-full rounded-lg border border-primary/30 px-3 py-2 bg-transparent"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <input
              className="w-full rounded-lg border border-primary/30 px-3 py-2 bg-transparent"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-primary text-white px-4 py-2 font-medium"
              disabled={authLoading}
            >
              {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          <button
            type="button"
            className="mt-3 text-sm text-primary hover:underline"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          >
            {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>

          {errorMessage && <p className="mt-4 text-sm text-accent">{errorMessage}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">TutorFlow App Dashboard</h1>
            <p className="text-sm text-text/70 dark:text-text-dark/70">{studentCountText}</p>
          </div>
          <div className="flex gap-3">
            <a href="/" className="rounded-lg border border-primary/30 px-4 py-2">
              Marketing Site
            </a>
            <button className="rounded-lg bg-primary text-white px-4 py-2" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {errorMessage && <p className="text-sm text-accent">{errorMessage}</p>}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-primary/20 p-5 bg-white dark:bg-background-dark">
            <h2 className="text-xl font-semibold mb-4">Create Student</h2>
            <form className="space-y-3" onSubmit={handleCreateStudent}>
              <input
                className="w-full rounded-lg border border-primary/30 px-3 py-2 bg-transparent"
                placeholder="Student full name"
                value={studentForm.fullName}
                onChange={(event) => setStudentForm((prev) => ({ ...prev, fullName: event.target.value }))}
                required
              />
              <input
                className="w-full rounded-lg border border-primary/30 px-3 py-2 bg-transparent"
                placeholder="Grade"
                value={studentForm.grade}
                onChange={(event) => setStudentForm((prev) => ({ ...prev, grade: event.target.value }))}
                required
              />
              <input
                className="w-full rounded-lg border border-primary/30 px-3 py-2 bg-transparent"
                placeholder="Parent name"
                value={studentForm.parentName}
                onChange={(event) => setStudentForm((prev) => ({ ...prev, parentName: event.target.value }))}
                required
              />
              <input
                className="w-full rounded-lg border border-primary/30 px-3 py-2 bg-transparent"
                placeholder="Parent phone"
                value={studentForm.parentPhone}
                onChange={(event) => setStudentForm((prev) => ({ ...prev, parentPhone: event.target.value }))}
                required
              />
              <input
                className="w-full rounded-lg border border-primary/30 px-3 py-2 bg-transparent"
                placeholder="Subjects (comma-separated)"
                value={studentForm.subjects}
                onChange={(event) => setStudentForm((prev) => ({ ...prev, subjects: event.target.value }))}
                required
              />
              <input
                className="w-full rounded-lg border border-primary/30 px-3 py-2 bg-transparent"
                type="number"
                step="0.01"
                min="0"
                placeholder="Monthly fee"
                value={studentForm.monthlyFee}
                onChange={(event) => setStudentForm((prev) => ({ ...prev, monthlyFee: event.target.value }))}
                required
              />
              <select
                className="w-full rounded-lg border border-primary/30 px-3 py-2 bg-transparent"
                value={studentForm.status}
                onChange={(event) =>
                  setStudentForm((prev) => ({ ...prev, status: event.target.value as 'active' | 'inactive' }))
                }
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary text-white px-4 py-2 font-medium"
                disabled={saveLoading}
              >
                {saveLoading ? 'Saving...' : 'Save Student'}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-primary/20 p-5 bg-white dark:bg-background-dark">
            <h2 className="text-xl font-semibold mb-4">Students</h2>
            {loadingStudents ? (
              <p className="text-sm text-text/70 dark:text-text-dark/70">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="text-sm text-text/70 dark:text-text-dark/70">No students yet.</p>
            ) : (
              <ul className="space-y-3 max-h-[500px] overflow-auto pr-1">
                {students.map((student) => (
                  <li key={student.id} className="rounded-lg border border-primary/20 p-3">
                    <p className="font-medium">{student.fullName}</p>
                    <p className="text-sm">Grade: {student.grade}</p>
                    <p className="text-sm">Parent: {student.parentName} ({student.parentPhone})</p>
                    <p className="text-sm">Subjects: {student.subjects.join(', ')}</p>
                    <p className="text-sm">Monthly Fee: {student.monthlyFee}</p>
                    <p className="text-sm">Status: {student.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
