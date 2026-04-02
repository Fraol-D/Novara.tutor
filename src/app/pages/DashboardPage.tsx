import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { StatCardSkeleton } from '../components/LoadingSkeleton'
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="mt-1 text-[color:var(--on-surface-soft)]">Daily pulse of your tutoring operations.</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard title="Active Students" value={studentCount} icon="👩‍🎓" accent="teal" />
            <StatCard title="Total Sessions" value={sessionCount} icon="📅" accent="blue" />
            <StatCard title="Unpaid Invoices" value={unpaidCount} hint="Needs follow-up" icon="⚠️" accent="amber" />
          </>
        )}
      </section>

      {!loading && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface-card !p-5">
            <h2 className="mb-3 text-sm uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Quick Actions</h2>
            <div className="space-y-2">
              <a href="/app/students" className="flex items-center gap-3 rounded-2xl px-3 py-2.5 surface-tier-low transition-colors group">
                <span className="text-lg">👥</span>
                <div>
                  <p className="text-sm font-medium group-hover:text-[color:var(--primary)] transition-colors">Manage Students</p>
                  <p className="text-xs text-[color:var(--on-surface-soft)]">View and edit student profiles</p>
                </div>
              </a>
              <a href="/app/sessions" className="flex items-center gap-3 rounded-2xl px-3 py-2.5 surface-tier-low transition-colors group">
                <span className="text-lg">🗓️</span>
                <div>
                  <p className="text-sm font-medium group-hover:text-[color:var(--primary)] transition-colors">Schedule Sessions</p>
                  <p className="text-xs text-[color:var(--on-surface-soft)]">Add or review upcoming lessons</p>
                </div>
              </a>
              <a href="/app/payments" className="flex items-center gap-3 rounded-2xl px-3 py-2.5 surface-tier-low transition-colors group">
                <span className="text-lg">💰</span>
                <div>
                  <p className="text-sm font-medium group-hover:text-[color:var(--primary)] transition-colors">Track Payments</p>
                  <p className="text-xs text-[color:var(--on-surface-soft)]">Monitor fees and balances</p>
                </div>
              </a>
            </div>
          </div>

          <div className="surface-card !p-5">
            <h2 className="mb-3 text-sm uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">At a Glance</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[color:var(--on-surface-soft)]">Payment collection rate</span>
                <span className="font-semibold text-[color:var(--primary)]">
                  {sessionCount > 0 ? `${Math.round(((sessionCount - unpaidCount) / (sessionCount || 1)) * 100)}%` : '—'}
                </span>
              </div>
              <div className="h-2 rounded-full surface-tier-low overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    background: 'var(--cta-gradient)',
                    width: sessionCount > 0 ? `${Math.round(((sessionCount - unpaidCount) / (sessionCount || 1)) * 100)}%` : '0%',
                  }}
                />
              </div>
              <p className="text-xs text-[color:var(--on-surface-soft)] mt-1">
                {unpaidCount > 0 ? `${unpaidCount} invoice${unpaidCount !== 1 ? 's' : ''} pending follow-up` : 'All payments are up to date ✓'}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
