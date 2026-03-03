import { FormEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { useAuth } from '../state/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSession, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const redirectPath = (location.state as { from?: string } | null)?.from ?? '/app'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authApi.login({ email, password })
      setSession({ token: response.accessToken, user: response.user })
      navigate(redirectPath, { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 dark:from-background-dark dark:to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-primary/20 bg-white dark:bg-gray-900 p-7 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <p className="text-sm text-primary font-medium">TutorFlow</p>
        <h1 className="mt-2 text-2xl font-semibold">Login to your dashboard</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Use your account credentials to continue.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-primary/25 px-3 py-2.5 bg-transparent"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-primary/25 px-3 py-2.5 bg-transparent"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}
      </div>
    </div>
  )
}
