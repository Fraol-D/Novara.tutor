import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { parentApi } from '../api/parent'
import type { ParentDashboard } from '../types'
import { useAuth } from '../state/AuthContext'
import { ApiRequestError } from '../api/client'
import { authApi } from '../api/auth'

export default function ParentDashboardPage() {
  const navigate = useNavigate()
  const { token, patchUser, clearSession } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ParentDashboard | null>(null)

  const toFrontendRole = (backendRole: 'PARENT' | 'TUTOR' | null): 'parent' | 'tutor' | null => {
    if (backendRole === 'PARENT') return 'parent'
    if (backendRole === 'TUTOR') return 'tutor'
    return null
  }

  useEffect(() => {
    if (!token) return

    parentApi
      .dashboard(token)
      .then(setData)
      .catch(async (requestError) => {
        if (requestError instanceof ApiRequestError && requestError.status === 403) {
          try {
            const profile = await authApi.me(token)
            const role = toFrontendRole(profile.role)

            patchUser({
              role,
              setupCompleted: profile.setupCompleted,
              setupStep: profile.setupStep,
              country: profile.country,
              state: profile.state,
              phone: profile.phone,
              profilePictureUrl: profile.profilePictureUrl,
            })

            if (!profile.setupCompleted) {
              navigate('/setup', { replace: true })
              return
            }

            navigate(role === 'tutor' ? '/app/tutor/onboarding' : '/app/parent', { replace: true })
            return
          } catch (profileError) {
            if (profileError instanceof ApiRequestError && profileError.status === 401) {
              clearSession()
              navigate('/login', { replace: true })
              return
            }
          }
        }

        setError(requestError instanceof Error ? requestError.message : 'Could not load dashboard')
      })
      .finally(() => setLoading(false))
  }, [token, patchUser, clearSession, navigate])

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="surface-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Children</h1>
            <p className="mt-1 text-sm text-[color:var(--on-surface-soft)]">Manage your children and upcoming sessions.</p>
          </div>
          <Link to="/app/parent/add-child" className="btn-primary">
            + Add Child
          </Link>
        </div>

        {loading ? <p className="mt-4 text-sm text-[color:var(--on-surface-soft)]">Loading children...</p> : null}
        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

        {!loading && !error ? (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data?.children ?? []).length === 0 ? (
              <div className="surface-tier-low rounded-2xl p-6 text-sm text-[color:var(--on-surface-soft)]">
                No child added yet.
              </div>
            ) : (
              data?.children.map((child) => (
                <article key={child.id} className="surface-tier-lowest rounded-2xl p-4">
                  <h2 className="text-lg font-semibold">{child.firstName} {child.lastName}</h2>
                  <p className="text-sm mt-1 text-[color:var(--on-surface-soft)]">Grade: {child.grade ?? 'Not set'}</p>
                  <p className="text-sm text-[color:var(--on-surface-soft)]">Package: {child.packagePlan ?? 'Not selected'}</p>
                  <p className="text-sm text-[color:var(--on-surface-soft)]">Time slots: {child.timeSlots.length}</p>
                </article>
              ))
            )}
          </div>
        ) : null}
      </section>

      <section className="surface-card">
        <h2 className="text-xl font-semibold">Sessions</h2>
        <div className="mt-4 rounded-2xl surface-tier-low px-4 py-3 text-[color:var(--on-surface-soft)]">
          No upcoming sessions available yet.
        </div>
      </section>
    </div>
  )
}
