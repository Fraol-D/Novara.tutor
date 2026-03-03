type StatCardProps = {
  title: string
  value: string | number
  hint?: string
}

export default function StatCard({ title, value, hint }: StatCardProps) {
  return (
    <article className="rounded-xl border border-primary/15 bg-white dark:bg-gray-900 p-5 shadow-sm">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-text dark:text-text-dark">{value}</p>
      {hint ? <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{hint}</p> : null}
    </article>
  )
}
