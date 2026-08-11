import {
  Accessibility,
  Archive,
  Car,
  ExternalLink,
  PlayCircle,
  Share2,
  ShoppingBag,
  Utensils
} from "lucide-react";
import { ResourceDirectoryBrowser } from "@/components/ResourceDirectoryBrowser";
import { SectionHeader } from "@/components/SectionHeader";
import { getResources, type ResourceItem } from "@/lib/data-access";
import { groupBy } from "@/lib/format";

export const dynamic = "force-dynamic";

const categoryIcons: Record<string, React.ReactNode> = {
  "Social Media": <Share2 className="h-5 w-5" aria-hidden="true" />,
  "Live Coverage / Channel Support": <PlayCircle className="h-5 w-5" aria-hidden="true" />,
  "Downtown Transportation": <Car className="h-5 w-5" aria-hidden="true" />,
  "Mobility-Friendly Access": <Accessibility className="h-5 w-5" aria-hidden="true" />,
  "Food and Drink": <Utensils className="h-5 w-5" aria-hidden="true" />,
  "Mardi Gras Gear / Throws": <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
  "Previous Parade Seasons": <Archive className="h-5 w-5" aria-hidden="true" />
};

const primaryResourceTitles = [
  "Current livestream",
  "YouTube channel",
  "Need Mobility-Friendly Mardi Gras Access? Click Here",
  "City of Mobile Parking and Transportation Guide",
  "Downtown Parking Map"
];

const planningLanes = [
  {
    title: "Watch and follow",
    description: "Live coverage, replays, the YouTube channel, and social links in one place.",
    categories: ["Social Media", "Live Coverage / Channel Support"]
  },
  {
    title: "Get downtown",
    description: "Parking, transportation, and mobility-friendly access resources for parade-day planning.",
    categories: ["Downtown Transportation", "Mobility-Friendly Access"]
  },
  {
    title: "Make a day of it",
    description: "Food, drink, gear, throws, and past-season videos grouped for quick scanning.",
    categories: ["Food and Drink", "Mardi Gras Gear / Throws", "Previous Parade Seasons"]
  }
];

export default async function ResourcesPage() {
  const resources = await getResources();
  const grouped = groupBy(resources, (resource) => resource.category);
  const primaryResources = primaryResourceTitles
    .map((title) => resources.find((resource) => resource.title === title))
    .filter((resource): resource is ResourceItem => Boolean(resource));

  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <p className="inline-flex rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright shadow-glow">
            Visitor resources
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Find the Mardi Gras links you need
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-purple-100">
            Direct links for live coverage, replays, social channels, parking, access support, food, gear, and past parade seasons. Pick what you need and go straight to the source.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {primaryResources.length > 0 ? (
          <section>
            <SectionHeader
              title="Start Here"
              description="The most useful links for watching, getting downtown, and planning around parade day."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {primaryResources.map((resource) => (
                <FeaturedResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <SectionHeader
            title="Plan By Need"
            description="Choose the type of help you need, then open the direct resource link."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {planningLanes.map((lane) => (
              <PlanningLane
                key={lane.title}
                title={lane.title}
                description={lane.description}
                resources={lane.categories.flatMap((category) => grouped[category] ?? [])}
              />
            ))}
          </div>
        </section>

        <section id="all-resources">
          <SectionHeader
            title="All Resources"
            description="Every published visitor link, grouped for easier scanning."
          />
          <ResourceDirectoryBrowser resources={resources} />
        </section>
      </div>
    </div>
  );
}

function FeaturedResourceCard({ resource }: { resource: ResourceItem }) {
  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist p-5 shadow-card transition hover:-translate-y-1 hover:shadow-glow">
      <span className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
          {categoryIcons[resource.category] ?? <ExternalLink className="h-5 w-5" aria-hidden="true" />}
        </div>
        <p className="text-xs font-black uppercase text-parade-muted">{resource.category}</p>
      </div>
      <h3 className="relative z-10 text-lg font-black text-parade-purpleDark">{resource.title}</h3>
      <p className="relative z-10 mt-2 flex-1 text-sm leading-6 text-parade-muted">{resource.description}</p>
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className="relative z-10 mt-5 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white transition group-hover:bg-parade-purpleDark"
      >
        Open resource <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </article>
  );
}

function PlanningLane({ title, description, resources }: { title: string; description: string; resources: ResourceItem[] }) {
  const previewResources = resources.slice(0, 5);

  return (
    <article className="min-w-0 rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 shadow-card">
      <h3 className="text-xl font-black text-parade-purpleDark">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-parade-muted">{description}</p>
      <div className="mt-4 space-y-2">
        {previewResources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-parade-gold/20 bg-white/75 px-3 py-2 text-sm font-semibold text-parade-ink transition hover:bg-parade-goldSoft"
          >
            <span className="min-w-0 truncate">{resource.title}</span>
            <ExternalLink className="h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" />
          </a>
        ))}
      </div>
    </article>
  );
}
