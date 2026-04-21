import { jurisdictionLabel } from "@/lib/utils"
import { Info } from "@phosphor-icons/react/dist/ssr"

export function JurisdictionNote({
  jurisdiction,
  note,
}: {
  jurisdiction: string
  note: string
}) {
  return (
    <aside className="border-l-2 border-[var(--accent)] pl-4 py-3 mb-8 bg-[var(--bg-card)]">
      <p className="flex items-center gap-2 small-caps text-xs text-[var(--accent)] tracking-wider mb-2">
        <Info size={13} weight="thin" />
        {jurisdictionLabel(jurisdiction)}
      </p>
      <p className="text-sm font-sans text-[var(--text-primary)] leading-relaxed">{note}</p>
    </aside>
  )
}
