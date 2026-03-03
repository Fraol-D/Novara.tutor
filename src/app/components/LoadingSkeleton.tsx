type SkeletonProps = {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 p-5 shadow-sm">
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="mt-3 h-9 w-16 rounded" />
      <Skeleton className="mt-2 h-3 w-32 rounded" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="border-t border-gray-100 dark:border-gray-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full rounded" />
        </td>
      ))}
    </tr>
  )
}
