import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  track: z.enum(["INQUIRER", "CATECHUMEN"]).default("INQUIRER"),
  jurisdiction: z
    .enum(["OCA", "GOARCH", "ANTIOCHIAN", "ROCOR", "SERBIAN", "ROMANIAN", "BULGARIAN", "NOT_SURE"])
    .default("NOT_SURE"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      )
    }

    const hashed = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        track: data.track,
        jurisdiction: data.jurisdiction,
      },
    })

    return NextResponse.json({ id: user.id }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}
