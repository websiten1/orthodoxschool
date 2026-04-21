"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { ProgressBar } from "@/components/ui/progress-bar"
import { jurisdictionLabel, trackLabel } from "@/lib/utils"

const JURISDICTION_OPTIONS = [
  { value: "NOT_SURE", label: "Not sure yet" },
  { value: "OCA", label: "OCA" },
  { value: "GOARCH", label: "GOARCH" },
  { value: "ANTIOCHIAN", label: "Antiochian" },
  { value: "ROCOR", label: "ROCOR" },
  { value: "SERBIAN", label: "Serbian" },
  { value: "ROMANIAN", label: "Romanian" },
  { value: "BULGARIAN", label: "Bulgarian" },
]

interface Props {
  user: {
    id: string
    name: string | null
    email: string
    track: string
    jurisdiction: string
    createdAt: Date
  }
  pillarsProgress: { id: string; title: string; slug: string; total: number; completed: number }[]
  totalLessons: number
  totalCompleted: number
}

export function ProfileClient({ user, pillarsProgress, totalLessons, totalCompleted }: Props) {
  const router = useRouter()
  const [track, setTrack] = useState(user.track)
  const [jurisdiction, setJurisdiction] = useState(user.jurisdiction)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function saveProfile() {
    setSaving(true)
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track, jurisdiction }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    router.refresh()
  }

  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <h1
        className="font-serif text-3xl font-light text-[var(--text-primary)] mb-8"
        style={{ letterSpacing: "0.02em" }}
      >
        {user.name ?? user.email}
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-12 border-b border-[var(--border)] pb-12">
        <div>
          <p className="text-xs font-sans text-[var(--text-secondary)] uppercase tracking-wider mb-1">
            Overall progress
          </p>
          <p className="font-serif text-2xl font-light text-[var(--text-primary)]">
            {overallPct}%
          </p>
          <ProgressBar value={overallPct} className="mt-2" />
        </div>
        <div>
          <p className="text-xs font-sans text-[var(--text-secondary)] uppercase tracking-wider mb-1">
            Lessons completed
          </p>
          <p className="font-serif text-2xl font-light text-[var(--text-primary)]">
            {totalCompleted} <span className="text-sm text-[var(--text-secondary)]">/ {totalLessons}</span>
          </p>
        </div>
        <div>
          <p className="text-xs font-sans text-[var(--text-secondary)] uppercase tracking-wider mb-1">
            Track
          </p>
          <p className="font-serif text-base font-normal text-[var(--text-primary)]">
            {trackLabel(track)}
          </p>
        </div>
      </div>

      {/* Per-pillar progress */}
      <div className="mb-12">
        <h2 className="font-serif text-lg font-normal text-[var(--text-primary)] mb-6">
          By pillar
        </h2>
        <div className="divide-y divide-[var(--border)]">
          {pillarsProgress.map((p) => {
            const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0
            return (
              <div key={p.id} className="py-4 flex items-center gap-4">
                <Link
                  href={`/pillars/${p.slug}`}
                  className="flex-1 text-sm font-sans text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                >
                  {p.title}
                </Link>
                <div className="flex items-center gap-3 w-40">
                  <ProgressBar value={pct} className="flex-1" />
                  <span className="text-xs font-sans text-[var(--text-secondary)] w-8 text-right shrink-0">
                    {pct}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="border border-[var(--border)] p-6">
        <h2 className="font-serif text-lg font-normal text-[var(--text-primary)] mb-6">
          Settings
        </h2>
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-sans text-[var(--text-secondary)] uppercase tracking-wider">
              Learning track
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "INQUIRER", label: "Inquirer" },
                { value: "CATECHUMEN", label: "Catechumen" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTrack(t.value)}
                  className={`border p-2.5 text-sm font-sans text-left transition-colors ${
                    track === t.value
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text-secondary)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <Select
            label="Jurisdiction"
            options={JURISDICTION_OPTIONS}
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
          />

          <Button
            onClick={saveProfile}
            disabled={saving}
            className="w-fit"
          >
            {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
