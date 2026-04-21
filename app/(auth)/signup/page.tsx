"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const JURISDICTION_OPTIONS = [
  { value: "NOT_SURE", label: "Not sure yet" },
  { value: "OCA", label: "Orthodox Church in America (OCA)" },
  { value: "GOARCH", label: "Greek Orthodox Archdiocese (GOARCH)" },
  { value: "ANTIOCHIAN", label: "Antiochian Orthodox" },
  { value: "ROCOR", label: "Russian Orthodox Church Outside Russia (ROCOR)" },
  { value: "SERBIAN", label: "Serbian Orthodox Church" },
  { value: "ROMANIAN", label: "Romanian Orthodox Church" },
  { value: "BULGARIAN", label: "Bulgarian Orthodox Church" },
]

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    track: "INQUIRER",
    jurisdiction: "NOT_SURE",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Registration failed.")
        setLoading(false)
        return
      }
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      router.push("/pillars")
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/pillars" })
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-light text-[var(--text-primary)] text-center mb-2" style={{ letterSpacing: "0.02em" }}>
        Create an account
      </h1>
      <p className="text-xs font-sans text-[var(--text-secondary)] text-center mb-8">
        Free. No card required.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
          autoComplete="name"
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />

        {/* Track choice */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-sans text-[var(--text-secondary)] uppercase tracking-wider">
            Your track
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "INQUIRER", label: "Inquirer", desc: "Exploring Orthodoxy" },
              { value: "CATECHUMEN", label: "Catechumen", desc: "Preparing for chrismation" },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => update("track", t.value)}
                className={`border p-3 text-left transition-colors ${
                  form.track === t.value
                    ? "border-[var(--accent)] bg-[var(--bg-card)]"
                    : "border-[var(--border)]"
                }`}
              >
                <p className={`text-xs font-sans font-medium ${form.track === t.value ? "text-[var(--accent)]" : "text-[var(--text-primary)]"}`}>
                  {t.label}
                </p>
                <p className="text-xs font-sans text-[var(--text-secondary)] mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <Select
          label="Jurisdiction (optional)"
          options={JURISDICTION_OPTIONS}
          value={form.jurisdiction}
          onChange={(e) => update("jurisdiction", e.target.value)}
        />

        {error && <p className="text-xs text-red-600 font-sans">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border)]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 font-sans text-[var(--text-secondary)]" style={{ backgroundColor: "var(--bg)" }}>
            or
          </span>
        </div>
      </div>

      <Button type="button" variant="secondary" className="w-full mb-6" onClick={handleGoogle}>
        Continue with Google
      </Button>

      <p className="text-xs font-sans text-[var(--text-secondary)] text-center">
        Already have an account?{" "}
        <Link href="/login" className="link-accent">
          Sign in
        </Link>
      </p>
    </div>
  )
}
