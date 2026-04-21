import Link from "next/link"

export function Footer() {
  return (
    <footer
      className="border-t border-[var(--border)] mt-auto"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8 justify-between">
        <div className="max-w-xs">
          <p className="font-serif text-sm text-[var(--text-primary)] mb-2">
            Orthodox Faith School
          </p>
          <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed">
            A free, donation-supported platform for learning the fundamentals of
            the Orthodox Christian faith. No content is paywalled.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-xs font-sans">
          <div className="flex flex-col gap-2">
            <p className="text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              Learn
            </p>
            <Link href="/pillars" className="link-accent text-[var(--text-secondary)]">
              Courses
            </Link>
            <Link href="/reading-plans" className="link-accent text-[var(--text-secondary)]">
              Reading Plans
            </Link>
            <Link href="/live-classes" className="link-accent text-[var(--text-secondary)]">
              Live Classes
            </Link>
            <Link href="/glossary" className="link-accent text-[var(--text-secondary)]">
              Glossary
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              Community
            </p>
            <Link href="/ask-a-priest" className="link-accent text-[var(--text-secondary)]">
              Ask a Priest
            </Link>
            <Link href="/donate" className="link-accent text-[var(--text-secondary)]">
              Support the School
            </Link>
            <Link href="/signup" className="link-accent text-[var(--text-secondary)]">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] py-4 px-6">
        <p className="max-w-5xl mx-auto text-xs font-sans text-[var(--text-secondary)] text-center">
          Orthodox Faith School · Pan-Orthodox, non-denominational · Content used with attribution from public-domain and openly-licensed sources
        </p>
      </div>
    </footer>
  )
}
