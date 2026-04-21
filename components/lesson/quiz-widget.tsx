"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { QuizQuestion } from "@/types"
import { CheckCircle, XCircle } from "@phosphor-icons/react"

interface QuizWidgetProps {
  questions: QuizQuestion[]
  lessonId: string
  onComplete?: (score: number) => void
}

export function QuizWidget({ questions, lessonId, onComplete }: QuizWidgetProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  function select(questionId: string, idx: number) {
    if (submitted) return
    setAnswers((a) => ({ ...a, [questionId]: idx }))
  }

  function submit() {
    if (Object.keys(answers).length < questions.length) return
    const score = questions.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length
    setSubmitted(true)
    onComplete?.(score)
    fetch("/api/progress/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, score, total: questions.length }),
    }).catch(() => {})
  }

  const score = submitted
    ? questions.filter((q) => answers[q.id] === q.correctIndex).length
    : null

  return (
    <div className="border border-[var(--border)]">
      <div className="border-b border-[var(--border)] px-5 py-3">
        <p className="small-caps text-xs text-[var(--text-secondary)] tracking-wider">
          Review questions
        </p>
      </div>
      <div className="p-5 flex flex-col gap-8">
        {questions.map((q, qi) => {
          const userAnswer = answers[q.id]
          const correct = q.correctIndex

          return (
            <div key={q.id}>
              <p className="text-sm font-sans text-[var(--text-primary)] mb-3 font-medium">
                {qi + 1}. {q.question}
              </p>
              <div className="flex flex-col gap-2">
                {q.options.map((option, oi) => {
                  const selected = userAnswer === oi
                  const isCorrect = submitted && oi === correct
                  const isWrong = submitted && selected && oi !== correct

                  return (
                    <button
                      key={oi}
                      onClick={() => select(q.id, oi)}
                      disabled={submitted}
                      className={cn(
                        "text-left px-4 py-2.5 border text-sm font-sans transition-colors",
                        !submitted && !selected && "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]",
                        !submitted && selected && "border-[var(--accent)] text-[var(--text-primary)] bg-[var(--bg-card)]",
                        isCorrect && "border-green-700 text-green-800 bg-green-50",
                        isWrong && "border-red-700 text-red-800 bg-red-50"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {isCorrect && <CheckCircle size={14} weight="thin" />}
                        {isWrong && <XCircle size={14} weight="thin" />}
                        {option}
                      </span>
                    </button>
                  )
                })}
              </div>
              {submitted && q.explanation && (
                <p className="mt-3 text-xs font-sans text-[var(--text-secondary)] italic border-l border-[var(--border)] pl-3">
                  {q.explanation}
                </p>
              )}
            </div>
          )
        })}

        {!submitted ? (
          <Button
            onClick={submit}
            disabled={Object.keys(answers).length < questions.length}
          >
            Submit answers
          </Button>
        ) : (
          <div className="border border-[var(--border)] px-5 py-4 text-sm font-sans text-[var(--text-primary)]">
            {score === questions.length
              ? `All ${score} correct.`
              : `${score} of ${questions.length} correct.`}
            {score! >= Math.ceil(questions.length * 0.6)
              ? " Well done."
              : " Review the explanations above and re-read the lesson."}
          </div>
        )}
      </div>
    </div>
  )
}
