"use client"

export function ProgressBar({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  return (
    <div
      className={`h-0.5 w-full bg-[var(--border)] overflow-hidden ${className ?? ""}`}
    >
      <div
        className="h-full bg-[var(--accent)] transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
