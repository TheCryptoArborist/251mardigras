import Image from "next/image";
import { Accessibility, CalendarCheck, ExternalLink, Mail, MapPinned, MessageSquare, Phone } from "lucide-react";
import { CategoryResourcePage } from "@/components/CategoryResourcePage";
import { getResources } from "@/lib/data-access";

export const dynamic = "force-dynamic";

const PARKING_ACCESS_MAP_URL = "https://experience.arcgis.com/experience/f88d505ba3894e7ab1115d162d62839b";
const MOB_CITY_RIDES_LOGO_PATH = "/images/parking-access/mob%20city%20rides.jpg";
const MOB_CITY_RIDES_PHONE_DISPLAY = "251-367-7433";
const MOB_CITY_RIDES_PHONE_LINK = "2513677433";
const MOB_CITY_RIDES_EMAIL = "mobcityrides@gmail.com";
const CITY_PARKING_GUIDE_URL = "https://www.cityofmobile.gov/mardi-gras-parade-parking/";
const CITY_GENERAL_GUIDE_URL = "https://www.cityofmobile.gov/mardi-gras-general-information/";
const CITY_HELP_URL = "https://www.cityofmobile.gov/services/311/";

export default async function ParkingAccessPage() {
  const resources = (await getResources()).filter((resource) =>
    ["Downtown Transportation", "Mobility-Friendly Access"].includes(resource.category)
  );

  return (
    <CategoryResourcePage
      eyebrow="Get downtown"
      title="Parking"
      description="Find downtown parking maps, transportation contacts, and official sources to plan your Mardi Gras visit. Check the season status below before relying on parade-day details."
      resources={resources}
      primaryHref="/"
      primaryAction="Back to Home"
      resourceActionLabel="Open link"
      officialReminder="Parking, towing, road closures, public-safety instructions, and parade-day access should be verified through official City and public-safety sources before travel."
      showHeroQuickView={false}
    >
      <SeasonPlanningStatus />
      <ParkingAccessMap />
      <AccessibilityPlanning />
      <FeaturedVendor />
    </CategoryResourcePage>
  );
}

function SeasonPlanningStatus() {
  return (
    <section className="rounded-[1.5rem] border border-parade-gold/50 bg-parade-goldSoft p-5 shadow-card">
      <div className="flex items-start gap-3">
        <CalendarCheck className="mt-0.5 h-6 w-6 shrink-0 text-parade-purple" aria-hidden="true" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-parade-purple">2027 season • verification pending</p>
          <h2 className="mt-1 text-xl font-black text-parade-purpleDark">Plan locations now; recheck parade-day rules before you go</h2>
          <p className="mt-3 text-sm leading-6 text-parade-ink">
            The City parking page still included dates from the previous season when we reviewed it on October 20, 2026. MG251 has not yet verified 2027 road closures, towing arrangements, seasonal parking rates, or shuttle service.
          </p>
          <p className="mt-2 text-sm leading-6 text-parade-muted">The map below is a general downtown parking resource. It does not confirm that a space will be open or accessible during a particular parade.</p>
          <a href={CITY_PARKING_GUIDE_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white hover:bg-parade-purpleDark">
            Check City parking updates <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-3 text-xs font-semibold text-parade-muted">Source reviewed <time dateTime="2026-10-20">October 20, 2026</time></p>
        </div>
      </div>
    </section>
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
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">General downtown map • City of Mobile</p>
            <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">Downtown parking at a glance</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-parade-muted">
              Explore the City of Mobile&apos;s official map of downtown street parking, public lots, and garages. Open the full map for the best experience on a phone.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-parade-gold/25 bg-white p-2">
        <iframe
          src={PARKING_ACCESS_MAP_URL}
          title="Official City of Mobile downtown public parking map"
          className="h-[26rem] w-full rounded-[1.15rem] border-0 sm:h-[32rem]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="flex justify-center px-2 pb-2 pt-4">
          <a
            href={PARKING_ACCESS_MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-sm transition hover:-translate-y-0.5 hover:bg-parade-goldBright sm:w-auto"
          >
            Open Full Parking Map
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function AccessibilityPlanning() {
  return (
    <section className="rounded-[1.5rem] border border-parade-gold/35 bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <Accessibility className="mt-0.5 h-6 w-6 shrink-0 text-parade-purple" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-black text-parade-purpleDark">Planning an accessible visit</h2>
          <p className="mt-3 text-sm leading-6 text-parade-muted">Verified 2027 information about accessible parade viewing, parking, and shuttle accommodations is not yet available on MG251. Contact the City or your venue about step-free access, restrooms, drop-off points, and any assistance you need.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={CITY_GENERAL_GUIDE_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white hover:bg-parade-purpleDark">
              City visitor information <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={CITY_HELP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-parade-purple/30 px-4 py-2 text-sm font-black text-parade-purple hover:bg-parade-purpleSoft">
              Ask Mobile 311 <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
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
          <h2 className="text-3xl font-black text-white">MOB City Rides</h2>
          <p className="mt-1 text-base font-black text-parade-goldBright">Golf Cart Shuttle</p>
          <p className="mt-3 inline-flex rounded-full border border-parade-gold/40 bg-white/10 px-3 py-1.5 text-xs font-bold text-parade-goldBright">2027 service and fares: confirm with vendor</p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
            Contact MOB City Rides by text or call at {MOB_CITY_RIDES_PHONE_DISPLAY} for current fares, service dates, pickup points, and availability. Ask the vendor directly about vehicle accessibility and accommodations before booking.
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
