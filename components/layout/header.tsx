"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { List, X, User, BookOpen, MagnifyingGlass, Heart } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/pillars", label: "Courses" },
  { href: "/reading-plans", label: "Reading Plans" },
  { href: "/live-classes", label: "Live Classes" },
  { href: "/glossary", label: "Glossary" },
  { href: "/ask-a-priest", label: "Ask a Priest" },
  { href: "/donate", label: "Donate" },
]

export function Header() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)]"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-base font-normal tracking-wide text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
        >
          Orthodox Faith School
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors uppercase tracking-wider"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/profile"
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                <User size={18} weight="thin" />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors uppercase tracking-wider"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors uppercase tracking-wider"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-xs font-sans px-3 py-1.5 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#F5F1EA] transition-colors uppercase tracking-wider"
              >
                Begin
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} weight="thin" /> : <List size={20} weight="thin" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-[var(--border)] py-4 px-6 flex flex-col gap-4"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-[var(--border)] pt-4 flex flex-col gap-3">
            {session ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    signOut({ callbackUrl: "/" })
                  }}
                  className="text-sm font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-sans text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-sans text-[var(--accent)]"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
