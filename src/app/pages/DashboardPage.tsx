import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { studentsApi } from '../api/students'
import { sessionsApi } from '../api/sessions'
import { paymentsApi } from '../api/payments'
import { useAuth } from '../state/AuthContext'

export default function DashboardPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [studentCount, setStudentCount] = useState(0)
  const [sessionCount, setSessionCount] = useState(0)
  const [unpaidCount, setUnpaidCount] = useState(0)

  useEffect(() => {
    if (!token) return

    setLoading(true)

    Promise.all([studentsApi.list(token), sessionsApi.list(token), paymentsApi.list(token)])
      .then(([students, sessions, payments]) => {
        setStudentCount(students.length)
        setSessionCount(sessions.length)
        setUnpaidCount(payments.filter((payment) => payment.status === 'unpaid').length)
      })
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return <p className="text-gray-500">Loading dashboard metrics...</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Daily pulse of your tutoring operations.</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Active Students" value={studentCount} />
        <StatCard title="Total Sessions" value={sessionCount} />
        <StatCard title="Unpaid Invoices" value={unpaidCount} hint="Needs follow-up" />
      </section>
    </div>
  )
}
