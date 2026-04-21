export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <a href="/" className="font-serif text-lg font-light text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            Orthodox Faith School
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
