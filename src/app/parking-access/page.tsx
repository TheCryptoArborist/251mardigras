import { ExternalLink, MapPinned } from "lucide-react";
import { CategoryResourcePage } from "@/components/CategoryResourcePage";
import { getResources } from "@/lib/data-access";

export const dynamic = "force-dynamic";

const PARKING_ACCESS_MAP_EMBED_URL = "https://www.google.com/maps/d/embed?mid=1C22zB6qJUbU4fOUCpCeDGanJZstzmKs&ehbc=2E312F";
const PARKING_ACCESS_MAP_OPEN_URL = "https://www.google.com/maps/d/viewer?mid=1C22zB6qJUbU4fOUCpCeDGanJZstzmKs&ehbc=2E312F";

export default async function ParkingAccessPage() {
  const resources = (await getResources()).filter((resource) =>
    ["Downtown Transportation", "Mobility-Friendly Access"].includes(resource.category)
  );

  return (
    <CategoryResourcePage
      eyebrow="Get downtown"
      title="Parking and Access"
      description="Parking, transportation, downtown access, and mobility-friendly resources for Mobile Mardi Gras visitors. Start here when planning how to get downtown and where to go next."
      resources={resources}
      primaryHref="/resources"
      primaryAction="Open full visitor guide"
      resourceActionLabel="Open link"
      officialReminder="Parking, towing, road closures, public-safety instructions, and parade-day access should be verified through official City and public-safety sources before travel."
      showHeroQuickView={false}
    >
      <ParkingAccessMap />
    </CategoryResourcePage>
  );
}

function ParkingAccessMap() {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist shadow-card">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
            <MapPinned className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Downtown parking map</p>
            <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">Parking and access at a glance</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-parade-muted">
              Use this map to get a quick visual reference for downtown parking and access planning before heading to the parade route.
            </p>
          </div>
        </div>
        <a
          href={PARKING_ACCESS_MAP_OPEN_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-parade-purpleDark"
        >
          Open larger map <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <div className="border-t border-parade-gold/25 bg-white p-2">
        <iframe
          src={PARKING_ACCESS_MAP_EMBED_URL}
          title="Downtown Mobile parking and access map"
          className="h-[26rem] w-full rounded-[1.15rem] border-0 sm:h-[32rem]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
