import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { ProgressBar } from "@/components/ui/progress-bar"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Courses" }

export default async function PillarsPage() {
  const session = await auth()

  const pillars = await prisma.pillar.findMany({
    orderBy: { order: "asc" },
    include: {
      courses: {
        where: session?.user
          ? { track: (session.user as any).track }
          : { track: "INQUIRER" },
        include: {
          lessons: {
            where: { status: "PUBLISHED" },
            include: session?.user
              ? { progress: { where: { userId: session.user.id! } } }
              : { progress: false },
          },
        },
      },
    },
  })

  function getPillarProgress(pillar: (typeof pillars)[0]) {
    if (!session?.user) return null
    let total = 0
    let completed = 0
    for (const course of pillar.courses) {
      for (const lesson of course.lessons) {
        total++
        if ((lesson.progress as any[])?.length > 0) completed++
      }
    }
    if (total === 0) return null
    return Math.round((completed / total) * 100)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <p className="small-caps text-xs text-[var(--text-secondary)] tracking-widest mb-6">
        Courses
      </p>
      <h1
        className="font-serif text-3xl font-light text-[var(--text-primary)] mb-3"
        style={{ letterSpacing: "0.02em" }}
      >
        Seven pillars of the faith
      </h1>
      <p className="text-sm font-sans text-[var(--text-secondary)] mb-12 max-w-lg">
        Each pillar may be explored in any order. Lessons within a course unlock
        sequentially.
      </p>

      <div className="divide-y divide-[var(--border)]">
        {pillars.map((pillar, idx) => {
          const progress = getPillarProgress(pillar)
          const totalLessons = pillar.courses.reduce(
            (acc, c) => acc + c.lessons.length,
            0
          )
          return (
            <Link
              key={pillar.id}
              href={`/pillars/${pillar.slug}`}
              className="flex gap-6 py-7 group"
            >
              <span className="font-serif text-xs text-[var(--text-secondary)] pt-1 w-8 shrink-0 group-hover:text-[var(--accent)] transition-colors">
                {["I", "II", "III", "IV", "V", "VI", "VII"][idx]}
              </span>
              <div className="flex-1">
                <p className="font-serif text-lg font-normal text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-1">
                  {pillar.title}
                </p>
                <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed mb-3">
                  {pillar.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-sans text-[var(--text-secondary)]">
                    {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
                  </span>
                  {progress !== null && (
                    <div className="flex items-center gap-2 flex-1 max-w-xs">
                      <ProgressBar value={progress} className="flex-1" />
                      <span className="text-xs font-sans text-[var(--text-secondary)] shrink-0">
                        {progress}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
