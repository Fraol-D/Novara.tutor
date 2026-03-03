import { FormEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { useAuth } from '../state/AuthContext'
import type { UserRole } from '../types'

type AuthMode = 'login' | 'register'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSession, isAuthenticated, role } = useAuth()

  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      const dest = role === 'tutor' ? '/app/tutor' : '/app'
      navigate(dest, { replace: true })
    }
  }, [isAuthenticated, role, navigate])

  const redirectPath = (location.state as { from?: string } | null)?.from ?? (selectedRole === 'tutor' ? '/app/tutor' : '/app')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response =
        mode === 'login'
          ? await authApi.login({ email, password })
          : await authApi.register({ fullName, email, password, role: selectedRole })

      const userRole: UserRole = response.user.role ?? (mode === 'register' ? selectedRole : 'admin')

      setSession({
        token: response.accessToken,
        user: { id: response.user.id, email: response.user.email, fullName: response.user.fullName, role: userRole },
      })
      navigate(userRole === 'tutor' ? '/app/tutor' : redirectPath, { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : mode === 'login' ? 'Login failed' : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 dark:from-background-dark dark:to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          {/* Logo + brand */}
          <div className="mb-6 text-center">
            <span className="inline-block rounded-xl bg-primary/10 px-3 py-1 text-sm font-medium text-primary">TutorFlow</span>
            <h1 className="mt-3 text-2xl font-semibold">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {mode === 'login' ? 'Sign in to continue to your dashboard.' : 'Join TutorFlow to get started.'}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="mb-6 flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null) }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${mode === 'login' ? 'bg-white dark:bg-gray-700 shadow-sm text-text dark:text-text-dark' : 'text-gray-500 hover:text-text dark:hover:text-text-dark'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null) }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${mode === 'register' ? 'bg-white dark:bg-gray-700 shadow-sm text-text dark:text-text-dark' : 'text-gray-500 hover:text-text dark:hover:text-text-dark'}`}
            >
              Register
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="Your full name"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
              <input
                required
                type="email"
                placeholder="you@example.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role selection (both login & register) */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`role-card ${selectedRole === 'admin' ? 'role-card-active' : ''}`}
                >
                  <span className="text-xl mb-1">🏫</span>
                  <span className="text-sm font-medium">Admin / Manager</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Manage students & sessions</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('tutor')}
                  className={`role-card ${selectedRole === 'tutor' ? 'role-card-active' : ''}`}
                >
                  <span className="text-xl mb-1">🎓</span>
                  <span className="text-sm font-medium">Tutor</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Manage your schedule</span>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {error ? (
            <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
