import {
  Accessibility,
  Archive,
  Car,
  ExternalLink,
  PlayCircle,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Utensils
} from "lucide-react";
import { ResourceDirectoryBrowser } from "@/components/ResourceDirectoryBrowser";
import { SectionHeader } from "@/components/SectionHeader";
import { getResources, type ResourceItem } from "@/lib/data-access";
import { groupBy } from "@/lib/format";
import { linktreeCategoryHighlights, linktreeProfile, resourceCurationPrinciples } from "@/lib/seed-data";

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
    description: "Use these links for live video, the public channel archive, and current social destinations.",
    categories: ["Social Media", "Live Coverage / Channel Support"]
  },
  {
    title: "Get downtown",
    description: "Start with parking, transportation, and access resources for parade-day planning.",
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
      <section className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-12">
          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright shadow-glow">
              Visitor resource guide
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
              Mobile Mardi Gras Resource Guide
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-purple-100">
              A direct-link visitor directory for Mobile Mardi Gras live coverage, social channels, parking, access support, food, gear, and past parade seasons. The goal is to send visitors straight to the resource they need.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/watch" className="inline-flex items-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright">
                Watch live coverage
              </a>
              <a href="#all-resources" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15">
                Browse all resources
              </a>
            </div>
          </div>
          <div className="relative z-10 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-parade-goldBright">Resource directory</p>
            <h2 className="mt-2 text-2xl font-black text-white">{linktreeProfile.title}</h2>
            <p className="mt-3 text-sm leading-6 text-purple-100">{linktreeProfile.tagline}</p>
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
            description="Highest-use direct links pulled forward from the resource inventory for quick visitor planning."
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

        <section className="rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-black text-parade-purpleDark">Curated directory, not a raw link dump</h2>
              <p className="mt-2 text-sm leading-6 text-parade-muted">
                The website keeps a legacy cache of imported quick links, but only selected resources are published here. The public directory should stay focused on Mobile Mardi Gras visitors instead of displaying every imported discount, affiliate, or unrelated offer.
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-parade-muted">
                {resourceCurationPrinciples.map((principle) => (
                  <li key={principle} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-parade-gold" aria-hidden="true" />
                    <span>{principle}</span>
                  </li>
                ))}
              </ul>
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
              <article key={item.title} className="rounded-[1.25rem] border border-parade-gold/30 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-4 shadow-card">
                <h3 className="text-sm font-black text-parade-purpleDark">{item.title}</h3>
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
          <ResourceDirectoryBrowser resources={resources} />
        </section>
      </div>
    </div>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/90 p-3">
      <p className="text-2xl font-black text-parade-purpleDark">{value}</p>
      <p className="mt-1 text-xs font-black uppercase text-parade-muted">{label}</p>
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
      <p className="mt-4 inline-flex rounded-full border border-parade-gold/35 bg-white/75 px-3 py-1 text-xs font-black uppercase text-parade-purple">{resources.length} resources</p>
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
