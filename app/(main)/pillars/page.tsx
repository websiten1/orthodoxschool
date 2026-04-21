import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { ProgressBar } from "@/components/ui/progress-bar"
import type { Metadata } from "next"
import type { Session } from "next-auth"

export const metadata: Metadata = { title: "Courses" }

export default async function PillarsPage() {
  let session: Session | null = null
  let pillars: any[] = []

  try {
    session = await auth()
  } catch {}

  try {
    pillars = await prisma.pillar.findMany({
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
  } catch {
    pillars = []
  }

  function getPillarProgress(pillar: any) {
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

  const STATIC_PILLARS = [
    { slug: "scripture-and-tradition", title: "Scripture & Holy Tradition", description: "How Orthodoxy reads the Bible within the living Tradition; canon, typology, the Fathers as interpreters." },
    { slug: "liturgy-and-sacraments", title: "Liturgy & the Sacraments", description: "The Divine Liturgy walked through step by step; the seven sacraments." },
    { slug: "church-history", title: "Church History", description: "Apostolic succession through the seven Councils; the Great Schism." },
    { slug: "theology", title: "Theology", description: "The Holy Trinity, Christology, theosis, essence and energies, apophaticism." },
    { slug: "saints-icons-veneration", title: "Saints, Icons & Veneration", description: "Theology of the icon, the communion of saints, the Theotokos." },
    { slug: "prayer-and-fasting", title: "Prayer Life & Fasting", description: "The Jesus Prayer, daily rule, the prayer rope, the fasting seasons." },
    { slug: "early-church-fathers", title: "The Early Church Fathers", description: "Guided readings from Ignatius, Athanasius, Chrysostom, Maximus, Damascene." },
  ]

  const displayPillars = pillars.length > 0 ? pillars : STATIC_PILLARS

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
        {displayPillars.map((pillar: any, idx: number) => {
          const progress = pillars.length > 0 ? getPillarProgress(pillar) : null
          const totalLessons =
            pillar.courses?.reduce(
              (acc: number, c: any) => acc + (c.lessons?.length ?? 0),
              0
            ) ?? 0
          return (
            <Link
              key={pillar.slug || pillar.id}
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
                  {totalLessons > 0 && (
                    <span className="text-xs font-sans text-[var(--text-secondary)]">
                      {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
                    </span>
                  )}
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
