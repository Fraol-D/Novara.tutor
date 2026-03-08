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
    const normalized = languages
      .map((entry) => ({ language: entry.language.trim(), proficiency: entry.proficiency }))
      .filter((entry) => entry.language.length > 0)

    await withSave(
      () => tutorOnboardingApi.saveLanguages(token, normalized),
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

    await withSave(
      () => tutorOnboardingApi.saveAvailability(token, normalized),
      5,
      'Availability saved'
    )
  }

  const submitVideos = async () => {
    if (!token) return
    const normalized = Object.entries(videos)
      .map(([language, url]) => ({ language, url: url.trim() }))
      .filter((entry) => entry.url.length > 0)

    await withSave(
      () => tutorOnboardingApi.saveVideos(token, normalized),
      6,
      'Language demo video links saved'
    )
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
      <div className="surface-card p-6">
        <p className="text-sm text-gray-500">Loading onboarding...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="surface-card p-6">
        <h1 className="text-2xl font-bold">Tutor Onboarding</h1>
        <p className="mt-1 text-gray-500">{progressText}</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Complete each step in order: language skills, academics, experience, availability, demo videos, and final review.
        </p>
      </div>

      {step === 1 ? (
        <section className="surface-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">Language Skills</h2>
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
          {education.map((entry, index) => (
            <div key={`education-${index}`} className="rounded-lg border border-gray-200 p-4 space-y-3">
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
          {experience.map((entry, index) => (
            <div key={`experience-${index}`} className="rounded-lg border border-gray-200 p-4 space-y-3">
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
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-sm">
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
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Once you submit, our team will review your profile and may schedule an interview.
          </p>

          <div className="rounded-lg border border-gray-200 p-4 space-y-2">
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

      {success ? <p className="text-sm text-green-600">{success}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
