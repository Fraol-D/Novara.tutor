import StatCard from '../components/StatCard'
import { useAuth } from '../state/AuthContext'

export default function TutorDashboardPage() {
  const { user } = useAuth()

  const upcomingSessions = [
    { id: '1', student: 'Aisha Bekele', subject: 'Mathematics', date: 'Today, 3:00 PM', status: 'upcoming' },
    { id: '2', student: 'Samuel Girma', subject: 'Physics', date: 'Today, 5:00 PM', status: 'upcoming' },
    { id: '3', student: 'Hana Tadesse', subject: 'Chemistry', date: 'Tomorrow, 10:00 AM', status: 'scheduled' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.fullName?.split(' ')[0] ?? 'Tutor'} 👋</h1>
        <p className="mt-1 text-[color:var(--on-surface-soft)]">Here&apos;s what&apos;s happening today.</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Today's Sessions" value={2} icon="📅" accent="teal" />
        <StatCard title="This Week" value={8} icon="📈" accent="blue" />
        <StatCard title="Students Taught" value={12} icon="👩‍🎓" accent="amber" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="surface-card !p-5">
          <h2 className="mb-4 text-sm uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Upcoming Sessions</h2>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center gap-3 rounded-2xl p-3 surface-tier-low transition-colors">
                <div className="flex-shrink-0 w-9 h-9 rounded-full surface-tier-high flex items-center justify-center text-[color:var(--primary)] font-semibold text-sm">
                  {session.student.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.student}</p>
                  <p className="text-xs text-[color:var(--on-surface-soft)]">{session.subject} · {session.date}</p>
                </div>
                <span className={`flex-shrink-0 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${session.status === 'upcoming' ? 'surface-tier-high text-[color:var(--primary)]' : 'surface-tier-container text-[color:var(--on-surface-soft)]'}`}>
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card !p-5">
          <h2 className="mb-4 text-sm uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Quick Actions</h2>
          <div className="space-y-2">
            <a href="/app/tutor/availability" className="flex items-center gap-3 rounded-2xl px-3 py-2.5 surface-tier-low transition-colors group">
              <span className="text-lg">🗓️</span>
              <div>
                <p className="text-sm font-medium group-hover:text-[color:var(--primary)] transition-colors">Manage Availability</p>
                <p className="text-xs text-[color:var(--on-surface-soft)]">Set your available time slots</p>
              </div>
            </a>
            <a href="/app/tutor/profile" className="flex items-center gap-3 rounded-2xl px-3 py-2.5 surface-tier-low transition-colors group">
              <span className="text-lg">👤</span>
              <div>
                <p className="text-sm font-medium group-hover:text-[color:var(--primary)] transition-colors">Update Profile</p>
                <span className="text-xs text-[color:var(--on-surface-soft)]">Subjects, bio, and contact info</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
