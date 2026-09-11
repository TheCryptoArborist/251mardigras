import { CalendarDays, ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusPill } from "@/components/StatusPill";
import { getParades } from "@/lib/data-access";
import { formatDateTime } from "@/lib/format";

const OFFICIAL_2027_SCHEDULE_URL = "https://storymaps.arcgis.com/stories/aa1969cf3b68462a8676acdfb4839ad4";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const parades = await getParades();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeader
        title="2027 Mobile Mardi Gras Parade Schedule"
        description="The official City of Mobile parade schedule and route StoryMap is embedded below. Parade dates, start times, routes, closures, and public-safety details can change, so verify the official source before making plans."
      />

      <section className="mb-6 overflow-hidden rounded-[1.65rem] border border-parade-gold/45 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-4 text-white shadow-card sm:p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow ring-1 ring-white/20">
              <CalendarDays className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Official schedule source</p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-white">City of Mobile Parade Schedule and Routes</h2>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-purple-100 sm:text-base">
                Use the embedded StoryMap to view the released 2027 schedule and route information directly from the official source.
              </p>
            </div>
          </div>
          <a
            href={OFFICIAL_2027_SCHEDULE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-parade-gold/55 bg-parade-gold px-4 py-2.5 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright sm:w-auto"
          >
            Open official schedule <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.35rem] border border-parade-gold/35 bg-white shadow-civic">
          <iframe
            title="City of Mobile 2027 Mardi Gras parade schedule and routes"
            src={OFFICIAL_2027_SCHEDULE_URL}
            className="h-[72vh] min-h-[640px] w-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>

        <p className="mt-3 text-xs font-semibold leading-5 text-purple-100/90">
          MG251 is not the official parade authority. This embedded schedule is provided as a convenience and should be verified through the City of Mobile source above.
        </p>
      </section>

      {parades.length > 0 ? (
        <section aria-labelledby="schedule-cards-heading">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-purple">MG251 schedule cards</p>
              <h2 id="schedule-cards-heading" className="mt-1 text-2xl font-black text-parade-ink">
                Parade listings
              </h2>
            </div>
            <p className="max-w-2xl text-sm font-semibold leading-6 text-parade-muted">
              These cards are formatted for quick browsing. The official StoryMap above remains the source for the released schedule and routes.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {parades.map((parade) => (
              <article key={parade.id} className="rounded border border-parade-line bg-white p-5 shadow-civic">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-6 w-6 text-parade-purple" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-parade-ink">{parade.name}</h3>
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
        </section>
      ) : (
        <section className="rounded-[1.35rem] border border-parade-line bg-white p-5 shadow-civic">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-purple">Schedule cards</p>
          <h2 className="mt-2 text-2xl font-black text-parade-ink">Official StoryMap is live above</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-parade-muted">
            Individual MG251 parade cards will be added after the StoryMap details are transcribed and checked. For now, visitors can use the official embedded schedule and the direct official-source button above.
          </p>
        </section>
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
