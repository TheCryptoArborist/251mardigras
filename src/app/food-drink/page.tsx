import { Download, ExternalLink, MapPinned } from "lucide-react";
import { CategoryResourcePage } from "@/components/CategoryResourcePage";
import { FoodStopSelector } from "@/components/FoodStopSelector";
import { getResources } from "@/lib/data-access";

export const dynamic = "force-dynamic";

const FOOD_DRINK_MAP_EMBED_URL = "https://www.google.com/maps/d/embed?mid=1pI3gA2FXFcvtCvK9KYfehhBO2aTb0a4&ehbc=2E312F";
const FOOD_DRINK_MAP_VIEW_URL = "https://www.google.com/maps/d/viewer?mid=1pI3gA2FXFcvtCvK9KYfehhBO2aTb0a4";

export default async function FoodDrinkPage() {
  const resources = (await getResources()).filter((resource) => resource.category === "Food and Drink");

  return (
    <div>
      <CategoryResourcePage
        eyebrow="Downtown stops"
        title="Food and Drink"
        description="Restaurants, coffee shops, bakeries, breweries, barbecue, dessert stops, and direct map or venue links for people walking or driving downtown during Mardi Gras."
        resources={resources}
        primaryHref={null}
        primaryAction={null}
        resourceActionLabel="Open / navigate"
        officialReminder="Hours, reservations, road access, and parade-day availability can change quickly. Confirm details with the venue and verify road closures or safety instructions with official sources."
        showHeroQuickView={false}
        showResourceSection={false}
      />
      <div className="mx-auto max-w-5xl space-y-6 px-4 pb-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist p-5 shadow-card">
          <span className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright shadow-civic ring-1 ring-parade-gold/40">
                <MapPinned className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Downtown food map</p>
                <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">See food and drink stops at a glance</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-parade-muted">
                  Use the embedded Google My Map to see how downtown stops are grouped before you head to the parade route. Use the navigator below for direct venue links and directions.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
              <a
                href={FOOD_DRINK_MAP_VIEW_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-purple px-5 py-3 text-sm font-black text-white shadow-civic transition hover:-translate-y-0.5 hover:bg-parade-purpleDark"
              >
                Open larger map
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/imports/food-drink-google-my-maps.csv"
                download
                className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright"
              >
                Download map CSV
                <Download className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="relative z-10 mt-5 overflow-hidden rounded-[1.25rem] border border-parade-gold/30 bg-parade-purpleDark/10 shadow-civic">
            <iframe
              src={FOOD_DRINK_MAP_EMBED_URL}
              title="Mardi Gras Mobile Food and Drink Map"
              className="h-[360px] w-full border-0 sm:h-[430px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <p className="relative z-10 mt-3 text-xs font-semibold leading-5 text-parade-muted">
            Map pins are visitor convenience resources. Confirm hours, access, reservations, and parade-day availability with each venue before making plans.
          </p>
        </section>
        <FoodStopSelector resources={resources} />
      </div>
    </div>
  );
}
