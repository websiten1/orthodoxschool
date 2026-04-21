import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { LessonViewer } from "@/components/lesson/lesson-viewer"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonSlug: string }>
}): Promise<Metadata> {
  const { lessonSlug } = await params
  const lesson = await prisma.lesson.findUnique({ where: { slug: lessonSlug } })
  return { title: lesson?.title ?? "Lesson" }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; courseId: string; lessonSlug: string }>
}) {
  const { slug, courseId, lessonSlug } = await params
  const session = await auth()

  const lesson = await prisma.lesson.findUnique({
    where: { slug: lessonSlug },
    include: {
      quiz: true,
      course: {
        include: {
          pillar: true,
          lessons: {
            where: { status: "PUBLISHED" },
            orderBy: { order: "asc" },
          },
        },
      },
      discussions: {
        where: { status: "published", parentId: null },
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { name: true, image: true } },
          replies: {
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  })

  if (!lesson || lesson.status !== "PUBLISHED") notFound()

  const isCompleted = session?.user
    ? !!(await prisma.progress.findUnique({
        where: { userId_lessonId: { userId: session.user.id!, lessonId: lesson.id } },
      }))
    : false

  const allLessons = lesson.course.lessons
  const currentIdx = allLessons.findIndex((l) => l.id === lesson.id)
  const prevLesson =
    currentIdx > 0
      ? { ...allLessons[currentIdx - 1], courseId: lesson.courseId }
      : null
  const nextLesson =
    currentIdx < allLessons.length - 1
      ? { ...allLessons[currentIdx + 1], courseId: lesson.courseId }
      : null

  const quizData = lesson.quiz
    ? { questions: lesson.quiz.questions as any }
    : null

  return (
    <LessonViewer
      lesson={{
        ...lesson,
        jurisdictionNotes: lesson.jurisdictionNotes as any,
      }}
      pillarSlug={slug}
      courseId={courseId}
      quiz={quizData}
      discussions={lesson.discussions as any}
      userJurisdiction={(session?.user as any)?.jurisdiction}
      completed={isCompleted}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      pillarTitle={lesson.course.pillar.title}
      courseTitle={lesson.course.title}
      lessonOrder={lesson.order}
    />
  )
}
