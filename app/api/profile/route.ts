import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  track: z.enum(["INQUIRER", "CATECHUMEN"]).optional(),
  jurisdiction: z
    .enum(["OCA", "GOARCH", "ANTIOCHIAN", "ROCOR", "SERBIAN", "ROMANIAN", "BULGARIAN", "NOT_SURE"])
    .optional(),
  name: z.string().min(1).max(100).optional(),
})

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await request.json()
  const data = schema.safeParse(body)
  if (!data.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }
  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: data.data,
  })
  return NextResponse.json({ id: updated.id })
}
