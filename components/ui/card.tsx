import * as React from "react"
import { cn } from "@/lib/utils"

export function Card({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "border border-[var(--border)] bg-[var(--bg-card)] p-6",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("mb-4", className)}>{children}</div>
  )
}

export function CardTitle({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <h3
      className={cn(
        "font-serif text-lg font-normal text-[var(--text-primary)]",
        className
      )}
    >
      {children}
    </h3>
  )
}

export function CardContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn("text-sm text-[var(--text-secondary)]", className)}>{children}</div>
}
