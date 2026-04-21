import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileClient } from "./profile-client"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Profile" }

export default async function ProfilePage() {
  let session = null
  try {
    session = await auth()
  } catch {}

  if (!session?.user?.id) redirect("/login")

  let user: any = null
  let pillarsWithProgress: any[] = []
  let totalLessons = 0
  let totalCompleted = 0

  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, track: true, jurisdiction: true, createdAt: true },
    })
  } catch {}

  if (!user) redirect("/login")

  try {
    const allPillars = await prisma.pillar.findMany({
      orderBy: { order: "asc" },
      include: {
        courses: {
          where: { track: user.track },
          include: {
            lessons: {
              where: { status: "PUBLISHED" },
              include: { progress: { where: { userId: user.id } } },
            },
          },
        },
      },
    })

    pillarsWithProgress = allPillars.map((p: any) => {
      let total = 0
      let completed = 0
      for (const c of p.courses) {
        for (const l of c.lessons) {
          total++
          if (l.progress.length > 0) completed++
        }
      }
      return { id: p.id, title: p.title, slug: p.slug, total, completed }
    })

    totalLessons = pillarsWithProgress.reduce((a: number, p: any) => a + p.total, 0)
    totalCompleted = pillarsWithProgress.reduce((a: number, p: any) => a + p.completed, 0)
  } catch {}

  return (
    <ProfileClient
      user={user}
      pillarsProgress={pillarsWithProgress}
      totalLessons={totalLessons}
      totalCompleted={totalCompleted}
    />
  )
}
