"use client"

import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

interface DiscussionPost {
  id: string
  body: string
  createdAt: string
  user: { name: string | null; image: string | null }
  replies?: DiscussionPost[]
}

export function DiscussionThread({
  lessonId,
  initialDiscussions,
}: {
  lessonId: string
  initialDiscussions: DiscussionPost[]
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [discussions, setDiscussions] = useState(initialDiscussions)
  const [body, setBody] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyBody, setReplyBody] = useState("")
  const [isPending, startTransition] = useTransition()

  async function postComment(parentId?: string) {
    const text = parentId ? replyBody : body
    if (!text.trim()) return
    const res = await fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, body: text, parentId }),
    })
    if (res.ok) {
      if (parentId) {
        setReplyBody("")
        setReplyTo(null)
      } else {
        setBody("")
      }
      startTransition(() => router.refresh())
    }
  }

  return (
    <div className="pb-16">
      <h2 className="font-serif text-lg font-normal text-[var(--text-primary)] mb-6">
        Discussion
      </h2>

      {session ? (
        <div className="mb-8">
          <Textarea
            label="Share a thought or question"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What is on your mind?"
          />
          <Button
            className="mt-3"
            onClick={() => postComment()}
            disabled={!body.trim() || isPending}
          >
            Post
          </Button>
        </div>
      ) : (
        <div className="border border-[var(--border)] p-4 mb-8">
          <p className="text-sm font-sans text-[var(--text-secondary)]">
            <Link href="/login" className="link-accent">
              Sign in
            </Link>{" "}
            to join the discussion.
          </p>
        </div>
      )}

      {discussions.length === 0 ? (
        <p className="text-sm font-sans text-[var(--text-secondary)]">
          No comments yet. Be the first.
        </p>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {discussions
            .filter((d) => !(d as any).parentId)
            .map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                session={session}
                replyTo={replyTo}
                replyBody={replyBody}
                onSetReplyTo={setReplyTo}
                onReplyBodyChange={setReplyBody}
                onPostReply={(id) => postComment(id)}
                isPending={isPending}
              />
            ))}
        </div>
      )}
    </div>
  )
}

function CommentItem({
  comment,
  session,
  replyTo,
  replyBody,
  onSetReplyTo,
  onReplyBodyChange,
  onPostReply,
  isPending,
  depth = 0,
}: {
  comment: any
  session: any
  replyTo: string | null
  replyBody: string
  onSetReplyTo: (id: string | null) => void
  onReplyBodyChange: (v: string) => void
  onPostReply: (id: string) => void
  isPending: boolean
  depth?: number
}) {
  return (
    <div className={`py-5 ${depth > 0 ? "pl-6 border-l border-[var(--border)]" : ""}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-sans font-medium text-[var(--text-primary)]">
          {comment.user?.name ?? "Anonymous"}
        </span>
        <span className="text-xs font-sans text-[var(--text-secondary)]">
          {formatDate(comment.createdAt)}
        </span>
      </div>
      <p className="text-sm font-sans text-[var(--text-primary)] leading-relaxed mb-3">
        {comment.body}
      </p>
      {session && depth < 2 && (
        <button
          onClick={() =>
            onSetReplyTo(replyTo === comment.id ? null : comment.id)
          }
          className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          Reply
        </button>
      )}
      {replyTo === comment.id && (
        <div className="mt-3">
          <Textarea
            value={replyBody}
            onChange={(e) => onReplyBodyChange(e.target.value)}
            placeholder="Your reply..."
            className="min-h-[70px]"
          />
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              onClick={() => onPostReply(comment.id)}
              disabled={!replyBody.trim() || isPending}
            >
              Reply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSetReplyTo(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {comment.replies?.map((reply: any) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          session={session}
          replyTo={replyTo}
          replyBody={replyBody}
          onSetReplyTo={onSetReplyTo}
          onReplyBodyChange={onReplyBodyChange}
          onPostReply={onPostReply}
          isPending={isPending}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}
