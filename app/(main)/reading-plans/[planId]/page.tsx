import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { ReadingPlanClient } from "./reading-plan-client"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ planId: string }>
}): Promise<Metadata> {
  const { planId } = await params
  try {
    const plan = await prisma.readingPlan.findUnique({ where: { id: planId } })
    return { title: plan?.title ?? "Reading Plan" }
  } catch {
    return { title: "Reading Plan" }
  }
}

export default async function ReadingPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>
}) {
  const { planId } = await params

  let session = null
  try {
    session = await auth()
  } catch {}

  let plan: any = null
  try {
    plan = await prisma.readingPlan.findUnique({ where: { id: planId } })
  } catch {}

  if (!plan) notFound()

  let completedDays: number[] = []
  let reflections: Record<number, string> = {}

  if (session?.user?.id) {
    try {
      const progress = await prisma.readingPlanProgress.findMany({
        where: { userId: session.user.id, planId },
      })
      completedDays = progress.map((p: any) => p.day)
      reflections = Object.fromEntries(
        progress.filter((p: any) => p.reflection).map((p: any) => [p.day, p.reflection!])
      )
    } catch {}
  }

  return (
    <ReadingPlanClient
      plan={{ ...plan, days: plan.days as any[] }}
      completedDays={completedDays}
      reflections={reflections}
      isAuthenticated={!!session?.user}
    />
  )
}
