import Link from "next/link";
import {
  Accessibility,
  Archive,
  ArrowRight,
  Car,
  ExternalLink,
  MapPinned,
  PlayCircle,
  Share2,
  ShoppingBag,
  Utensils
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { getResources, type ResourceItem } from "@/lib/data-access";
import { groupBy } from "@/lib/format";

export const dynamic = "force-dynamic";

const categoryOrder = [
  "Live Coverage / Channel Support",
  "Social Media",
  "Mobility-Friendly Access",
  "Downtown Transportation",
  "Food and Drink",
  "Mardi Gras Gear / Throws",
  "Previous Parade Seasons"
];

const priorityTitles = [
  "Current livestream",
  "YouTube channel",
  "Become a Channel Supporter",
  "Facebook",
  "Instagram",
  "TikTok",
  "X",
  "Need Mobility-Friendly Mardi Gras Access? Click Here",
  "City of Mobile Parking and Transportation Guide",
  "Downtown Parking Map",
  "Port City Throws",
  "Mardi Gras 2025 Playlist"
];

const categoryDescriptions: Record<string, string> = {
  "Live Coverage / Channel Support": "Livestream, YouTube channel, supporter link, and video archive resources.",
  "Social Media": "Direct social channel destinations for Mardi Gras - Mobile, AL.",
  "Mobility-Friendly Access": "Access-support resources. Verify parade schedules and public-safety guidance with official sources.",
  "Downtown Transportation": "Parking, transportation, and downtown access planning links.",
  "Food and Drink": "Downtown food and drink stops that visitors commonly look for during parade season.",
  "Mardi Gras Gear / Throws": "Throws, gear, and Mardi Gras shopping resources.",
  "Previous Parade Seasons": "Prior-year Mobile Mardi Gras coverage and playlists."
};

const categoryIcons: Record<string, React.ReactNode> = {
  "Live Coverage / Channel Support": <PlayCircle className="h-5 w-5" aria-hidden="true" />,
  "Social Media": <Share2 className="h-5 w-5" aria-hidden="true" />,
  "Mobility-Friendly Access": <Accessibility className="h-5 w-5" aria-hidden="true" />,
  "Downtown Transportation": <Car className="h-5 w-5" aria-hidden="true" />,
  "Food and Drink": <Utensils className="h-5 w-5" aria-hidden="true" />,
  "Mardi Gras Gear / Throws": <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
  "Previous Parade Seasons": <Archive className="h-5 w-5" aria-hidden="true" />
};

export default async function LinksPage() {
  const resources = await getResources();
  const grouped = groupBy(resources, (resource) => resource.category);
  const priorityResources = priorityTitles
    .map((title) => resources.find((resource) => resource.title === title))
    .filter((resource): resource is ResourceItem => Boolean(resource));

  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Mobile quick links</p>
          <h1 className="mt-2 text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">
            Mardi Gras - Mobile, AL
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-parade-muted sm:text-lg">
            Direct links for livestreams, social channels, parking, mobility-friendly access, food, gear, and previous Mobile Mardi Gras coverage.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/watch" className="inline-flex items-center justify-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark">
              Watch Live <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/resources" className="inline-flex items-center justify-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
              Open Full Resource Guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <SectionHeader
            title="Start Here"
            description="The fastest links for people arriving from social media, QR codes, or shared posts."
          />
          <div className="space-y-3">
            {priorityResources.map((resource) => (
              <QuickLink key={resource.id} resource={resource} featured />
            ))}
          </div>
        </section>

        <section className="rounded border border-amber-200 bg-parade-goldSoft p-5 text-left">
          <div className="flex items-start gap-3">
            <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-black text-amber-950">Unofficial-source reminder</h2>
              <p className="mt-2 text-sm leading-6 text-amber-950">
                This page is a visitor convenience directory. Parade schedules, routes, cancellations, road closures, parking rules, towing, public-safety instructions, and weather impacts should be verified through official City, public-safety, parade organization, and National Weather Service sources.
              </p>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            title="Browse By Need"
            description="Direct destination links grouped for quick mobile scanning."
          />
          <div className="space-y-5">
            {categoryOrder.map((category) => {
              const items = grouped[category] ?? [];
              if (items.length === 0) {
                return null;
              }

              return (
                <QuickCategory key={category} category={category} resources={items} />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickCategory({ category, resources }: { category: string; resources: ResourceItem[] }) {
  return (
    <section className="min-w-0 rounded border border-parade-line bg-white p-4 shadow-civic">
      <div className="mb-3 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded bg-parade-purpleSoft text-parade-purple">
          {categoryIcons[category] ?? <ExternalLink className="h-5 w-5" aria-hidden="true" />}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-black text-parade-ink">{category}</h2>
          <p className="mt-1 text-sm leading-6 text-parade-muted">{categoryDescriptions[category]}</p>
        </div>
      </div>
      <div className="space-y-2">
        {resources.map((resource) => (
          <QuickLink key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  );
}

function QuickLink({ resource, featured = false }: { resource: ResourceItem; featured?: boolean }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className={`flex min-w-0 items-center justify-between gap-3 rounded border border-parade-line bg-white px-4 py-3 text-left text-sm font-bold text-parade-ink transition hover:bg-parade-purpleSoft ${featured ? "shadow-civic" : ""}`}
    >
      <span className="min-w-0">
        <span className="block truncate">{resource.title}</span>
        {featured ? <span className="mt-1 block truncate text-xs font-semibold uppercase text-parade-muted">{resource.category}</span> : null}
      </span>
      <ExternalLink className="h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" />
    </a>
  );
}
