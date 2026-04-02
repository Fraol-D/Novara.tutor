import { useEffect, useMemo, useState } from 'react'
import { tutorOnboardingApi } from '../api/tutorOnboarding'
import type {
  ProficiencyLevel,
  TutorApplication,
  Weekday,
} from '../types'
import { useAuth } from '../state/AuthContext'

const weekdays: Weekday[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

type LanguageFormRow = { language: string; proficiency: ProficiencyLevel }
type EducationFormRow = {
  type: 'HIGH_SCHOOL' | 'COLLEGE' | 'OTHER_CERTIFICATION'
  institutionName: string
  studyArea: string
  startDate: string
  endDate: string
  completedYear: string
  graduated: boolean
  transcriptUrl: string
  certificateUrl: string
}
type ExperienceFormRow = {
  type: 'TEACHING' | 'WORK'
  organizationName: string
  title: string
  description: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
}
type AvailabilityFormRow = {
  day: Weekday
  startTime: string
  endTime: string
  timezone: string
}

const emptyEducation: EducationFormRow = {
  type: 'HIGH_SCHOOL',
  institutionName: '',
  studyArea: '',
  startDate: '',
  endDate: '',
  completedYear: '',
  graduated: false,
  transcriptUrl: '',
  certificateUrl: '',
}

const emptyExperience: ExperienceFormRow = {
  type: 'TEACHING',
  organizationName: '',
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
}

const emptyAvailability: AvailabilityFormRow = {
  day: 'MONDAY',
  startTime: '08:00',
  endTime: '09:00',
  timezone: 'Local',
}

const onboardingSteps = [
  { id: 1, title: 'Language Skills', requirement: 'Add at least one language with proficiency.' },
  { id: 2, title: 'Academic History', requirement: 'Add at least one school/college record.' },
  { id: 3, title: 'Experience', requirement: 'Add at least one teaching or work experience.' },
  { id: 4, title: 'Availability', requirement: 'Add at least one weekly availability slot.' },
  { id: 5, title: 'Demo Videos', requirement: 'Add one video link for each language.' },
  { id: 6, title: 'Review & Submit', requirement: 'Confirm details and submit your application.' },
] as const

export default function TutorOnboardingPage() {
  const { token, user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [application, setApplication] = useState<TutorApplication | null>(null)
  const [step, setStep] = useState(1)

  const [languages, setLanguages] = useState<LanguageFormRow[]>([{ language: 'English', proficiency: 'FLUENT' }])
  const [education, setEducation] = useState<EducationFormRow[]>([emptyEducation])
  const [experience, setExperience] = useState<ExperienceFormRow[]>([emptyExperience])
  const [availability, setAvailability] = useState<AvailabilityFormRow[]>([emptyAvailability])
  const [videos, setVideos] = useState<Record<string, string>>({})

  const normalizedLanguages = useMemo(
    () =>
      languages
        .map((entry) => ({ language: entry.language.trim(), proficiency: entry.proficiency }))
        .filter((entry) => entry.language.length > 0),
    [languages]
  )
  const hasLanguageEntries = normalizedLanguages.length > 0
  const hasEducationEntries = useMemo(
    () => education.some((entry) => entry.institutionName.trim().length > 0),
    [education]
  )
  const hasExperienceEntries = useMemo(
    () =>
      experience.some(
        (entry) => entry.organizationName.trim().length > 0 && entry.title.trim().length > 0
      ),
    [experience]
  )
  const hasAvailabilityEntries = useMemo(
    () => availability.some((entry) => entry.startTime.length > 0 && entry.endTime.length > 0),
    [availability]
  )
  const hasDemoVideosForAllLanguages = useMemo(
    () =>
      hasLanguageEntries &&
      normalizedLanguages.every((entry) => (videos[entry.language] ?? '').trim().length > 0),
    [hasLanguageEntries, normalizedLanguages, videos]
  )

  const maxUnlockedStep = useMemo(() => {
    if (application?.status === 'SUBMITTED') {
      return 6
    }

    if (!hasLanguageEntries) {
      return 1
    }
    if (!hasEducationEntries) {
      return 2
    }
    if (!hasExperienceEntries) {
      return 3
    }
    if (!hasAvailabilityEntries) {
      return 4
    }
    if (!hasDemoVideosForAllLanguages) {
      return 5
    }

    return 6
  }, [
    application?.status,
    hasLanguageEntries,
    hasEducationEntries,
    hasExperienceEntries,
    hasAvailabilityEntries,
    hasDemoVideosForAllLanguages,
  ])

  useEffect(() => {
    if (!token) {
      return
    }

    tutorOnboardingApi
      .get(token)
      .then((payload) => {
        setApplication(payload)
        setStep(Math.min(6, Math.max(1, payload.currentStep || 1)))
        if (payload.languageSkills.length > 0) {
          setLanguages(payload.languageSkills.map((item) => ({ language: item.language, proficiency: item.proficiency })))
        }
        if (payload.educationEntries.length > 0) {
          setEducation(
            payload.educationEntries.map((item) => ({
              type: item.type,
              institutionName: item.institutionName,
              studyArea: item.studyArea ?? '',
              startDate: item.startDate ? item.startDate.slice(0, 10) : '',
              endDate: item.endDate ? item.endDate.slice(0, 10) : '',
              completedYear: item.completedYear ? String(item.completedYear) : '',
              graduated: item.graduated,
              transcriptUrl: item.transcriptUrl ?? '',
              certificateUrl: item.certificateUrl ?? '',
            }))
          )
        }
        if (payload.experienceEntries.length > 0) {
          setExperience(
            payload.experienceEntries.map((item) => ({
              type: item.type,
              organizationName: item.organizationName,
              title: item.title,
              description: item.description ?? '',
              startDate: item.startDate ? item.startDate.slice(0, 10) : '',
              endDate: item.endDate ? item.endDate.slice(0, 10) : '',
              currentlyWorking: item.currentlyWorking,
            }))
          )
        }
        if (payload.availabilitySlots.length > 0) {
          setAvailability(
            payload.availabilitySlots.map((item) => ({
              day: item.day,
              startTime: item.startTime,
              endTime: item.endTime,
              timezone: item.timezone,
            }))
          )
        }

        const videoMap: Record<string, string> = {}
        payload.languageSkills.forEach((skill) => {
          const video = payload.languageDemoVideos.find((entry) => entry.languageSkillId === skill.id)
          videoMap[skill.language] = video?.url ?? ''
        })
        setVideos(videoMap)
      })
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : 'Could not load onboarding')
      })
      .finally(() => setLoading(false))
  }, [token])

  const progressText = useMemo(() => `Step ${step} of 6`, [step])

  const withSave = async (action: () => Promise<TutorApplication>, nextStep: number, message: string) => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const payload = await action()
      setApplication(payload)
      setStep(nextStep)
      setSuccess(message)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  const submitLanguages = async () => {
    if (!token) return

    if (normalizedLanguages.length === 0) {
      setError('Add at least one language and proficiency before continuing.')
      setSuccess(null)
      return
    }

    const seenLanguages = new Set<string>()
    const hasDuplicateLanguage = normalizedLanguages.some((entry) => {
      const key = entry.language.toLowerCase()
      if (seenLanguages.has(key)) {
        return true
      }
      seenLanguages.add(key)
      return false
    })

    if (hasDuplicateLanguage) {
      setError('Each language should only be listed once.')
      setSuccess(null)
      return
    }

    await withSave(
      () => tutorOnboardingApi.saveLanguages(token, normalizedLanguages),
      2,
      'Language skills saved'
    )
  }

  const submitEducation = async () => {
    if (!token) return
    const normalized = education
      .filter((entry) => entry.institutionName.trim().length > 0)
      .map((entry) => ({
        ...entry,
        institutionName: entry.institutionName.trim(),
        studyArea: entry.studyArea || undefined,
        startDate: entry.startDate || undefined,
        endDate: entry.endDate || undefined,
        completedYear: entry.completedYear ? Number(entry.completedYear) : undefined,
        transcriptUrl: entry.transcriptUrl || undefined,
        certificateUrl: entry.certificateUrl || undefined,
      }))

    if (normalized.length === 0) {
      setError('Add at least one academic history entry before continuing.')
      setSuccess(null)
      return
    }

    await withSave(
      () => tutorOnboardingApi.saveEducation(token, normalized),
      3,
      'Academic history saved'
    )
  }

  const submitExperience = async () => {
    if (!token) return
    const normalized = experience
      .filter((entry) => entry.organizationName.trim().length > 0 && entry.title.trim().length > 0)
      .map((entry) => ({
        ...entry,
        organizationName: entry.organizationName.trim(),
        title: entry.title.trim(),
        description: entry.description || undefined,
        startDate: entry.startDate || undefined,
        endDate: entry.endDate || undefined,
      }))

    if (normalized.length === 0) {
      setError('Add at least one teaching or work experience entry before continuing.')
      setSuccess(null)
      return
    }

    await withSave(
      () => tutorOnboardingApi.saveExperience(token, normalized),
      4,
      'Teaching and work experience saved'
    )
  }

  const submitAvailability = async () => {
    if (!token) return
    const normalized = availability
      .filter((entry) => entry.startTime && entry.endTime)
      .map((entry) => ({
        ...entry,
        totalHours: 1,
      }))

    if (normalized.length === 0) {
      setError('Add at least one availability slot before continuing.')
      setSuccess(null)
      return
    }

    await withSave(
      () => tutorOnboardingApi.saveAvailability(token, normalized),
      5,
      'Availability saved'
    )
  }

  const submitVideos = async () => {
    if (!token) return

    const normalized = normalizedLanguages.map((entry) => ({
      language: entry.language,
      url: (videos[entry.language] ?? '').trim(),
    }))

    const missingLanguages = normalized.filter((entry) => entry.url.length === 0).map((entry) => entry.language)
    if (missingLanguages.length > 0) {
      setError(`Add demo video links for: ${missingLanguages.join(', ')}`)
      setSuccess(null)
      return
    }

    const invalidUrl = normalized.find((entry) => !/^https?:\/\//i.test(entry.url))
    if (invalidUrl) {
      setError(`Use a valid URL for ${invalidUrl.language} (must start with http:// or https://).`)
      setSuccess(null)
      return
    }

    await withSave(
      () => tutorOnboardingApi.saveVideos(token, normalized),
      6,
      'Language demo video links saved'
    )
  }

  const handleStepNavigation = (targetStep: number) => {
    if (targetStep > maxUnlockedStep) {
      setError('Complete the required questions in earlier steps to unlock this section.')
      setSuccess(null)
      return
    }

    setError(null)
    setSuccess(null)
    setStep(targetStep)
  }

  const submitApplication = async () => {
    if (!token) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const payload = await tutorOnboardingApi.submit(token)
      setApplication(payload)
      setSuccess('Application submitted successfully')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="surface-card">
        <p className="text-sm text-[color:var(--on-surface-soft)]">Loading onboarding...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="surface-card p-6">
        <p className="eyebrow">Tutor Application</p>
        <h1 className="text-2xl font-bold">Tutor Onboarding</h1>
        <p className="mt-1 text-[color:var(--on-surface-soft)]">{progressText}</p>
        <p className="mt-2 text-sm text-[color:var(--on-surface-soft)]">
          Complete each step in order: language skills, academics, experience, availability, demo videos, and final review.
        </p>

        <div className="mt-5 rounded-2xl surface-tier-low p-4">
          <p className="text-sm font-semibold">Progress Tracker</p>
          <div className="mt-3 overflow-x-auto pb-1">
            <div className="flex min-w-[760px] items-start gap-2">
              {onboardingSteps.map((item, index) => {
                const isActive = step === item.id
                const isCompleted = item.id < step
                const isLocked = item.id > maxUnlockedStep

                return (
                  <div key={item.id} className="flex flex-1 items-center gap-2">
                    <button
                      type="button"
                      className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-bold transition ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : isActive
                            ? 'border-[color:var(--primary)] bg-[color:var(--surface-high)] text-[color:var(--primary)]'
                            : isLocked
                              ? 'border-[color:var(--outline-ghost)] bg-[color:var(--surface-lowest)] text-[color:var(--on-surface-soft)]'
                              : 'border-[color:var(--outline-ghost)] bg-[color:var(--surface-lowest)] text-[color:var(--on-surface-soft)] hover:border-[color:var(--primary)]'
                      }`}
                      onClick={() => handleStepNavigation(item.id)}
                      disabled={isLocked}
                      aria-label={`Go to step ${item.id}: ${item.title}`}
                    >
                      {String(item.id).padStart(2, '0')}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold ${isCompleted ? 'text-emerald-700' : isActive ? 'text-[color:var(--primary)]' : 'text-[color:var(--on-surface)]'}`}>
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[color:var(--on-surface-soft)]">{item.requirement}</p>
                    </div>
                    {index < onboardingSteps.length - 1 ? <div className="h-px flex-1 bg-[color:var(--outline-ghost)]" /> : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <section className="surface-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">Language Skills</h2>
          <p className="text-sm text-[color:var(--on-surface-soft)]">Required: Add at least one language and select proficiency.</p>
          {languages.map((entry, index) => (
            <div key={`${entry.language}-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="form-input"
                placeholder="Language"
                value={entry.language}
                onChange={(event) =>
                  setLanguages((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? { ...item, language: event.target.value } : item))
                  )
                }
              />
              <select
                className="form-input"
                value={entry.proficiency}
                onChange={(event) =>
                  setLanguages((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, proficiency: event.target.value as ProficiencyLevel } : item
                    )
                  )
                }
              >
                <option value="NATIVE">Native</option>
                <option value="FLUENT">Fluent</option>
                <option value="COMFORTABLE">Comfortable</option>
              </select>
            </div>
          ))}
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setLanguages((current) => [...current, { language: '', proficiency: 'COMFORTABLE' }])}
            >
              Add Language
            </button>
            <button type="button" className="btn-primary" onClick={submitLanguages} disabled={saving}>
              {saving ? 'Saving...' : 'Next'}
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="surface-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">Academic History</h2>
          <p className="text-sm text-[color:var(--on-surface-soft)]">Required: Add at least one school/college/certification entry.</p>
          {education.map((entry, index) => (
            <div key={`education-${index}`} className="rounded-2xl surface-tier-low p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  className="form-input"
                  value={entry.type}
                  onChange={(event) =>
                    setEducation((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, type: event.target.value as EducationFormRow['type'] }
                          : item
                      )
                    )
                  }
                >
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="COLLEGE">College / University</option>
                  <option value="OTHER_CERTIFICATION">Other Certification</option>
                </select>
                <input
                  className="form-input"
                  placeholder="Institution"
                  value={entry.institutionName}
                  onChange={(event) =>
                    setEducation((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, institutionName: event.target.value } : item
                      )
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="form-input"
                  placeholder="Field of study"
                  value={entry.studyArea}
                  onChange={(event) =>
                    setEducation((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? { ...item, studyArea: event.target.value } : item))
                    )
                  }
                />
                <input
                  className="form-input"
                  type="date"
                  value={entry.startDate}
                  onChange={(event) =>
                    setEducation((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? { ...item, startDate: event.target.value } : item))
                    )
                  }
                />
                <input
                  className="form-input"
                  type="date"
                  value={entry.endDate}
                  onChange={(event) =>
                    setEducation((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? { ...item, endDate: event.target.value } : item))
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="form-input"
                  placeholder="Completed Year"
                  value={entry.completedYear}
                  onChange={(event) =>
                    setEducation((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, completedYear: event.target.value } : item
                      )
                    )
                  }
                />
                <input
                  className="form-input"
                  placeholder="Transcript URL"
                  value={entry.transcriptUrl}
                  onChange={(event) =>
                    setEducation((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, transcriptUrl: event.target.value } : item
                      )
                    )
                  }
                />
                <input
                  className="form-input"
                  placeholder="Certificate URL"
                  value={entry.certificateUrl}
                  onChange={(event) =>
                    setEducation((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, certificateUrl: event.target.value } : item
                      )
                    )
                  }
                />
              </div>
            </div>
          ))}

          <div className="flex gap-3">
            <button type="button" className="btn-secondary" onClick={() => setEducation((current) => [...current, emptyEducation])}>
              Add More
            </button>
            <button type="button" className="btn-primary" onClick={submitEducation} disabled={saving}>
              {saving ? 'Saving...' : 'Next'}
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="surface-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">Teaching and Work Experience</h2>
          <p className="text-sm text-[color:var(--on-surface-soft)]">Required: Add at least one experience entry with organization and title.</p>
          {experience.map((entry, index) => (
            <div key={`experience-${index}`} className="rounded-2xl surface-tier-low p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  className="form-input"
                  value={entry.type}
                  onChange={(event) =>
                    setExperience((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, type: event.target.value as ExperienceFormRow['type'] }
                          : item
                      )
                    )
                  }
                >
                  <option value="TEACHING">Teaching Experience</option>
                  <option value="WORK">Work Experience</option>
                </select>
                <input
                  className="form-input"
                  placeholder="Organization"
                  value={entry.organizationName}
                  onChange={(event) =>
                    setExperience((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, organizationName: event.target.value } : item
                      )
                    )
                  }
                />
                <input
                  className="form-input"
                  placeholder="Title"
                  value={entry.title}
                  onChange={(event) =>
                    setExperience((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, title: event.target.value } : item
                      )
                    )
                  }
                />
              </div>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Description"
                value={entry.description}
                onChange={(event) =>
                  setExperience((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? { ...item, description: event.target.value } : item))
                  )
                }
              />
            </div>
          ))}

          <div className="flex gap-3">
            <button type="button" className="btn-secondary" onClick={() => setExperience((current) => [...current, emptyExperience])}>
              Add Experience
            </button>
            <button type="button" className="btn-primary" onClick={submitExperience} disabled={saving}>
              {saving ? 'Saving...' : 'Next'}
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="surface-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">Availability</h2>
          <p className="text-sm text-[color:var(--on-surface-soft)]">Required: Add at least one weekly day/time slot.</p>
          {availability.map((entry, index) => (
            <div key={`availability-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                className="form-input"
                value={entry.day}
                onChange={(event) =>
                  setAvailability((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, day: event.target.value as Weekday } : item
                    )
                  )
                }
              >
                {weekdays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <input
                className="form-input"
                type="time"
                value={entry.startTime}
                onChange={(event) =>
                  setAvailability((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, startTime: event.target.value } : item
                    )
                  )
                }
              />
              <input
                className="form-input"
                type="time"
                value={entry.endTime}
                onChange={(event) =>
                  setAvailability((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? { ...item, endTime: event.target.value } : item))
                  )
                }
              />
              <input
                className="form-input"
                value={entry.timezone}
                onChange={(event) =>
                  setAvailability((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, timezone: event.target.value } : item
                    )
                  )
                }
              />
            </div>
          ))}

          <div className="flex gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setAvailability((current) => [...current, emptyAvailability])}
            >
              Add Availability Time
            </button>
            <button type="button" className="btn-primary" onClick={submitAvailability} disabled={saving}>
              {saving ? 'Saving...' : 'Next'}
            </button>
          </div>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="surface-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">Language Demonstration Video</h2>
          <p className="text-sm text-[color:var(--on-surface-soft)]">Required: One valid video URL per language (YouTube, Drive, or similar).</p>
          <div className="rounded-2xl surface-tier-low p-4 text-sm">
            <p>
              Record a short video under 10 minutes for each language you added. Upload to YouTube or Google Drive and
              paste each link below.
            </p>
          </div>

          {languages.map((language) => (
            <div key={language.language} className="space-y-2">
              <label className="text-sm font-medium">{language.language} video link</label>
              <input
                className="form-input"
                placeholder="https://..."
                value={videos[language.language] ?? ''}
                onChange={(event) =>
                  setVideos((current) => ({
                    ...current,
                    [language.language]: event.target.value,
                  }))
                }
              />
            </div>
          ))}

          <button type="button" className="btn-primary" onClick={submitVideos} disabled={saving}>
            {saving ? 'Saving...' : 'Next'}
          </button>
        </section>
      ) : null}

      {step === 6 ? (
        <section className="surface-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">Review and Submit Your Application</h2>
          <p className="text-sm text-[color:var(--on-surface-soft)]">
            Once you submit, our team will review your profile and may schedule an interview.
          </p>

          <div className="rounded-2xl surface-tier-low p-4 space-y-2">
            <p className="text-sm"><strong>Tutor:</strong> {user?.fullName}</p>
            <p className="text-sm"><strong>Languages:</strong> {languages.map((item) => item.language).join(', ') || 'None'}</p>
            <p className="text-sm"><strong>Education Entries:</strong> {education.filter((item) => item.institutionName).length}</p>
            <p className="text-sm"><strong>Experience Entries:</strong> {experience.filter((item) => item.organizationName).length}</p>
            <p className="text-sm"><strong>Availability Slots:</strong> {availability.length}</p>
          </div>

          <button type="button" className="btn-primary" onClick={submitApplication} disabled={submitting || application?.status === 'SUBMITTED'}>
            {application?.status === 'SUBMITTED' ? 'Application Submitted' : submitting ? 'Submitting...' : 'Submit Your Application'}
          </button>
        </section>
      ) : null}

      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  )
}
