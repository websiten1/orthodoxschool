export type Track = "INQUIRER" | "CATECHUMEN"
export type Jurisdiction =
  | "OCA"
  | "GOARCH"
  | "ANTIOCHIAN"
  | "ROCOR"
  | "SERBIAN"
  | "ROMANIAN"
  | "BULGARIAN"
  | "NOT_SURE"
export type UserRole = "USER" | "PRIEST" | "EDITOR" | "ADMIN"
export type LessonStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED"
export type QuestionStatus = "PENDING" | "APPROVED" | "ANSWERED" | "ARCHIVED"

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface JurisdictionNotes {
  OCA?: string
  GOARCH?: string
  ANTIOCHIAN?: string
  ROCOR?: string
  SERBIAN?: string
  ROMANIAN?: string
  BULGARIAN?: string
}

export interface ReadingPlanDay {
  day: number
  title: string
  scripture?: string
  fathersReading?: string
  reflection: string
}
