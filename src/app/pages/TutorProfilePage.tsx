import { FormEvent, useState } from 'react'
import { useAuth } from '../state/AuthContext'

const PROFILE_KEY = 'tutorflow_tutor_profile'

type TutorProfile = {
  fullName: string
  primarySubject: string
  secondarySubjects: string
  bio: string
  phone: string
  yearsExperience: string
  education: string
  hourlyRate: string
}

function loadProfile(user: { fullName: string } | null): TutorProfile {
  const raw = localStorage.getItem(PROFILE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as TutorProfile
    } catch {
      /* ignore */
    }
  }
  return {
    fullName: user?.fullName ?? '',
    primarySubject: '',
    secondarySubjects: '',
    bio: '',
    phone: '',
    yearsExperience: '',
    education: '',
    hourlyRate: '',
  }
}

export default function TutorProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState<TutorProfile>(() => loadProfile(user))
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    localStorage.setItem(PROFILE_KEY, JSON.stringify(form))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const field = (label: string, key: keyof TutorProfile, type = 'text', placeholder = '') => (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">{label}</label>
      <input
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
      />
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-1 text-[color:var(--on-surface-soft)]">Keep your profile up to date so students can find you.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="surface-card space-y-4">
          <h2 className="text-sm uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Personal Info</h2>
          {field('Full Name', 'fullName', 'text', 'Your full name')}
          {field('Phone Number', 'phone', 'tel', '+251 9XX XXX XXXX')}
          {field('Education', 'education', 'text', 'e.g. BSc Mathematics, AAU')}
          {field('Years of Experience', 'yearsExperience', 'number', '0')}
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Bio</label>
            <textarea
              rows={4}
              className="form-input resize-none"
              placeholder="Tell students about your teaching style, experience, and approach…"
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card space-y-4">
            <h2 className="text-sm uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">Teaching Details</h2>
            {field('Primary Subject', 'primarySubject', 'text', 'e.g. Mathematics')}
            {field('Secondary Subjects', 'secondarySubjects', 'text', 'e.g. Physics, Chemistry')}
            {field('Hourly Rate (ETB)', 'hourlyRate', 'number', '0')}
          </div>

          <div className="flex justify-end gap-3">
            {saved && (
              <div className="flex items-center gap-2 rounded-2xl surface-tier-low px-4 py-2">
                <span className="text-emerald-700 text-sm font-medium">✓ Profile saved</span>
              </div>
            )}
            <button type="submit" className="btn-primary">
              Save Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
