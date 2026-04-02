import type { ReactNode } from 'react'

type StatCardProps = {
  title: string
  value: string | number
  hint?: string
  icon?: ReactNode
  accent?: 'teal' | 'amber' | 'rose' | 'blue'
}

const accentMap = {
  teal: 'bg-[color:var(--surface-high)] text-[color:var(--primary)]',
  amber: 'bg-[color:var(--surface-high)] text-[color:#a6673f]',
  rose: 'bg-[color:var(--surface-high)] text-rose-600',
  blue: 'bg-[color:var(--surface-high)] text-sky-700',
}

export default function StatCard({ title, value, hint, icon, accent = 'teal' }: StatCardProps) {
  const colors = accentMap[accent]

  return (
    <article className="stat-card group">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--on-surface-soft)]">{title}</p>
        {icon ? (
          <span className={`inline-flex items-center justify-center rounded-2xl ${colors} p-2.5 text-lg transition-transform group-hover:scale-110`}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-bold [font-family:var(--font-display)]">{value}</p>
      {hint ? <p className="mt-2 text-xs text-[color:var(--on-surface-soft)]">{hint}</p> : null}
    </article>
  )
}
