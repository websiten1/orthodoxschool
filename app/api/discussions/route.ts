import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  lessonId: z.string(),
  body: z.string().min(1).max(5000),
  parentId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await request.json()
  const data = schema.safeParse(body)
  if (!data.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }
  const post = await prisma.discussion.create({
    data: {
      lessonId: data.data.lessonId,
      userId: session.user.id,
      body: data.data.body,
      parentId: data.data.parentId,
    },
  })
  return NextResponse.json(post, { status: 201 })
}
