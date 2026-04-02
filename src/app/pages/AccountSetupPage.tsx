import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiRequestError } from '../api/client'
import { accountApi } from '../api/account'
import { useAuth } from '../state/AuthContext'

type SetupStep = 1 | 2 | 3

export default function AccountSetupPage() {
  const navigate = useNavigate()
  const { token, user, patchUser, setupCompleted, clearSession } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [country, setCountry] = useState('')
  const [stateName, setStateName] = useState('')
  const [phone, setPhone] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [accountType, setAccountType] = useState<'PARENT' | 'TUTOR'>('PARENT')
  const [currentStep, setCurrentStep] = useState<SetupStep>(1)

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    accountApi
      .getSetupStatus(token)
      .then((status) => {
        setCountry(status.country ?? '')
        setStateName(status.state ?? '')
        setPhone(status.phone ?? '')
        setProfilePictureUrl(status.profilePictureUrl ?? '')
        if (status.role === 'TUTOR') {
          setAccountType('TUTOR')
        }
        setCurrentStep(Math.min(3, Math.max(1, status.setupStep)) as SetupStep)
        if (status.setupCompleted) {
          const role = status.role === 'TUTOR' ? 'tutor' : 'parent'
          navigate(role === 'tutor' ? '/app/tutor/onboarding' : '/app/parent', { replace: true })
        }
      })
      .catch((requestError) => {
        if (requestError instanceof ApiRequestError && requestError.status === 401) {
          clearSession()
          navigate('/login', { replace: true })
          return
        }
        setError(requestError instanceof Error ? requestError.message : 'Could not load setup status')
      })
      .finally(() => setLoading(false))
  }, [navigate, token])

  useEffect(() => {
    if (!setupCompleted) {
      return
    }

    if (user?.role === 'tutor') {
      navigate('/app/tutor/onboarding', { replace: true })
      return
    }

    if (user?.role === 'parent') {
      navigate('/app/parent', { replace: true })
    }
  }, [setupCompleted, navigate, user?.role])

  const stepTitle = useMemo(() => {
    if (currentStep === 1) return 'Step 1: Location & Contact'
    if (currentStep === 2) return 'Step 2: Profile Picture (Optional)'
    return 'Step 3: Select Account Type'
  }, [currentStep])

  const submitLocation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    setSaving(true)
    setError(null)

    try {
      await accountApi.saveLocation(token, { country, state: stateName || undefined, phone })
      patchUser({ country, state: stateName || null, phone, setupStep: 2 })
      setCurrentStep(2)
    } catch (submitError) {
      if (submitError instanceof ApiRequestError && submitError.status === 401) {
        clearSession()
        navigate('/login', { replace: true })
        return
      }
      setError(submitError instanceof Error ? submitError.message : 'Could not save location and contact')
    } finally {
      setSaving(false)
    }
  }

  const submitPhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    setSaving(true)
    setError(null)

    try {
      await accountApi.saveProfilePicture(token, { profilePictureUrl: profilePictureUrl || undefined })
      patchUser({ profilePictureUrl: profilePictureUrl || null, setupStep: 3 })
      setCurrentStep(3)
    } catch (submitError) {
      if (submitError instanceof ApiRequestError && submitError.status === 401) {
        clearSession()
        navigate('/login', { replace: true })
        return
      }
      setError(submitError instanceof Error ? submitError.message : 'Could not save profile picture')
    } finally {
      setSaving(false)
    }
  }

  const submitRole = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    setSaving(true)
    setError(null)

    try {
      await accountApi.saveRole(token, { role: accountType })
      const nextRole = accountType === 'TUTOR' ? 'tutor' : 'parent'
      patchUser({ role: nextRole, setupCompleted: true, setupStep: 3 })
      navigate(nextRole === 'tutor' ? '/app/tutor/onboarding' : '/app/parent', { replace: true })
    } catch (submitError) {
      if (submitError instanceof ApiRequestError && submitError.status === 401) {
        clearSession()
        navigate('/login', { replace: true })
        return
      }
      setError(submitError instanceof Error ? submitError.message : 'Could not save account type')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center manuscript-surface">
        <p className="text-sm text-[color:var(--on-surface-soft)]">Loading setup...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen manuscript-surface py-10 px-4">
      <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
        <div className="surface-card">
          <p className="eyebrow">Onboarding</p>
          <h1 className="mt-4 text-3xl font-bold">Set Up Your Account</h1>
          <p className="mt-2 text-[color:var(--on-surface-soft)]">Complete these steps to start using your portal.</p>

          <div className="mt-6 flex items-center gap-3 text-sm">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                    currentStep >= step
                      ? 'bg-[color:var(--primary)] text-white'
                      : 'surface-tier-low text-[color:var(--on-surface-soft)]'
                  }`}
                >
                  {step}
                </span>
                {step < 3 ? <span className="h-px w-8 bg-[color:var(--outline-ghost)]" /> : null}
              </div>
            ))}
          </div>
        </div>

        <section className="surface-card">
          <h2 className="text-xl font-semibold">{stepTitle}</h2>

          {currentStep === 1 ? (
            <form onSubmit={submitLocation} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Select Country</label>
                <input
                  className="form-input"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  placeholder="Ethiopia"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Select State</label>
                <input
                  className="form-input"
                  value={stateName}
                  onChange={(event) => setStateName(event.target.value)}
                  placeholder="Addis Ababa"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Phone Number</label>
                <input
                  className="form-input"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+2519..."
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Continue'}
              </button>
            </form>
          ) : null}

          {currentStep === 2 ? (
            <form onSubmit={submitPhoto} className="mt-5 space-y-4">
              <p className="text-sm text-[color:var(--on-surface-soft)]">This step is optional. You can skip and add a photo later.</p>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Profile Picture URL</label>
                <input
                  className="form-input"
                  value={profilePictureUrl}
                  onChange={(event) => setProfilePictureUrl(event.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save & Continue'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setCurrentStep(3)}>
                  Skip for now
                </button>
              </div>
            </form>
          ) : null}

          {currentStep === 3 ? (
            <form onSubmit={submitRole} className="mt-5 space-y-4">
              <p className="text-sm text-[color:var(--on-surface-soft)]">Which of these best describes you?</p>

              <div className="space-y-3">
                <button
                  type="button"
                  className={`w-full rounded-2xl p-4 text-left transition ${
                    accountType === 'PARENT'
                      ? 'surface-tier-high text-[color:var(--primary)]'
                      : 'surface-tier-lowest'
                  }`}
                  onClick={() => setAccountType('PARENT')}
                >
                  I&apos;m a parent
                </button>

                <button
                  type="button"
                  className={`w-full rounded-2xl p-4 text-left transition ${
                    accountType === 'TUTOR'
                      ? 'surface-tier-high text-[color:var(--primary)]'
                      : 'surface-tier-lowest'
                  }`}
                  onClick={() => setAccountType('TUTOR')}
                >
                  Applying to become a Tutor
                </button>
              </div>

              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Finish Setup'}
              </button>
            </form>
          ) : null}

          {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        </section>
      </div>
    </div>
  )
}
