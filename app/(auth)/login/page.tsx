"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError("Invalid email or password.")
    } else {
      router.push(callbackUrl)
    }
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl })
  }

  return (
    <div>
      <h1
        className="font-serif text-2xl font-light text-[var(--text-primary)] text-center mb-8"
        style={{ letterSpacing: "0.02em" }}
      >
        Sign in
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && <p className="text-xs text-red-600 font-sans">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border)]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span
            className="px-3 font-sans text-[var(--text-secondary)]"
            style={{ backgroundColor: "var(--bg)" }}
          >
            or
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full mb-6"
        onClick={handleGoogle}
      >
        Continue with Google
      </Button>

      <p className="text-xs font-sans text-[var(--text-secondary)] text-center">
        No account yet?{" "}
        <Link href="/signup" className="link-accent">
          Create one — it is free.
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
