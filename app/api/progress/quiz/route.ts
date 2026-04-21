import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { lessonId, score, total } = await request.json()
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 })
  }
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  await prisma.progress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    update: { quizScore: pct },
    create: { userId: session.user.id, lessonId, quizScore: pct },
  })
  return NextResponse.json({ ok: true })
}
