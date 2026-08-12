import Image from "next/image";
import { Mail, MapPinned, MessageSquare, Phone } from "lucide-react";
import { CategoryResourcePage } from "@/components/CategoryResourcePage";
import { getResources } from "@/lib/data-access";

export const dynamic = "force-dynamic";

const PARKING_ACCESS_MAP_EMBED_URL = "https://www.google.com/maps/d/embed?mid=1C22zB6qJUbU4fOUCpCeDGanJZstzmKs&ehbc=2E312F";
const MOB_CITY_RIDES_LOGO_PATH = "/images/parking-access/mob%20city%20rides.jpg";
const MOB_CITY_RIDES_PHONE_DISPLAY = "251-367-7433";
const MOB_CITY_RIDES_PHONE_LINK = "2513677433";
const MOB_CITY_RIDES_EMAIL = "mobcityrides@gmail.com";

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

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-[1.35rem] border border-parade-gold/50 bg-white p-2 shadow-glow sm:h-28 sm:w-28">
          <Image
            src={MOB_CITY_RIDES_LOGO_PATH}
            alt="MOB City Rides logo"
            width={112}
            height={112}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Featured vendor</p>
          <h2 className="mt-1 text-3xl font-black text-white">MOB City Rides</h2>
          <p className="mt-1 text-base font-black text-parade-goldBright">Golf Cart Shuttle</p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
            Mardi Gras golf cart shuttle service is available by text or call at {MOB_CITY_RIDES_PHONE_DISPLAY}. Rides are $5 per person / ride. Confirm pickup points, availability, and current service details directly with the vendor before making plans.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`tel:${MOB_CITY_RIDES_PHONE_LINK}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright"
            >
              Call
              <Phone className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={`sms:${MOB_CITY_RIDES_PHONE_LINK}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              Text
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={`mailto:${MOB_CITY_RIDES_EMAIL}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              Email
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
