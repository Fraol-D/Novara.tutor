import { useEffect, useMemo, useState } from 'react'
import { parentApi } from '../api/parent'
import type { ParentChild } from '../types'
import { useAuth } from '../state/AuthContext'

export default function ParentAcademicGpsPage() {
  const { token } = useAuth()
  const [children, setChildren] = useState<ParentChild[]>([])
  const [selectedChildId, setSelectedChildId] = useState('')
  const [subject, setSubject] = useState('')
  const [country, setCountry] = useState('')
  const [stateName, setStateName] = useState('')
  const [grade, setGrade] = useState('')
  const [activeTab, setActiveTab] = useState<'syllabus' | 'roadmap'>('syllabus')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [payload, setPayload] = useState<{ customSyllabus: unknown[]; academicRoadmap: unknown[]; message?: string }>({
    customSyllabus: [],
    academicRoadmap: [],
  })

  useEffect(() => {
    if (!token) return

    parentApi
      .listChildren(token)
      .then((items) => {
        setChildren(items)
        if (items[0]) {
          setSelectedChildId(items[0].id)
          setCountry(items[0].country ?? '')
          setStateName(items[0].state ?? '')
          setGrade(items[0].grade ?? '')
        }
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Could not load children'))
  }, [token])

  useEffect(() => {
    if (!token) return

    setLoading(true)
    parentApi
      .getAcademicGps(token, { childId: selectedChildId || undefined, subject: subject || undefined })
      .then((response) => setPayload(response))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Could not load GPS data'))
      .finally(() => setLoading(false))
  }, [token, selectedChildId, subject])

  const activeItems = useMemo(() => (activeTab === 'syllabus' ? payload.customSyllabus : payload.academicRoadmap), [activeTab, payload])

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="surface-card p-6 space-y-4">
        <h1 className="text-2xl font-bold">Academic GPS</h1>
        <p className="text-sm text-gray-500">View your child&apos;s tailored curriculum and current progress.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="form-input" value={selectedChildId} onChange={(event) => setSelectedChildId(event.target.value)}>
            <option value="">Select child</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>{child.firstName} {child.lastName}</option>
            ))}
          </select>
          <input className="form-input" placeholder="Select Subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
          <input className="form-input" placeholder="Select Grade" value={grade} onChange={(event) => setGrade(event.target.value)} />
          <input className="form-input" placeholder="Select Country" value={country} onChange={(event) => setCountry(event.target.value)} />
          <input className="form-input" placeholder="Select State" value={stateName} onChange={(event) => setStateName(event.target.value)} />
        </div>

        <div className="flex border border-gray-200 rounded-lg overflow-hidden text-sm font-medium">
          <button
            type="button"
            className={`flex-1 px-4 py-3 ${activeTab === 'syllabus' ? 'bg-primary/10 text-primary' : 'bg-white'}`}
            onClick={() => setActiveTab('syllabus')}
          >
            Custom Syllabus
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-3 ${activeTab === 'roadmap' ? 'bg-primary/10 text-primary' : 'bg-white'}`}
            onClick={() => setActiveTab('roadmap')}
          >
            Academic Roadmap
          </button>
        </div>

        {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {!loading && !error ? (
          <div className="rounded-lg border border-gray-200 p-4">
            {activeItems.length === 0 ? (
              <p className="text-sm text-gray-500">{payload.message ?? 'No data found for this selection yet.'}</p>
            ) : (
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(activeItems, null, 2)}</pre>
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}
