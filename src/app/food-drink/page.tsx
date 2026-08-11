import { Download, MapPinned } from "lucide-react";
import { CategoryResourcePage } from "@/components/CategoryResourcePage";
import { FoodStopSelector } from "@/components/FoodStopSelector";
import { getResources } from "@/lib/data-access";

export const dynamic = "force-dynamic";

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
                <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Google My Maps import</p>
                <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">Build a downtown food map</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-parade-muted">
                  Download the food and drink location CSV, then import it into Google My Maps using the Location column for placemarks and Name as the title.
                </p>
              </div>
            </div>
            <a
              href="/imports/food-drink-google-my-maps.csv"
              download
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright"
            >
              Download map CSV
              <Download className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
        <FoodStopSelector resources={resources} />
      </div>
    </div>
  );
}
