import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Live Classes" }

export default async function LiveClassesPage() {
  const session = await auth()
  const now = new Date()

  const upcoming = await prisma.liveClass.findMany({
    where: { startsAt: { gte: now } },
    orderBy: { startsAt: "asc" },
    include: { pillar: true, rsvps: session?.user ? { where: { userId: session.user.id! } } : false },
  })

  const past = await prisma.liveClass.findMany({
    where: { startsAt: { lt: now }, recordingUrl: { not: null } },
    orderBy: { startsAt: "desc" },
    take: 10,
    include: { pillar: true },
  })

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <p className="small-caps text-xs text-[var(--text-secondary)] tracking-widest mb-6">
        Community
      </p>
      <h1
        className="font-serif text-3xl font-light text-[var(--text-primary)] mb-4"
        style={{ letterSpacing: "0.02em" }}
      >
        Live Classes
      </h1>
      <p className="text-sm font-sans text-[var(--text-secondary)] mb-12 max-w-lg leading-relaxed">
        Weekly sessions with instructors and clergy. Free to attend. Video calls
        hosted via Zoom; recordings are archived here afterward.
      </p>

      {/* Upcoming */}
      <div className="mb-14">
        <h2 className="font-serif text-lg font-normal text-[var(--text-primary)] mb-6">
          Upcoming sessions
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm font-sans text-[var(--text-secondary)]">
            No upcoming sessions scheduled. Check back soon.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {upcoming.map((cls) => {
              const rsvpd = session?.user && (cls.rsvps as any[])?.length > 0
              return (
                <div key={cls.id} className="py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-base font-normal text-[var(--text-primary)] mb-1">
                        {cls.title}
                      </p>
                      {cls.pillar && (
                        <p className="text-xs font-sans text-[var(--text-secondary)] mb-1">
                          {cls.pillar.title}
                        </p>
                      )}
                      <p className="text-xs font-sans text-[var(--text-secondary)]">
                        {formatDate(cls.startsAt)} ·{" "}
                        {new Date(cls.startsAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                      {cls.description && (
                        <p className="text-sm font-sans text-[var(--text-secondary)] mt-2 leading-relaxed">
                          {cls.description}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      {rsvpd ? (
                        <span className="text-xs font-sans text-[var(--accent)]">
                          RSVP'd
                        </span>
                      ) : cls.joinUrl ? (
                        <a
                          href={cls.joinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-sans border border-[var(--border)] px-3 py-1.5 text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                        >
                          Join
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Past recordings */}
      {past.length > 0 && (
        <div>
          <h2 className="font-serif text-lg font-normal text-[var(--text-primary)] mb-6">
            Recordings
          </h2>
          <div className="divide-y divide-[var(--border)]">
            {past.map((cls) => (
              <div key={cls.id} className="py-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-sans text-[var(--text-primary)]">{cls.title}</p>
                  <p className="text-xs font-sans text-[var(--text-secondary)]">
                    {formatDate(cls.startsAt)}
                  </p>
                </div>
                {cls.recordingUrl && (
                  <a
                    href={cls.recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-sans text-[var(--accent)] hover:underline shrink-0"
                  >
                    Watch
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
