import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

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
  const { theme } = useTheme()
  const navigate = useNavigate()
  const navItems = role === 'tutor' ? tutorNavItems : parentNavItems
  const roleLabel = role === 'tutor' ? 'Tutor Portal' : 'Parent Dashboard'
  const roleBadge = role === 'tutor' ? 'Tutor' : 'Parent'
  const brandIconSrc = theme === 'dark' ? '/getdodos-icon-dark.png' : '/getdodos-icon-light.png'

  const handleLogout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="manuscript-surface flex min-h-screen">
      <aside className="hidden w-72 md:flex md:flex-col surface-tier-container">
        <div className="px-6 pb-4 pt-7">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={brandIconSrc}
              alt="Getdodos Logo"
              className="h-9 w-9"
            />
            <div>
              <p className="text-sm font-semibold leading-tight [font-family:var(--font-display)]">Getdodos</p>
              <p className="text-[10px] text-[color:var(--on-surface-soft)] uppercase tracking-[0.12em]">{roleLabel}</p>
            </div>
          </Link>
        </div>

        <nav className="px-4 py-2 flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app/parent' || item.to === '/app/tutor/onboarding'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${
                  isActive
                    ? 'bg-[color:var(--surface-high)] text-[color:var(--primary)]'
                    : 'text-[color:var(--on-surface-soft)] hover:text-[color:var(--on-surface)] hover:bg-[color:var(--surface-lowest)]'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4">
          <div className="surface-card !p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[color:var(--surface-high)] flex items-center justify-center flex-shrink-0">
              <span className="text-[color:var(--primary)] text-xs font-semibold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.fullName ?? 'User'}</p>
              <span className="inline-flex rounded-full bg-[color:var(--surface-high)] px-2 py-0.5 text-[10px] text-[color:var(--primary)] font-medium">{roleBadge}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full rounded-2xl bg-[color:var(--surface-lowest)] hover:bg-[color:var(--surface-high)] px-4 py-3 text-sm text-[color:var(--on-surface-soft)] hover:text-[color:var(--on-surface)] transition-all text-left flex items-center gap-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 p-3 sm:p-4">
          <div className="glass-card h-14 flex items-center justify-between px-4 sm:px-6">
            <p className="font-semibold text-sm [font-family:var(--font-display)]">{roleLabel}</p>
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-[color:var(--on-surface-soft)]">{user?.fullName}</span>
              <Link to="/" className="btn-secondary !px-4 !py-2 !text-xs">
                Back Home
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 pb-10 pt-3 sm:px-6 lg:px-8 flex-1">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
