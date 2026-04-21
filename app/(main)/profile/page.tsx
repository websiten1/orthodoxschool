import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileClient } from "./profile-client"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Profile" }

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      track: true,
      jurisdiction: true,
      createdAt: true,
    },
  })

  if (!user) redirect("/login")

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

  const pillarsWithProgress = allPillars.map((p) => {
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

  const totalLessons = pillarsWithProgress.reduce((a, p) => a + p.total, 0)
  const totalCompleted = pillarsWithProgress.reduce((a, p) => a + p.completed, 0)

  return (
    <ProfileClient
      user={user}
      pillarsProgress={pillarsWithProgress}
      totalLessons={totalLessons}
      totalCompleted={totalCompleted}
    />
  )
}
