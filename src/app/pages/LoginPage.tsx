import { FormEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { useAuth } from '../state/AuthContext'

type AuthMode = 'login' | 'register'

type LoginPageProps = {
  initialMode?: AuthMode
}

export default function LoginPage({ initialMode = 'login' }: LoginPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSession, isAuthenticated, role, setupCompleted } = useAuth()

  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toFrontendRole = (backendRole: 'PARENT' | 'TUTOR' | null): 'parent' | 'tutor' | null => {
    if (backendRole === 'PARENT') return 'parent'
    if (backendRole === 'TUTOR') return 'tutor'
    return null
  }

  useEffect(() => {
    if (isAuthenticated) {
      if (!setupCompleted) {
        navigate('/setup', { replace: true })
        return
      }
      const dest = role === 'tutor' ? '/app/tutor/onboarding' : '/app/parent'
      navigate(dest, { replace: true })
    }
  }, [isAuthenticated, role, setupCompleted, navigate])

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  const redirectPath = (location.state as { from?: string } | null)?.from ?? '/setup'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response =
        mode === 'login'
          ? await authApi.login({ email, password })
          : await authApi.register({ firstName, lastName, email, password })

      const userRole = toFrontendRole(response.user.role)

      setSession({
        token: response.accessToken,
        user: {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          fullName: response.user.fullName,
          role: userRole,
          setupCompleted: response.user.setupCompleted,
          setupStep: response.user.setupStep,
          country: response.user.country,
          state: response.user.state,
          phone: response.user.phone,
          profilePictureUrl: response.user.profilePictureUrl,
        },
      })
      if (!response.user.setupCompleted) {
        navigate('/setup', { replace: true })
        return
      }
      navigate(userRole === 'tutor' ? '/app/tutor/onboarding' : redirectPath, { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : mode === 'login' ? 'Login failed' : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="manuscript-surface min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <aside className="surface-card hidden lg:block !p-10">
          <p className="eyebrow">Tutor Portal</p>
          <h2 className="mt-6 text-5xl font-semibold leading-[1.05]">A calmer interface for serious learning outcomes.</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[color:var(--on-surface-soft)]">
            Structured onboarding, weekly progress intelligence, and parent-tutor collaboration in one architectural workspace.
          </p>
          <div className="mt-10 space-y-3 text-sm text-[color:var(--on-surface-soft)]">
            <p>• Intentional workflow for parents and tutors</p>
            <p>• Surface-layered UI that reduces visual noise</p>
            <p>• Role-aware dashboards from the first login</p>
          </div>
        </aside>

        <div className="glass-card p-8 md:p-10">
          <div className="mb-6 text-center">
            <span className="eyebrow">Novara Tutor Studio</span>
            <h1 className="mt-4 text-3xl font-semibold">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-2 text-sm text-[color:var(--on-surface-soft)]">
              {mode === 'login' ? 'Sign in to continue to your dashboard.' : 'Join TutorFlow to get started.'}
            </p>
          </div>

          <div className="mb-6 flex rounded-2xl p-1.5 surface-tier-low">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null) }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${mode === 'login' ? 'surface-tier-lowest shadow-sm' : 'text-[color:var(--on-surface-soft)]'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null) }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${mode === 'register' ? 'surface-tier-lowest shadow-sm' : 'text-[color:var(--on-surface-soft)]'}`}
            >
              Register
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">First Name</label>
                    <input
                      required
                      type="text"
                      placeholder="First name"
                      className="form-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Last Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Last name"
                      className="form-input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Email</label>
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
              <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {error ? (
            <div className="mt-4 rounded-2xl px-4 py-3" style={{ background: 'color-mix(in srgb, #f44d4d 10%, var(--surface-lowest))' }}>
              <p className="text-sm" style={{ color: '#c73636' }}>{error}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
