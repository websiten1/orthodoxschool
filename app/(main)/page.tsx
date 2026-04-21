import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/ui/progress-bar"

const PILLARS_OVERVIEW = [
  { slug: "scripture-and-tradition", icon: "I", title: "Scripture & Holy Tradition", desc: "How Orthodoxy reads the Bible within the living Tradition; canon, typology, the Fathers as interpreters." },
  { slug: "liturgy-and-sacraments", icon: "II", title: "Liturgy & the Sacraments", desc: "The Divine Liturgy walked through step by step; the seven sacraments of the Church." },
  { slug: "church-history", icon: "III", title: "Church History", desc: "Apostolic succession through the seven Councils; the Great Schism; modern Orthodoxy." },
  { slug: "theology", icon: "IV", title: "Theology", desc: "Trinity, Christology, the Incarnation, theosis, essence and energies, apophaticism." },
  { slug: "saints-icons-veneration", icon: "V", title: "Saints, Icons & Veneration", desc: "Theology of the icon, the communion of saints, the Theotokos, relics." },
  { slug: "prayer-and-fasting", icon: "VI", title: "Prayer Life & Fasting", desc: "The Jesus Prayer, daily rule, prayer rope, the fasting seasons, almsgiving." },
  { slug: "early-church-fathers", icon: "VII", title: "The Early Church Fathers", desc: "Guided readings from Ignatius, Athanasius, the Cappadocians, Chrysostom, Maximus, Damascene." },
]

export default async function HomePage() {
  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <p className="small-caps text-xs text-[var(--text-secondary)] tracking-widest mb-6">
          Orthodox Faith School
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-[var(--text-primary)] leading-tight mb-6 max-w-2xl" style={{ letterSpacing: "0.01em" }}>
          The foundations of the Orthodox Christian faith, taught with care.
        </h1>
        <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl mb-10">
          Free to use, donation-supported. Whether you are exploring Orthodoxy for the first time
          or preparing for chrismation, these courses walk through the seven pillars of the faith
          at your own pace.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/signup">
            <Button size="lg">Begin your journey</Button>
          </Link>
          <Link href="/pillars">
            <Button size="lg" variant="secondary">Browse courses</Button>
          </Link>
        </div>
      </section>

      <hr className="ornament max-w-3xl mx-auto px-6" />

      {/* Two tracks */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="font-serif text-2xl font-light text-[var(--text-primary)] mb-2" style={{ letterSpacing: "0.02em" }}>
          Two tracks, one tradition
        </h2>
        <p className="text-sm font-sans text-[var(--text-secondary)] mb-8 max-w-lg">
          Choose the track that fits where you are. You can switch at any time.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-[var(--border)] p-6">
            <p className="small-caps text-xs text-[var(--accent)] mb-3">Inquirer</p>
            <h3 className="font-serif text-lg font-normal text-[var(--text-primary)] mb-3">
              Curious about Orthodoxy
            </h3>
            <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed">
              A gentler pace for those exploring the tradition. Each lesson begins with
              the question "what is this and why does it matter?" No commitment assumed.
            </p>
          </div>
          <div className="border border-[var(--accent)] p-6">
            <p className="small-caps text-xs text-[var(--accent)] mb-3">Catechumen</p>
            <h3 className="font-serif text-lg font-normal text-[var(--text-primary)] mb-3">
              Preparing for chrismation
            </h3>
            <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed">
              Deeper and more formational for those who have made the decision to pursue
              reception into the Church. Assumes commitment; integrates practice.
            </p>
          </div>
        </div>
      </section>

      {/* Seven pillars */}
      <section
        className="py-14 border-t border-[var(--border)]"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-2xl font-light text-[var(--text-primary)] mb-2" style={{ letterSpacing: "0.02em" }}>
            Seven pillars of the faith
          </h2>
          <p className="text-sm font-sans text-[var(--text-secondary)] mb-8 max-w-lg">
            Each pillar is a course of six to ten lessons. Pillars may be explored in any order.
          </p>
          <div className="divide-y divide-[var(--border)]">
            {PILLARS_OVERVIEW.map((p) => (
              <Link
                key={p.slug}
                href={`/pillars/${p.slug}`}
                className="flex gap-6 py-5 group hover:text-[var(--accent)] transition-colors"
              >
                <span className="font-serif text-xs text-[var(--text-secondary)] pt-1 w-6 shrink-0 group-hover:text-[var(--accent)] transition-colors">
                  {p.icon}
                </span>
                <div>
                  <p className="font-serif text-base font-normal text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-1">
                    {p.title}
                  </p>
                  <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Ask a Priest",
              desc: "Submit questions to a moderated queue. Answered thoughtfully by clergy. Responses become a searchable archive.",
              href: "/ask-a-priest",
            },
            {
              title: "Reading Plans",
              desc: "Structured plans combining Scripture, the Fathers, and the catechism. Check off each day, leave a brief reflection.",
              href: "/reading-plans",
            },
            {
              title: "Glossary",
              desc: "Every Orthodox term that appears in a lesson links here. Browse or search over fifty entries.",
              href: "/glossary",
            },
          ].map((f) => (
            <div key={f.title} className="flex flex-col gap-2">
              <Link href={f.href} className="font-serif text-base font-normal text-[var(--text-primary)] link-accent">
                {f.title}
              </Link>
              <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Donation strip */}
      <section className="border-t border-[var(--border)] py-12">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-xl font-light text-[var(--text-primary)] mb-1">
              Kept free by people who find it valuable
            </h2>
            <p className="text-xs font-sans text-[var(--text-secondary)]">
              No paywalls, ever. A small donation keeps the lights on.
            </p>
          </div>
          <Link href="/donate">
            <Button variant="secondary">Support this work</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
