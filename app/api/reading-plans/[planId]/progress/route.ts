import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { planId } = await params
  const { day, reflection } = await request.json()
  await prisma.readingPlanProgress.upsert({
    where: { userId_planId_day: { userId: session.user.id, planId, day } },
    update: { reflection },
    create: { userId: session.user.id, planId, day, reflection },
  })
  return NextResponse.json({ ok: true })
}
