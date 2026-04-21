import { cn } from "@/lib/utils"

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode
  variant?: "default" | "accent" | "muted"
  className?: string
}) {
  const variants = {
    default: "border border-[var(--border)] text-[var(--text-secondary)]",
    accent: "border border-[var(--accent)] text-[var(--accent)]",
    muted: "bg-[var(--bg-card)] text-[var(--text-secondary)]",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-sans font-medium small-caps",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
