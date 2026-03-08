import { FormEvent, useState } from 'react'
import { parentApi } from '../api/parent'
import type { PackagePlan, Weekday } from '../types'
import { useAuth } from '../state/AuthContext'

type TimeSlotForm = {
  day: Weekday
  startTime: string
  endTime: string
  timezone: string
}

const defaultSlot: TimeSlotForm = {
  day: 'MONDAY',
  startTime: '08:00',
  endTime: '09:00',
  timezone: 'Local',
}

export default function ParentAddChildPage() {
  const { token } = useAuth()

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [grade, setGrade] = useState('')
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [schoolInUsa, setSchoolInUsa] = useState(false)
  const [packagePlan, setPackagePlan] = useState<PackagePlan>('GROW')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [timeSlots, setTimeSlots] = useState<TimeSlotForm[]>([])

  const addTimeSlot = () => setTimeSlots((current) => [...current, defaultSlot])

  const updateTimeSlot = (index: number, updates: Partial<TimeSlotForm>) => {
    setTimeSlots((current) => current.map((slot, slotIndex) => (slotIndex === index ? { ...slot, ...updates } : slot)))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await parentApi.createChild(token, {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth || undefined,
        grade: grade || undefined,
        country: country || undefined,
        state: state || undefined,
        schoolInUsa,
        packagePlan,
        profilePictureUrl: profilePictureUrl || undefined,
        notes: notes || undefined,
        timeSlots,
      })

      setSuccess('Child profile created successfully.')
      setFirstName('')
      setLastName('')
      setDateOfBirth('')
      setGrade('')
      setCountry('')
      setState('')
      setSchoolInUsa(false)
      setPackagePlan('GROW')
      setProfilePictureUrl('')
      setNotes('')
      setTimeSlots([])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not create child profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="surface-card p-6">
        <h1 className="text-2xl font-bold">Add Child</h1>
        <p className="mt-1 text-sm text-gray-500">Fill in your child details, package, and preferred learning schedule.</p>

        <form onSubmit={submit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="form-input" placeholder="First Name of the Child" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
            <input className="form-input" placeholder="Last Name of the Child" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
            <input className="form-input" type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
            <input className="form-input" placeholder="Grade" value={grade} onChange={(event) => setGrade(event.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="form-input" placeholder="Country" value={country} onChange={(event) => setCountry(event.target.value)} />
            <input className="form-input" placeholder="State" value={state} onChange={(event) => setState(event.target.value)} />
          </div>

          <div className="rounded-lg border border-gray-200 p-4 space-y-4">
            <p className="text-sm font-medium">Does the child go to school in the USA?</p>
            <div className="flex gap-4 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="radio" checked={schoolInUsa} onChange={() => setSchoolInUsa(true)} />
                Yes
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" checked={!schoolInUsa} onChange={() => setSchoolInUsa(false)} />
                No
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-medium mb-3">Select Package</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {([
                { key: 'GROW', label: '$260/mo - GROW PLAN' },
                { key: 'THRIVE', label: '$340/mo - THRIVE PLAN' },
                { key: 'EXCEL', label: '$430/mo - EXCEL PLAN' },
              ] as Array<{ key: PackagePlan; label: string }>).map((plan) => (
                <button
                  key={plan.key}
                  type="button"
                  onClick={() => setPackagePlan(plan.key)}
                  className={`rounded-lg border p-3 text-sm font-medium text-left ${packagePlan === plan.key ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                >
                  {plan.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Study Schedule</p>
              <button type="button" className="btn-secondary" onClick={addTimeSlot}>+ Add Time Slot</button>
            </div>

            {timeSlots.length === 0 ? <p className="text-sm text-gray-500">No time slots added yet.</p> : null}

            {timeSlots.map((slot, index) => (
              <div key={`${slot.day}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <select className="form-input" value={slot.day} onChange={(event) => updateTimeSlot(index, { day: event.target.value as Weekday })}>
                  {(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as Weekday[]).map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <input className="form-input" type="time" value={slot.startTime} onChange={(event) => updateTimeSlot(index, { startTime: event.target.value })} />
                <input className="form-input" type="time" value={slot.endTime} onChange={(event) => updateTimeSlot(index, { endTime: event.target.value })} />
                <input className="form-input" value={slot.timezone} onChange={(event) => updateTimeSlot(index, { timezone: event.target.value })} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="form-input" placeholder="Profile Picture URL" value={profilePictureUrl} onChange={(event) => setProfilePictureUrl(event.target.value)} />
            <textarea className="form-input" rows={3} placeholder="Anything you want us to know about the child?" value={notes} onChange={(event) => setNotes(event.target.value)} />
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Child Profile'}
          </button>
        </form>
      </section>

      {success ? <p className="text-sm text-green-600">{success}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
