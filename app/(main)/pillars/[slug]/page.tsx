import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ProgressBar } from "@/components/ui/progress-bar"
import { CheckCircle } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const pillar = await prisma.pillar.findUnique({ where: { slug } })
    return { title: pillar?.title ?? "Pillar" }
  } catch {
    return { title: "Pillar" }
  }
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let session = null
  try {
    session = await auth()
  } catch {}

  const userTrack = (session?.user as any)?.track ?? "INQUIRER"

  let pillar: any = null
  try {
    pillar = await prisma.pillar.findUnique({
      where: { slug },
      include: {
        courses: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              where: { status: "PUBLISHED" },
              orderBy: { order: "asc" },
              include: session?.user
                ? { progress: { where: { userId: session.user.id! } } }
                : { progress: false },
            },
          },
        },
      },
    })
  } catch {}

  if (!pillar) notFound()

  const trackCourses = pillar.courses.filter((c: any) => c.track === userTrack)

  function getLessonCompleted(lesson: any): boolean {
    return (lesson.progress as any[])?.length > 0
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <Link
        href="/pillars"
        className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors uppercase tracking-wider mb-8 inline-block"
      >
        ← Courses
      </Link>

      <p className="small-caps text-xs text-[var(--text-secondary)] tracking-widest mb-3">
        {userTrack === "CATECHUMEN" ? "Catechumen track" : "Inquirer track"}
      </p>
      <h1
        className="font-serif text-3xl font-light text-[var(--text-primary)] mb-4"
        style={{ letterSpacing: "0.02em" }}
      >
        {pillar.title}
      </h1>
      <p className="text-sm font-sans text-[var(--text-secondary)] mb-12 max-w-lg leading-relaxed">
        {pillar.description}
      </p>

      {trackCourses.length === 0 ? (
        <p className="text-sm font-sans text-[var(--text-secondary)]">
          No published lessons yet for this track. Check back soon.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {trackCourses.map((course: any) => {
            const total = course.lessons.length
            const completed = course.lessons.filter(getLessonCompleted).length
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0

            return (
              <div key={course.id}>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-serif text-base font-normal text-[var(--text-primary)]">
                    {course.title}
                  </h2>
                  {session?.user && total > 0 && (
                    <span className="text-xs font-sans text-[var(--text-secondary)]">
                      {completed}/{total}
                    </span>
                  )}
                </div>
                {session?.user && <ProgressBar value={pct} className="mb-4" />}
                <p className="text-xs font-sans text-[var(--text-secondary)] mb-4 leading-relaxed">
                  {course.description}
                </p>

                <div className="divide-y divide-[var(--border)]">
                  {course.lessons.map((lesson: any, li: number) => {
                    const done = getLessonCompleted(lesson)
                    return (
                      <Link
                        key={lesson.id}
                        href={`/pillars/${slug}/${course.id}/${lesson.slug}`}
                        className="flex items-center gap-4 py-4 group"
                      >
                        <span className="text-xs font-sans text-[var(--text-secondary)] w-6 shrink-0">
                          {li + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-sans text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                            {lesson.title}
                          </p>
                          {lesson.estimatedMinutes && (
                            <p className="text-xs font-sans text-[var(--text-secondary)] mt-0.5">
                              {lesson.estimatedMinutes} min
                            </p>
                          )}
                        </div>
                        {done && (
                          <CheckCircle
                            size={16}
                            weight="thin"
                            className="text-[var(--accent)] shrink-0"
                          />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
