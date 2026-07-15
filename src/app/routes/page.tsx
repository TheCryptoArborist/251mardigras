import { Car, MapPinned, ShieldAlert } from "lucide-react";
import { ChangeHistoryTable } from "@/components/ChangeHistoryTable";
import { SectionHeader } from "@/components/SectionHeader";
import { SourceStatusCard } from "@/components/SourceStatusCard";
import { getPublicChanges, getSourceStatuses } from "@/lib/data-access";

export const dynamic = "force-dynamic";

export default async function RoutesPage() {
  const [sources, changes] = await Promise.all([getSourceStatuses(), getPublicChanges()]);
  const routeSources = sources.filter((source) => /route|storymap|mardi gras|parking|police|safety/i.test(`${source.name} ${source.sourceType}`));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeader
        title="Routes and Traffic"
        description="Official route links, route update history, road closure notes, parking, and towing alerts. Always verify travel decisions with official sources."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <RoutePanel
          icon={<MapPinned className="h-5 w-5" />}
          title="Official Route Links"
          body="The ArcGIS StoryMap and City Mardi Gras dashboard are monitored as source pages. Phase 2 should add route-specific parsing."
        />
        <RoutePanel
          icon={<Car className="h-5 w-5" />}
          title="Parking and Towing"
          body="Parking, transportation, and towing changes should be treated as high priority and displayed with source timestamps."
        />
        <RoutePanel
          icon={<ShieldAlert className="h-5 w-5" />}
          title="Public Safety"
          body="Police, fire, barricade, and emergency updates must be verified through official public-safety agencies."
        />
      </section>

      <section>
        <SectionHeader title="Monitored Route and Traffic Sources" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {routeSources.map((source) => (
            <SourceStatusCard key={source.id} source={source} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Route Update History" description="Unacknowledged high/medium changes from monitored sources." />
        <ChangeHistoryTable changes={changes} />
      </section>
    </div>
  );
}

function RoutePanel({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <article className="rounded border border-parade-line bg-white p-5 shadow-civic">
      <div className="grid h-10 w-10 place-items-center rounded bg-parade-purpleSoft text-parade-purple">{icon}</div>
      <h2 className="mt-4 text-xl font-bold text-parade-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-parade-muted">{body}</p>
    </article>
  );
}

