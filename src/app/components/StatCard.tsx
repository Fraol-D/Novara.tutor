import type { ReactNode } from 'react'

type StatCardProps = {
  title: string
  value: string | number
  hint?: string
  icon?: ReactNode
  accent?: 'teal' | 'amber' | 'rose' | 'blue'
}

const accentMap = {
  teal: 'from-primary/10 to-primary/5 text-primary',
  amber: 'from-accent/10 to-accent/5 text-accent',
  rose: 'from-rose-500/10 to-rose-500/5 text-rose-500',
  blue: 'from-blue-500/10 to-blue-500/5 text-blue-500',
}

export default function StatCard({ title, value, hint, icon, accent = 'teal' }: StatCardProps) {
  const colors = accentMap[accent]

  return (
    <article className="stat-card group">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {icon ? (
          <span className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br ${colors} p-2 text-lg transition-transform group-hover:scale-110`}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-bold text-text dark:text-text-dark">{value}</p>
      {hint ? <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{hint}</p> : null}
    </article>
  )
}
