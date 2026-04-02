type SkeletonProps = {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="mt-3 h-9 w-16 rounded" />
      <Skeleton className="mt-2 h-3 w-32 rounded" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="border-t border-[color:var(--outline-ghost)]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full rounded" />
        </td>
      ))}
    </tr>
  )
}
