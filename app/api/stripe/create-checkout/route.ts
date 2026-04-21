import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
  }

  const session = await auth()
  const { amount, recurring } = await request.json()

  if (!amount || amount < 100) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
  }

  const Stripe = (await import("stripe")).default
  const stripe = new Stripe(stripeKey)

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

  if (recurring) {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Orthodox Faith School — Monthly Support" },
            unit_amount: amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/donate?success=1`,
      cancel_url: `${baseUrl}/donate`,
      customer_email: session?.user?.email ?? undefined,
    })
    return NextResponse.json({ url: checkoutSession.url })
  } else {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Orthodox Faith School — One-time Donation" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/donate?success=1`,
      cancel_url: `${baseUrl}/donate`,
      customer_email: session?.user?.email ?? undefined,
    })
    return NextResponse.json({ url: checkoutSession.url })
  }
}
