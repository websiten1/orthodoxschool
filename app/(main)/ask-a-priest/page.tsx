import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { AskForm } from "./ask-form"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Ask a Priest" }

export default async function AskAPriestPage() {
  const session = await auth()

  const answeredQuestions = await prisma.priestQuestion.findMany({
    where: { status: "ANSWERED", answer: { published: true } },
    orderBy: { askedAt: "desc" },
    include: {
      answer: {
        include: { priest: true },
      },
    },
    take: 20,
  })

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <p className="small-caps text-xs text-[var(--text-secondary)] tracking-widest mb-6">
        Community
      </p>
      <h1
        className="font-serif text-3xl font-light text-[var(--text-primary)] mb-4"
        style={{ letterSpacing: "0.02em" }}
      >
        Ask a Priest
      </h1>
      <p className="text-sm font-sans text-[var(--text-secondary)] mb-10 max-w-xl leading-relaxed">
        Submit a question to our moderated queue. Clergy answer thoughtfully and
        at their own pace. Answered questions become a public, searchable archive.
        Your name is not shown publicly unless you choose to include it.
      </p>

      {/* Submit form */}
      <div className="border border-[var(--border)] p-6 mb-14">
        <h2 className="font-serif text-lg font-normal text-[var(--text-primary)] mb-4">
          Submit a question
        </h2>
        {session ? (
          <AskForm />
        ) : (
          <p className="text-sm font-sans text-[var(--text-secondary)]">
            <a href="/login" className="link-accent">Sign in</a> to submit a question.
          </p>
        )}
      </div>

      {/* Archive */}
      <div>
        <h2 className="font-serif text-xl font-light text-[var(--text-primary)] mb-6">
          Archive of answered questions
        </h2>
        {answeredQuestions.length === 0 ? (
          <p className="text-sm font-sans text-[var(--text-secondary)]">
            No answered questions yet. Be the first to ask.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {answeredQuestions.map((q) => (
              <div key={q.id} className="py-8">
                <p className="font-serif text-base font-normal text-[var(--text-primary)] mb-4">
                  {q.question}
                </p>
                {q.answer && (
                  <div>
                    <div className="border-l border-[var(--border)] pl-5">
                      <p className="text-sm font-sans text-[var(--text-primary)] leading-relaxed mb-3 whitespace-pre-wrap">
                        {q.answer.answer}
                      </p>
                      <p className="text-xs font-sans text-[var(--text-secondary)]">
                        {q.answer.priest.name} · {q.answer.priest.jurisdiction} ·{" "}
                        {formatDate(q.answer.answeredAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
