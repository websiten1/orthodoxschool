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
  const plan = await prisma.readingPlan.findUnique({ where: { id: planId } })
  return { title: plan?.title ?? "Reading Plan" }
}

export default async function ReadingPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>
}) {
  const { planId } = await params
  const session = await auth()

  const plan = await prisma.readingPlan.findUnique({ where: { id: planId } })
  if (!plan) notFound()

  const progress = session?.user?.id
    ? await prisma.readingPlanProgress.findMany({
        where: { userId: session.user.id, planId },
      })
    : []

  const completedDays = progress.map((p) => p.day)
  const reflections = Object.fromEntries(
    progress.filter((p) => p.reflection).map((p) => [p.day, p.reflection!])
  )

  return (
    <ReadingPlanClient
      plan={{ ...plan, days: plan.days as any[] }}
      completedDays={completedDays}
      reflections={reflections}
      isAuthenticated={!!session?.user}
    />
  )
}
