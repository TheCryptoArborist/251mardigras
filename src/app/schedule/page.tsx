import { CalendarDays, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusPill } from "@/components/StatusPill";
import { getParades } from "@/lib/data-access";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const parades = await getParades();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeader
        title="Parade Schedule"
        description="All parade dates, times, routes, status labels, source links, and last checked timestamps should be verified against official sources."
      />

      {parades.length === 0 ? (
        <EmptyState
          title="No verified schedule records yet"
          message="Phase 1 creates the database and page structure. Phase 2 should parse official schedule and route data from the City dashboard and ArcGIS StoryMap."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {parades.map((parade) => (
            <article key={parade.id} className="rounded border border-parade-line bg-white p-5 shadow-civic">
              <div className="flex items-start gap-3">
                <CalendarDays className="h-6 w-6 text-parade-purple" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-parade-ink">{parade.name}</h2>
                    <StatusPill tone="gold">{parade.status}</StatusPill>
                  </div>
                  <dl className="mt-4 grid gap-2 text-sm">
                    <Detail label="Date" value={parade.date} />
                    <Detail label="Start time" value={parade.startTime ?? "TBD"} />
                    <Detail label="Route" value={parade.routeName ?? "TBD"} />
                    <Detail label="Last updated" value={formatDateTime(parade.lastUpdatedAt)} />
                  </dl>
                  <a href={parade.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-parade-purple hover:underline">
                    Open source <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-parade-line pb-2 last:border-b-0">
      <dt className="text-parade-muted">{label}</dt>
      <dd className="text-right font-semibold text-parade-ink">{value}</dd>
    </div>
  );
}

