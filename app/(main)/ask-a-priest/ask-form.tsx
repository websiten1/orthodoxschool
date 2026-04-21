"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function AskForm() {
  const [question, setQuestion] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return
    setStatus("sending")
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })
      setStatus(res.ok ? "sent" : "error")
      if (res.ok) setQuestion("")
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm font-sans text-[var(--text-primary)]">
        Your question has been received. A priest will respond when they are able.
        Thank you for your patience.
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Textarea
        label="Your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What would you like to ask?"
        className="min-h-[120px]"
        required
      />
      <p className="text-xs font-sans text-[var(--text-secondary)]">
        Your name will not be shown publicly. The question text itself will appear
        in the archive once answered.
      </p>
      {status === "error" && (
        <p className="text-xs text-red-600 font-sans">
          Something went wrong. Please try again.
        </p>
      )}
      <Button type="submit" disabled={!question.trim() || status === "sending"}>
        {status === "sending" ? "Sending..." : "Submit question"}
      </Button>
    </form>
  )
}
