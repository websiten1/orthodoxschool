import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function jurisdictionLabel(j: string): string {
  const map: Record<string, string> = {
    OCA: "Orthodox Church in America (OCA)",
    GOARCH: "Greek Orthodox Archdiocese (GOARCH)",
    ANTIOCHIAN: "Antiochian Orthodox",
    ROCOR: "Russian Orthodox Church Outside Russia (ROCOR)",
    SERBIAN: "Serbian Orthodox Church",
    ROMANIAN: "Romanian Orthodox Church",
    BULGARIAN: "Bulgarian Orthodox Church",
    NOT_SURE: "Not sure yet",
  }
  return map[j] ?? j
}

export function trackLabel(t: string): string {
  return t === "CATECHUMEN" ? "Catechumen" : "Inquirer"
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
