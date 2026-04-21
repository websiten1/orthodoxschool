"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { JurisdictionNote } from "@/components/lesson/jurisdiction-note"
import { QuizWidget } from "@/components/lesson/quiz-widget"
import { DiscussionThread } from "@/components/lesson/discussion-thread"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, BookOpen } from "@phosphor-icons/react"
import type { JurisdictionNotes, QuizQuestion } from "@/types"

interface LessonViewerProps {
  lesson: {
    id: string
    title: string
    slug: string
    contentMdx: string
    videoUrl?: string | null
    audioUrl?: string | null
    readingAssignment?: string | null
    estimatedMinutes: number
    jurisdictionNotes?: JurisdictionNotes | null
  }
  pillarSlug: string
  courseId: string
  quiz?: { questions: QuizQuestion[] } | null
  discussions: any[]
  userJurisdiction?: string
  completed: boolean
  prevLesson?: { slug: string; title: string; courseId: string } | null
  nextLesson?: { slug: string; title: string; courseId: string } | null
  pillarTitle: string
  courseTitle: string
  lessonOrder: number
}

export function LessonViewer({
  lesson,
  pillarSlug,
  courseId,
  quiz,
  discussions,
  userJurisdiction,
  completed: initialCompleted,
  prevLesson,
  nextLesson,
  pillarTitle,
  courseTitle,
  lessonOrder,
}: LessonViewerProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [completed, setCompleted] = useState(initialCompleted)
  const [marking, setMarking] = useState(false)
  const [activeTab, setActiveTab] = useState<"lesson" | "discussion">("lesson")

  async function markComplete() {
    if (!session || completed) return
    setMarking(true)
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id }),
      })
      setCompleted(true)
      router.refresh()
    } finally {
      setMarking(false)
    }
  }

  return (
    <div className="fade-in">
      {/* Lesson header */}
      <div className="border-b border-[var(--border)] py-6 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <p className="small-caps text-xs text-[var(--text-secondary)] tracking-widest mb-2">
            Lesson {String(lessonOrder).padStart(2, "0")} · {courseTitle}
          </p>
          <h1
            className="font-serif text-2xl md:text-3xl font-light text-[var(--text-primary)] mb-4"
            style={{ letterSpacing: "0.02em" }}
          >
            {lesson.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-sans text-[var(--text-secondary)]">
              <Clock size={13} weight="thin" />
              {lesson.estimatedMinutes} min read
            </span>
            {lesson.audioUrl && (
              <span className="flex items-center gap-1.5 text-xs font-sans text-[var(--text-secondary)]">
                Audio version available
              </span>
            )}
            {completed && (
              <span className="flex items-center gap-1.5 text-xs font-sans text-[var(--accent)]">
                <CheckCircle size={13} weight="thin" />
                Completed
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-10">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border)] mb-10 mt-4">
          {(["lesson", "discussion"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 mr-8 text-xs font-sans uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? "text-[var(--text-primary)] border-b border-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab === "lesson" ? "Lesson" : `Discussion (${discussions.length})`}
            </button>
          ))}
        </div>

        {activeTab === "lesson" && (
          <>
            {/* Jurisdiction note */}
            {userJurisdiction &&
              userJurisdiction !== "NOT_SURE" &&
              lesson.jurisdictionNotes &&
              (lesson.jurisdictionNotes as any)[userJurisdiction] && (
                <JurisdictionNote
                  jurisdiction={userJurisdiction}
                  note={(lesson.jurisdictionNotes as any)[userJurisdiction]}
                />
              )}

            {/* Audio player */}
            {lesson.audioUrl && (
              <div className="mb-8 border border-[var(--border)] p-4">
                <p className="text-xs font-sans text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                  Audio version
                </p>
                <audio
                  controls
                  className="w-full"
                  src={lesson.audioUrl}
                  preload="none"
                />
              </div>
            )}

            {/* Video */}
            {lesson.videoUrl && (
              <div className="mb-8 aspect-video border border-[var(--border)]">
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={lesson.title}
                />
              </div>
            )}

            {/* Content */}
            <article
              className="prose-lesson mb-12"
              dangerouslySetInnerHTML={{ __html: lesson.contentMdx }}
            />

            {/* Reading assignment */}
            {lesson.readingAssignment && (
              <div className="border border-[var(--border)] p-5 mb-10">
                <p className="flex items-center gap-2 small-caps text-xs text-[var(--text-secondary)] tracking-wider mb-3">
                  <BookOpen size={14} weight="thin" />
                  Reading assignment
                </p>
                <p className="text-sm font-sans text-[var(--text-primary)] leading-relaxed">
                  {lesson.readingAssignment}
                </p>
              </div>
            )}

            {/* Quiz */}
            {quiz && quiz.questions.length > 0 && (
              <div className="mb-10">
                <QuizWidget
                  questions={quiz.questions}
                  lessonId={lesson.id}
                  onComplete={(score) => {
                    if (score >= quiz.questions.length * 0.6) markComplete()
                  }}
                />
              </div>
            )}

            {/* Mark complete */}
            {session && (
              <div className="py-8 border-t border-[var(--border)] flex justify-between items-center">
                {!completed ? (
                  <Button onClick={markComplete} disabled={marking}>
                    {marking ? "Saving..." : "Mark as complete"}
                  </Button>
                ) : (
                  <span className="flex items-center gap-2 text-sm font-sans text-[var(--accent)]">
                    <CheckCircle size={16} weight="thin" />
                    Marked complete
                  </span>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="py-8 border-t border-[var(--border)] flex justify-between gap-4">
              {prevLesson ? (
                <a
                  href={`/pillars/${pillarSlug}/${prevLesson.courseId}/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  <ArrowLeft size={14} weight="thin" />
                  <span>
                    <span className="block text-[10px] uppercase tracking-wider">Previous</span>
                    {prevLesson.title}
                  </span>
                </a>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <a
                  href={`/pillars/${pillarSlug}/${nextLesson.courseId}/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-right"
                >
                  <span>
                    <span className="block text-[10px] uppercase tracking-wider">Next</span>
                    {nextLesson.title}
                  </span>
                  <ArrowRight size={14} weight="thin" />
                </a>
              ) : (
                <div />
              )}
            </div>
          </>
        )}

        {activeTab === "discussion" && (
          <DiscussionThread
            lessonId={lesson.id}
            initialDiscussions={discussions}
          />
        )}
      </div>
    </div>
  )
}
