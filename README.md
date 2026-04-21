# Orthodox Faith School

A free, donation-supported learning platform teaching the fundamentals of the Orthodox Christian faith, with particular care for learners coming from Protestant backgrounds.

Built with Next.js 16 (App Router), TypeScript, Prisma, PostgreSQL, NextAuth v5, Tailwind CSS v4, and Stripe.

---

## Features

- **Two learning tracks** — Inquirer (exploring Orthodoxy) and Catechumen (preparing for chrismation)
- **Seven-pillar curriculum** — Scripture & Tradition, Liturgy, Church History, Theology, Saints & Icons, Prayer & Fasting, Church Fathers
- **Lesson player** — text, video embed, audio player, quiz, discussion thread, mark-complete, sequential navigation
- **Progress tracking** — per-pillar and overall completion percentage
- **Glossary** — 50+ Orthodox terms, searchable
- **Ask a Priest** — moderated Q&A queue with public archive
- **Reading Plans** — structured plans combining Scripture, Fathers, and catechism with daily check-off and reflection
- **Live Classes** — calendar of upcoming sessions with recording archive
- **Donations** — Stripe checkout (one-time and monthly), never gates content
- **Jurisdiction notes** — sidebar callouts for OCA, GOARCH, Antiochian, ROCOR, Serbian, Romanian, Bulgarian
- **Protestant-background asides** — collapsible sections in lessons framed as "you may be wondering..."
- **Google OAuth + email/password auth**
- **Fully seeded** — Scripture & Holy Tradition pillar seeded in both tracks with real, cited source material

---

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted — Supabase or Neon recommended)

### 1. Clone and install

```bash
git clone https://github.com/websiten1/orthodoxschool.git
cd orthodox-faith-school
npm install
```

### 2. Configure environment variables

Edit `.env` with your values:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/orthodox_faith_school"

# NextAuth — generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe (optional — leave blank to show a placeholder)
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

### 3. Set up the database

```bash
# Push the schema (development)
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with content
npm run db:seed
```

The seed populates:
- All 7 pillars
- Full Scripture & Holy Tradition pillar — 5 Inquirer + 2 Catechumen lessons with quizzes
- 50+ glossary terms with related-term links
- 40-day "Gospel of John with Chrysostom" reading plan
- One upcoming live class (stub)

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repository in Vercel
3. Add all environment variables in the Vercel dashboard
4. After first deploy, run `npx prisma migrate deploy` and `npm run db:seed` (via Vercel CLI or a one-off shell)

### Recommended database hosts

- **Neon** (neon.tech) — serverless Postgres, free tier, native Vercel integration
- **Supabase** (supabase.com) — Postgres + extras, free tier

---

## Project structure

```
app/
  (auth)/            # Login and signup (no header/footer)
  (main)/            # Main pages with header/footer
    page.tsx         # Home
    pillars/         # Pillar list → course → lesson viewer
    glossary/        # Searchable glossary
    ask-a-priest/    # Q&A submit + archive
    reading-plans/   # Reading plan list + detail
    live-classes/    # Upcoming and past sessions
    donate/          # Stripe donation page
    profile/         # Progress dashboard + settings
  api/               # Route handlers

components/
  layout/            # Header, footer
  lesson/            # Lesson viewer, quiz, discussion, jurisdiction note
  providers/         # NextAuth session provider
  ui/                # Button, Input, Select, Card, Badge, ProgressBar, Textarea

lib/
  auth.ts            # NextAuth v5 config
  prisma.ts          # Prisma client singleton
  utils.ts           # Shared utilities

prisma/
  schema.prisma      # Full data model
  seed.ts            # Seed script with real lesson content
```

---

## Content & licensing notes

All seeded lesson content uses real, properly attributed sources:

- Fr. Georges Florovsky, *Bible, Church, Tradition* (1972) — cited
- Metropolitan Kallistos Ware, *The Orthodox Church* (1993) — cited
- Fr. John Behr, *The Way to Nicaea* (2001) — cited
- St. John Chrysostom, Homilies — public domain
- St. Theophan the Recluse (via published translation) — cited

**Licensing note:** Extended reproduction of Ware, Schmemann, or Hopko requires publisher permission. The seed uses only brief citations for commentary purposes. Patristic texts from newadvent.org and tertullian.org are public domain.

---

## Ask-a-Priest: operational notes

The feature collects questions into a moderation queue visible via Prisma Studio or a future admin UI. **Do not launch publicly without real clergy committed to answering.** An unanswered queue is worse than no feature at all.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (production) |
| `npm run db:seed` | Seed database with content |
| `npm run db:studio` | Open Prisma Studio |
