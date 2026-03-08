import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

const parentNavItems = [
  { label: 'Dashboard', to: '/app/parent', icon: '📊' },
  { label: 'Add Child', to: '/app/parent/add-child', icon: '👶' },
  { label: 'Academic GPS', to: '/app/parent/academic-gps', icon: '🧭' },
  { label: 'Reports', to: '/app/parent/reports', icon: '📘' },
]

const tutorNavItems = [
  { label: 'Onboarding', to: '/app/tutor/onboarding', icon: '📝' },
]

export default function AppShell() {
  const { user, role, clearSession } = useAuth()
  const navigate = useNavigate()
  const navItems = role === 'tutor' ? tutorNavItems : parentNavItems
  const roleLabel = role === 'tutor' ? 'Tutor Portal' : 'Parent Dashboard'
  const roleBadge = role === 'tutor' ? 'Tutor' : 'Parent'

  const handleLogout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark flex">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex md:flex-col" style={{ background: 'linear-gradient(180deg, #0d1b2e 0%, #111c2e 100%)' }}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-sm font-bold">TF</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">TutorFlow</p>
              <p className="text-white/50 text-[10px]">{roleLabel}</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="p-3 flex-1 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app/parent' || item.to === '/app/tutor/onboarding'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? 'bg-primary/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.fullName ?? 'User'}</p>
              <span className="inline-flex rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary/90 font-medium">{roleBadge}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 w-full rounded-lg bg-white/8 hover:bg-white/15 px-3 py-2 text-sm text-white/70 hover:text-white transition-all text-left flex items-center gap-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-14 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{roleLabel}</p>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">{user?.fullName}</span>
            <Link to="/" className="btn-secondary !px-3 !py-1.5 !text-xs">
              ← Home
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
