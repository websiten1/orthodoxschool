import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Reading Plans" }

export default async function ReadingPlansPage() {
  let session = null
  let plans: any[] = []
  let userProgress: Record<string, number[]> = {}

  try {
    session = await auth()
  } catch {}

  try {
    plans = await prisma.readingPlan.findMany({ orderBy: { createdAt: "asc" } })
  } catch {}

  if (session?.user?.id && plans.length > 0) {
    try {
      const progress = await prisma.readingPlanProgress.findMany({
        where: { userId: session.user.id },
      })
      for (const p of progress) {
        if (!userProgress[p.planId]) userProgress[p.planId] = []
        userProgress[p.planId].push(p.day)
      }
    } catch {}
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <p className="small-caps text-xs text-[var(--text-secondary)] tracking-widest mb-6">
        Reading
      </p>
      <h1
        className="font-serif text-3xl font-light text-[var(--text-primary)] mb-4"
        style={{ letterSpacing: "0.02em" }}
      >
        Reading Plans
      </h1>
      <p className="text-sm font-sans text-[var(--text-secondary)] mb-12 max-w-lg leading-relaxed">
        Structured plans combining Scripture, the Church Fathers, and catechism.
        Each plan spans a set number of days. Check off each day and leave a
        short reflection.
      </p>

      {plans.length === 0 ? (
        <p className="text-sm font-sans text-[var(--text-secondary)]">
          Reading plans coming soon.
        </p>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {plans.map((plan: any) => {
            const days = plan.days as any[]
            const completed = userProgress[plan.id]?.length ?? 0
            const pct = days.length > 0 ? Math.round((completed / days.length) * 100) : 0

            return (
              <Link
                key={plan.id}
                href={`/reading-plans/${plan.id}`}
                className="flex gap-6 py-7 group"
              >
                <div className="flex-1">
                  <p className="font-serif text-lg font-normal text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-1">
                    {plan.title}
                  </p>
                  <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed mb-3">
                    {plan.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-sans text-[var(--text-secondary)]">
                      {days.length} days
                    </span>
                    {session?.user && (
                      <span className="text-xs font-sans text-[var(--text-secondary)]">
                        {completed} completed ({pct}%)
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
