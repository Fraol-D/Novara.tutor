import { FormEvent, useEffect, useState } from 'react'
import { sessionsApi } from '../api/sessions'
import { studentsApi } from '../api/students'
import { useAuth } from '../state/AuthContext'
import type { Session, Student } from '../types'

export default function SessionsPage() {
  const { token } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    studentId: '',
    tutorId: '',
    subject: '',
    date: '',
    attended: false,
  })

  useEffect(() => {
    if (!token) return

    setLoading(true)
    Promise.all([sessionsApi.list(token), studentsApi.list(token)])
      .then(([sessionItems, studentItems]) => {
        setSessions(sessionItems)
        setStudents(studentItems)
        if (studentItems.length > 0) {
          setForm((prev) => ({ ...prev, studentId: prev.studentId || studentItems[0].id }))
        }
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Could not load data'))
      .finally(() => setLoading(false))
  }, [token])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    try {
      const created = await sessionsApi.create(token, {
        ...form,
        tutorId: form.tutorId || undefined,
      })
      setSessions((prev) => [created, ...prev])
      setForm((prev) => ({ ...prev, subject: '', date: '', attended: false }))
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not create session')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track lessons and attendance.</p>
      </div>

      <section className="rounded-xl border border-primary/15 bg-white dark:bg-gray-900 p-4">
        <h2 className="font-semibold mb-3">Create Session</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
          <select
            className="rounded-lg border border-primary/25 px-3 py-2"
            value={form.studentId}
            onChange={(event) => setForm((prev) => ({ ...prev, studentId: event.target.value }))}
            required
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName}
              </option>
            ))}
          </select>
          <input
            className="rounded-lg border border-primary/25 px-3 py-2"
            placeholder="Tutor ID (optional)"
            value={form.tutorId}
            onChange={(event) => setForm((prev) => ({ ...prev, tutorId: event.target.value }))}
          />
          <input
            required
            className="rounded-lg border border-primary/25 px-3 py-2"
            placeholder="Subject"
            value={form.subject}
            onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
          />
          <input
            required
            type="datetime-local"
            className="rounded-lg border border-primary/25 px-3 py-2"
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
          />
          <label className="md:col-span-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.attended}
              onChange={(event) => setForm((prev) => ({ ...prev, attended: event.target.checked }))}
            />
            Mark as attended
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="btn-primary">
              Save Session
            </button>
          </div>
        </form>
      </section>

      {loading ? <p className="text-gray-500">Loading sessions...</p> : null}
      {error ? <p className="text-sm text-accent">{error}</p> : null}

      {!loading && sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-primary/30 p-8 text-center text-gray-500">
          No sessions yet.
        </div>
      ) : (
        <div className="rounded-xl border border-primary/15 overflow-hidden bg-white dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead className="bg-primary/5 text-left">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3">{session.student?.fullName ?? session.studentId}</td>
                  <td className="px-4 py-3">{session.subject}</td>
                  <td className="px-4 py-3">{new Date(session.date).toLocaleString()}</td>
                  <td className="px-4 py-3">{session.attended ? 'Attended' : 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
