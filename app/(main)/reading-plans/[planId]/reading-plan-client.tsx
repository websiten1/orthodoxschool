"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ProgressBar } from "@/components/ui/progress-bar"
import { CheckCircle, Circle } from "@phosphor-icons/react"
import type { ReadingPlanDay } from "@/types"

interface Props {
  plan: {
    id: string
    title: string
    description: string
    days: ReadingPlanDay[]
  }
  completedDays: number[]
  reflections: Record<number, string>
  isAuthenticated: boolean
}

export function ReadingPlanClient({
  plan,
  completedDays: initial,
  reflections: initialReflections,
  isAuthenticated,
}: Props) {
  const router = useRouter()
  const [completed, setCompleted] = useState(new Set(initial))
  const [reflections, setReflections] = useState(initialReflections)
  const [openDay, setOpenDay] = useState<number | null>(null)
  const [reflectionText, setReflectionText] = useState("")
  const [saving, setSaving] = useState(false)

  const pct = Math.round((completed.size / plan.days.length) * 100)

  async function toggleDay(day: number, reflection?: string) {
    if (!isAuthenticated) return
    setSaving(true)
    await fetch(`/api/reading-plans/${plan.id}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, reflection }),
    })
    setCompleted((prev) => {
      const next = new Set(prev)
      next.add(day)
      return next
    })
    if (reflection) setReflections((r) => ({ ...r, [day]: reflection }))
    setSaving(false)
    setOpenDay(null)
    setReflectionText("")
    router.refresh()
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <Link
        href="/reading-plans"
        className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors uppercase tracking-wider mb-8 inline-block"
      >
        ← Reading Plans
      </Link>

      <p className="small-caps text-xs text-[var(--text-secondary)] tracking-widest mb-3">
        {plan.days.length}-day plan
      </p>
      <h1
        className="font-serif text-3xl font-light text-[var(--text-primary)] mb-4"
        style={{ letterSpacing: "0.02em" }}
      >
        {plan.title}
      </h1>
      <p className="text-sm font-sans text-[var(--text-secondary)] mb-6 max-w-lg leading-relaxed">
        {plan.description}
      </p>

      <div className="flex items-center gap-4 mb-10">
        <ProgressBar value={pct} className="flex-1 max-w-xs" />
        <span className="text-xs font-sans text-[var(--text-secondary)]">
          {completed.size} / {plan.days.length} days
        </span>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {plan.days.map((day) => {
          const isDone = completed.has(day.day)
          const hasReflection = reflections[day.day]
          const isOpen = openDay === day.day

          return (
            <div key={day.day} className="py-6">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => !isDone && isAuthenticated && setOpenDay(isOpen ? null : day.day)}
                  className="mt-1 shrink-0 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  disabled={isDone || !isAuthenticated}
                >
                  {isDone ? (
                    <CheckCircle size={18} weight="thin" className="text-[var(--accent)]" />
                  ) : (
                    <Circle size={18} weight="thin" />
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-xs font-sans text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                    Day {day.day}
                  </p>
                  <p className="font-serif text-base font-normal text-[var(--text-primary)] mb-2">
                    {day.title}
                  </p>
                  {day.scripture && (
                    <p className="text-xs font-sans text-[var(--text-secondary)] mb-1">
                      Scripture: {day.scripture}
                    </p>
                  )}
                  {day.fathersReading && (
                    <p className="text-xs font-sans text-[var(--text-secondary)] mb-1">
                      Fathers: {day.fathersReading}
                    </p>
                  )}
                  <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed mt-2 italic">
                    {day.reflection}
                  </p>

                  {hasReflection && (
                    <div className="mt-3 border-l border-[var(--border)] pl-3">
                      <p className="text-xs font-sans text-[var(--text-secondary)] italic">
                        Your reflection: {hasReflection}
                      </p>
                    </div>
                  )}

                  {isOpen && !isDone && (
                    <div className="mt-4">
                      <Textarea
                        label="Your reflection (optional)"
                        value={reflectionText}
                        onChange={(e) => setReflectionText(e.target.value)}
                        placeholder="What stood out to you today?"
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => toggleDay(day.day, reflectionText || undefined)}
                          disabled={saving}
                        >
                          Mark complete
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setOpenDay(null); setReflectionText("") }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
