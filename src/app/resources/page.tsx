import {
  Accessibility,
  Archive,
  Car,
  ExternalLink,
  MapPinned,
  PlayCircle,
  Share2,
  ShoppingBag,
  Utensils
} from "lucide-react";
import { ResourceCard } from "@/components/ResourceCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getResources, type ResourceItem } from "@/lib/data-access";
import { groupBy } from "@/lib/format";
import { linktreeCategoryHighlights, linktreeProfile } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

const categoryOrder = [
  "Social Media",
  "Live Coverage / Channel Support",
  "Downtown Transportation",
  "Mobility-Friendly Access",
  "Food and Drink",
  "Mardi Gras Gear / Throws",
  "Previous Parade Seasons"
];

const categoryDescriptions: Record<string, string> = {
  "Social Media": "Direct public contact and social channel destinations maintained in the website resource directory.",
  "Live Coverage / Channel Support": "YouTube livestream, archive, and channel-support links for Mobile Mardi Gras coverage.",
  "Downtown Transportation": "Parking app, downtown parking, and City parking resources. Verify traffic, towing, and closures with official sources before travel.",
  "Mobility-Friendly Access": "Third-party access-support resources. These are convenience links and do not replace official parade or public-safety guidance.",
  "Food and Drink": "Downtown food and drink stops for parade visitors. Hours and parade-day access can change quickly.",
  "Mardi Gras Gear / Throws": "Throws, gear, and shopping resources collected for visitor planning.",
  "Previous Parade Seasons": "Past parade-season video resources and playlists from the Mobile Mardi Gras channel."
};

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
  "Downtown Parking Map",
  "Mardi Gras 2026 Parking Guide Mobile, Alabama"
];

const planningLanes = [
  {
    title: "Watch and follow",
    description: "Use these links for live video, the public channel archive, and current social/contact destinations.",
    categories: ["Social Media", "Live Coverage / Channel Support"]
  },
  {
    title: "Get downtown",
    description: "Start with parking and transportation resources, then verify road closures and towing rules with official sources.",
    categories: ["Downtown Transportation", "Mobility-Friendly Access"]
  },
  {
    title: "Make a day of it",
    description: "Food, drink, throws, gear, and past-season video links are grouped for visitors planning around the parade day.",
    categories: ["Food and Drink", "Mardi Gras Gear / Throws", "Previous Parade Seasons"]
  }
];

export default async function ResourcesPage() {
  const resources = await getResources();
  const grouped = groupBy(resources, (resource) => resource.category);
  const primaryResources = primaryResourceTitles
    .map((title) => resources.find((resource) => resource.title === title))
    .filter((resource): resource is ResourceItem => Boolean(resource));
  const totalCategoryCount = categoryOrder.filter((category) => (grouped[category] ?? []).length > 0).length;

  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <h1 className="max-w-3xl text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">
              Mobile Mardi Gras Resource Guide
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-parade-muted">
              A direct-link visitor directory for Mobile Mardi Gras live coverage, social channels, parking, access support, food, gear, and past parade seasons. The goal is to send visitors straight to the resource they need.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/watch" className="inline-flex items-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark">
                Watch live coverage
              </a>
              <a href="#all-resources" className="inline-flex items-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
                Browse all resources
              </a>
            </div>
          </div>
          <div className="rounded border border-parade-line bg-parade-purpleSoft p-5">
            <p className="text-sm font-bold uppercase text-parade-muted">Resource directory</p>
            <h2 className="mt-1 text-2xl font-black text-parade-ink">{linktreeProfile.title}</h2>
            <p className="mt-3 text-sm leading-6 text-parade-muted">{linktreeProfile.tagline}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <ProfileMetric label="Direct links" value={String(resources.length)} />
              <ProfileMetric label="Guide sections" value={String(totalCategoryCount)} />
              <ProfileMetric label="Built from" value={linktreeProfile.joined} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <SectionHeader
            title="Start Here"
            description="Highest-use direct links pulled forward from the resource inventory. These are convenience links, not official parade or public-safety decisions."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {primaryResources.map((resource) => (
              <FeaturedResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Plan By Need"
            description="Resource links reorganized around what visitors are usually trying to do."
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

        <section className="rounded border border-amber-200 bg-parade-goldSoft p-5">
          <div className="flex items-start gap-3">
            <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-black text-amber-950">Official-source reminder</h2>
              <p className="mt-2 text-sm leading-6 text-amber-950">
                Visitor resources are useful for planning and discovery, but parade schedules, routes, parking rules, towing, road closures, weather impacts, and emergency decisions should still be verified through official City, public-safety, and National Weather Service sources.
              </p>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            title="What The Directory Covers"
            description="A quick map of the resource categories maintained on the website."
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {linktreeCategoryHighlights.map((item) => (
              <article key={item.title} className="rounded border border-parade-line bg-white p-4 shadow-civic">
                <h3 className="text-sm font-bold text-parade-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-parade-muted">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="all-resources">
          <SectionHeader
            title="Full Resource Directory"
            description="Complete direct-link inventory, grouped into practical sections for easier scanning."
          />
          <div className="space-y-8">
            {categoryOrder.map((category) => {
              const items = grouped[category] ?? [];
              if (items.length === 0) {
                return null;
              }

              return (
                <ResourceCategorySection
                  key={category}
                  category={category}
                  description={categoryDescriptions[category]}
                  resources={items}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/70 bg-white p-3">
      <p className="text-2xl font-black text-parade-purple">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase text-parade-muted">{label}</p>
    </div>
  );
}

function FeaturedResourceCard({ resource }: { resource: ResourceItem }) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded border border-parade-line bg-white p-5 shadow-civic">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded bg-parade-goldSoft text-parade-gold">
          {categoryIcons[resource.category] ?? <ExternalLink className="h-5 w-5" aria-hidden="true" />}
        </div>
        <p className="text-xs font-bold uppercase text-parade-muted">{resource.category}</p>
      </div>
      <h3 className="text-lg font-black text-parade-ink">{resource.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-parade-muted">{resource.description}</p>
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-2 rounded bg-parade-purple px-4 py-2 text-sm font-bold text-white hover:bg-parade-purpleDark"
      >
        Open resource <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </article>
  );
}

function PlanningLane({ title, description, resources }: { title: string; description: string; resources: ResourceItem[] }) {
  const previewResources = resources.slice(0, 5);

  return (
    <article className="min-w-0 rounded border border-parade-line bg-white p-5 shadow-civic">
      <h3 className="text-xl font-black text-parade-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-parade-muted">{description}</p>
      <p className="mt-4 text-xs font-bold uppercase text-parade-muted">{resources.length} resources</p>
      <div className="mt-4 space-y-2">
        {previewResources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center justify-between gap-3 rounded border border-parade-line px-3 py-2 text-sm font-semibold text-parade-ink hover:bg-parade-purpleSoft"
          >
            <span className="min-w-0 truncate">{resource.title}</span>
            <ExternalLink className="h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" />
          </a>
        ))}
      </div>
    </article>
  );
}

function ResourceCategorySection({
  category,
  description,
  resources
}: {
  category: string;
  description: string;
  resources: ResourceItem[];
}) {
  const compactList = resources.length > 9;

  return (
    <section className="min-w-0 rounded border border-parade-line bg-white p-5 shadow-civic">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded bg-parade-purpleSoft text-parade-purple">
            {categoryIcons[category] ?? <ExternalLink className="h-5 w-5" aria-hidden="true" />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-parade-ink">{category}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-parade-muted">{description}</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded border border-parade-line px-3 py-1 text-xs font-bold uppercase text-parade-muted">
          {resources.length} links
        </span>
      </div>

      {compactList ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="flex min-w-0 items-center justify-between gap-3 rounded border border-parade-line px-3 py-2 text-sm font-semibold text-parade-ink hover:bg-parade-purpleSoft"
            >
              <span className="min-w-0 truncate">{resource.title}</span>
              <ExternalLink className="h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" />
            </a>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </section>
  );
}
