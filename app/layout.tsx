import type { Metadata } from "next"
import "./globals.css"
import { SessionProvider } from "@/components/providers/session-provider"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: {
    default: "Orthodox Faith School",
    template: "%s · Orthodox Faith School",
  },
  description:
    "A free, donation-supported platform teaching the fundamentals of the Orthodox Christian faith.",
  openGraph: {
    title: "Orthodox Faith School",
    description:
      "A free, donation-supported platform teaching the fundamentals of the Orthodox Christian faith.",
    type: "website",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col fade-in" style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
