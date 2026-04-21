"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const PRESET_AMOUNTS = [5, 10, 25, 50, 100]

export function DonateClient({ stripePublishableKey }: { stripePublishableKey: string }) {
  const [amount, setAmount] = useState<number | null>(25)
  const [custom, setCustom] = useState("")
  const [recurring, setRecurring] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const finalAmount = custom ? parseFloat(custom) : amount

  async function handleDonate() {
    if (!finalAmount || finalAmount < 1) {
      setError("Please enter an amount of at least $1.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(finalAmount * 100), recurring }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError("Could not initiate checkout. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      {/* Amount selection */}
      <div className="mb-6">
        <p className="text-xs font-sans text-[var(--text-secondary)] uppercase tracking-wider mb-3">
          Amount (USD)
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => { setAmount(a); setCustom("") }}
              className={`border px-4 py-2 text-sm font-sans transition-colors ${
                amount === a && !custom
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>
        <Input
          placeholder="Other amount"
          type="number"
          min="1"
          step="1"
          value={custom}
          onChange={(e) => { setCustom(e.target.value); setAmount(null) }}
          className="max-w-xs"
        />
      </div>

      {/* Frequency */}
      <div className="mb-8">
        <p className="text-xs font-sans text-[var(--text-secondary)] uppercase tracking-wider mb-3">
          Frequency
        </p>
        <div className="flex gap-2">
          {[
            { value: false, label: "One time" },
            { value: true, label: "Monthly" },
          ].map((f) => (
            <button
              key={String(f.value)}
              onClick={() => setRecurring(f.value)}
              className={`border px-4 py-2 text-sm font-sans transition-colors ${
                recurring === f.value
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-red-600 mb-4 font-sans">{error}</p>}

      {stripePublishableKey ? (
        <Button size="lg" onClick={handleDonate} disabled={loading}>
          {loading
            ? "Redirecting..."
            : `Donate ${finalAmount ? `$${finalAmount}` : ""} ${recurring ? "/ month" : ""}`}
        </Button>
      ) : (
        <div className="border border-[var(--border)] p-4">
          <p className="text-sm font-sans text-[var(--text-secondary)]">
            Stripe is not configured. Add your Stripe keys to enable donations.
          </p>
        </div>
      )}
    </div>
  )
}
