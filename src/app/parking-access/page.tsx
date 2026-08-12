import type { ReactNode } from "react";
import { Car, DollarSign, MapPinned, MessageSquare, Phone } from "lucide-react";
import { CategoryResourcePage } from "@/components/CategoryResourcePage";
import { getResources } from "@/lib/data-access";

export const dynamic = "force-dynamic";

const PARKING_ACCESS_MAP_EMBED_URL = "https://www.google.com/maps/d/embed?mid=1C22zB6qJUbU4fOUCpCeDGanJZstzmKs&ehbc=2E312F";
const MOB_CITY_RIDES_PHONE_DISPLAY = "251-367-7433";
const MOB_CITY_RIDES_PHONE_LINK = "2513677433";

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
      <FeaturedVendor />
    </CategoryResourcePage>
  );
}

function ParkingAccessMap() {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist shadow-card">
      <div className="p-5">
        <div className="flex gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
            <MapPinned className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Downtown parking map</p>
            <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">Parking and access at a glance</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-parade-muted">
              Use this embedded map to preview downtown parking and access before heading to the parade route. The Downtown Parking Map link below opens the full map when needed.
            </p>
          </div>
        </div>
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

function FeaturedVendor() {
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-parade-gold/45 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-5 text-white shadow-card">
      <span className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-32 w-32 rounded-full bg-parade-gold/25 blur-2xl" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-[-4rem] left-[-4rem] h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow">
            <Car className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Featured vendor</p>
            <h2 className="mt-1 text-2xl font-black text-white">MOB City Rides</h2>
            <p className="mt-1 text-base font-black text-parade-goldBright">Golf Cart Shuttle</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-purple-100">
              Text or call for Mardi Gras shuttle service. Confirm pickup points, availability, and current service details directly with the vendor before making plans.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[32rem]">
          <VendorInfoCard icon={<Phone className="h-4 w-4" aria-hidden="true" />} label="Contact" value={MOB_CITY_RIDES_PHONE_DISPLAY} />
          <VendorInfoCard icon={<MessageSquare className="h-4 w-4" aria-hidden="true" />} label="Text or call" value="Available by phone" />
          <VendorInfoCard icon={<DollarSign className="h-4 w-4" aria-hidden="true" />} label="Rate" value="$5 per person / ride" />
        </div>
      </div>

      <div className="relative z-10 mt-5 flex flex-col gap-3 sm:flex-row">
        <a
          href={`tel:${MOB_CITY_RIDES_PHONE_LINK}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright"
        >
          Call MOB City Rides
          <Phone className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href={`sms:${MOB_CITY_RIDES_PHONE_LINK}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
        >
          Text MOB City Rides
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function VendorInfoCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/90 p-3 text-parade-purpleDark shadow-sm">
      <div className="flex items-center gap-2 text-parade-purple">
        {icon}
        <p className="text-[0.65rem] font-black uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-sm font-black leading-5">{value}</p>
    </div>
  );
}
