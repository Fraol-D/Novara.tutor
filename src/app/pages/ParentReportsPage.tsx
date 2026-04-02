import { useEffect, useState } from 'react'
import { parentApi } from '../api/parent'
import type { AssessmentReport, ParentChild, ReportType } from '../types'
import { useAuth } from '../state/AuthContext'

export default function ParentReportsPage() {
  const { token } = useAuth()
  const [children, setChildren] = useState<ParentChild[]>([])
  const [reports, setReports] = useState<AssessmentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [childId, setChildId] = useState('')
  const [reportType, setReportType] = useState<ReportType>('MASTERY')
  const [subject, setSubject] = useState('')

  useEffect(() => {
    if (!token) return

    parentApi
      .listChildren(token)
      .then((items) => setChildren(items))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Could not load children'))
  }, [token])

  useEffect(() => {
    if (!token) return

    setLoading(true)
    parentApi
      .getAssessmentReports(token, { childId: childId || undefined, type: reportType, subject: subject || undefined })
      .then((items) => setReports(items))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Could not load reports'))
      .finally(() => setLoading(false))
  }, [token, childId, reportType, subject])

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="surface-card space-y-4">
        <p className="eyebrow">Reporting</p>
        <h1 className="text-2xl font-bold">Assessment Reports</h1>
        <p className="text-sm text-[color:var(--on-surface-soft)]">View your child&apos;s weekly assessment report.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="form-input" value={childId} onChange={(event) => setChildId(event.target.value)}>
            <option value="">Select your child</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>{child.firstName} {child.lastName}</option>
            ))}
          </select>
          <select className="form-input" value={reportType} onChange={(event) => setReportType(event.target.value as ReportType)}>
            <option value="MASTERY">Mastery Assessment</option>
            <option value="PREREQUISITE">Prerequisite Assessment</option>
          </select>
          <input className="form-input" placeholder="Select Subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
        </div>

        {loading ? <p className="text-sm text-[color:var(--on-surface-soft)]">Loading reports...</p> : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        {!loading && !error ? (
          <div className="surface-tier-low rounded-2xl p-4 space-y-3">
            {reports.length === 0 ? (
              <p className="text-[color:var(--on-surface-soft)]">Please select your child to access their weekly assessment report.</p>
            ) : (
              reports.map((report) => (
                <article key={report.id} className="surface-tier-lowest rounded-2xl p-4">
                  <h2 className="font-semibold">{report.title}</h2>
                  <p className="text-sm text-[color:var(--on-surface-soft)]">{report.child.firstName} {report.child.lastName} • {report.subject}</p>
                  <p className="mt-2 text-sm">{report.summary}</p>
                  <p className="mt-2 text-xs text-[color:var(--on-surface-soft)]">Published: {new Date(report.publishedAt).toLocaleDateString()}</p>
                </article>
              ))
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}
