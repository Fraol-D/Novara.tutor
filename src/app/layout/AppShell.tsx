import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

const navItems = [
  { label: 'Overview', to: '/app' },
  { label: 'Students', to: '/app/students' },
  { label: 'Sessions', to: '/app/sessions' },
  { label: 'Payments', to: '/app/payments' },
]

export default function AppShell() {
  const { user, clearSession } = useAuth()

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark flex">
      <aside className="w-64 bg-sidebar text-white hidden md:flex md:flex-col border-r border-white/10">
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-xl font-semibold">TutorFlow</p>
          <p className="text-xs text-white/70 mt-1">Tutoring Operations</p>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-primary text-white' : 'text-white/80 hover:bg-white/10'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={clearSession}
            className="w-full rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 sm:px-6">
          <p className="font-medium">Dashboard</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">{user?.fullName}</span>
            <Link to="/" className="btn-secondary !px-3 !py-2">
              Home
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
