import { prisma } from "@/lib/prisma"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Glossary" }

export default async function GlossaryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  let terms: any[] = []
  try {
    terms = await prisma.glossaryTerm.findMany({
      where: q
        ? {
            OR: [
              { term: { contains: q, mode: "insensitive" } },
              { definition: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { term: "asc" },
    })
  } catch {}

  const letters = Array.from(
    new Set(terms.map((t: any) => t.term[0].toUpperCase()))
  ).sort() as string[]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <p className="small-caps text-xs text-[var(--text-secondary)] tracking-widest mb-6">
        Reference
      </p>
      <h1
        className="font-serif text-3xl font-light text-[var(--text-primary)] mb-4"
        style={{ letterSpacing: "0.02em" }}
      >
        Glossary
      </h1>
      <p className="text-sm font-sans text-[var(--text-secondary)] mb-8 max-w-lg">
        Orthodox terms used throughout the courses. Terms in lesson text link
        directly to these entries.
      </p>

      {/* Search */}
      <form className="mb-10">
        <div className="flex border border-[var(--border)] overflow-hidden">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search terms..."
            className="flex-1 px-4 py-2 text-sm font-sans bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 border-l border-[var(--border)] text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Letter nav */}
      {!q && letters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {letters.map((l: string) => (
            <a
              key={l}
              href={`#${l}`}
              className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors w-6 text-center"
            >
              {l}
            </a>
          ))}
        </div>
      )}

      {terms.length === 0 ? (
        <p className="text-sm font-sans text-[var(--text-secondary)]">
          {q ? `No terms found for "${q}".` : "No glossary terms yet. Seed the database to populate."}
        </p>
      ) : (
        <div>
          {letters.map((letter: string) => {
            const group = terms.filter(
              (t: any) => t.term[0].toUpperCase() === letter
            )
            if (group.length === 0) return null
            return (
              <div key={letter} id={letter} className="mb-10">
                <p className="font-serif text-xs text-[var(--text-secondary)] mb-4 small-caps tracking-widest">
                  {letter}
                </p>
                <div className="divide-y divide-[var(--border)]">
                  {group.map((term: any) => (
                    <div key={term.id} className="py-5">
                      <h2 className="font-serif text-lg font-normal text-[var(--text-primary)] mb-2">
                        {term.term}
                      </h2>
                      <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed mb-3">
                        {term.definition}
                      </p>
                      {term.relatedTerms?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs font-sans text-[var(--text-secondary)]">
                            Related:
                          </span>
                          {term.relatedTerms.map((rt: string) => (
                            <Link
                              key={rt}
                              href={`/glossary?q=${encodeURIComponent(rt)}`}
                              className="text-xs font-sans link-accent"
                            >
                              {rt}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
