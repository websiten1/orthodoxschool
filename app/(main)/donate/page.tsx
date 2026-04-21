import { DonateClient } from "./donate-client"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Support the School" }

export default function DonatePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <p className="small-caps text-xs text-[var(--text-secondary)] tracking-widest mb-6">
        Support
      </p>
      <h1
        className="font-serif text-3xl font-light text-[var(--text-primary)] mb-4"
        style={{ letterSpacing: "0.02em" }}
      >
        Keep it free
      </h1>
      <p className="text-sm font-sans text-[var(--text-secondary)] mb-3 max-w-xl leading-relaxed">
        Orthodox Faith School is and always will be free. No content is locked
        behind a subscription. If these courses have been valuable to you, a
        donation of any amount helps cover hosting, development, and the time
        of the clergy and scholars who contribute.
      </p>
      <p className="text-sm font-sans text-[var(--text-secondary)] mb-12 max-w-xl leading-relaxed">
        You do not need an account to donate.
      </p>

      <DonateClient stripePublishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""} />

      <div className="mt-16 border-t border-[var(--border)] pt-8">
        <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed max-w-lg">
          Donations are processed securely by Stripe. Orthodox Faith School is
          an independent educational initiative; donations are not tax-deductible
          unless otherwise noted.
        </p>
      </div>
    </div>
  )
}
