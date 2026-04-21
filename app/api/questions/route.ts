import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  question: z.string().min(10).max(2000),
})

export async function GET() {
  const questions = await prisma.priestQuestion.findMany({
    where: { status: "ANSWERED", answer: { published: true } },
    orderBy: { askedAt: "desc" },
    include: { answer: { include: { priest: true } } },
    take: 50,
  })
  return NextResponse.json(questions)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  const body = await request.json()
  const data = schema.safeParse(body)
  if (!data.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }
  const q = await prisma.priestQuestion.create({
    data: {
      question: data.data.question,
      askerId: session?.user?.id ?? null,
    },
  })
  return NextResponse.json({ id: q.id }, { status: 201 })
}
