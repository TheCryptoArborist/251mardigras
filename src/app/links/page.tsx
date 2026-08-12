import Link from "next/link";
import {
  ArrowRight,
  Car,
  CloudSun,
  ExternalLink,
  HeartHandshake,
  MapPinned,
  PlayCircle,
  Share2,
  ShoppingBag,
  Utensils
} from "lucide-react";
import { getResources } from "@/lib/data-access";

export const dynamic = "force-dynamic";

const quickLinkGroups = [
  {
    title: "Parade Coverage",
    description: "Live coverage, YouTube channel, and parade replays.",
    href: "/links/parade-coverage",
    categories: ["Live Coverage / Channel Support", "Previous Parade Seasons"],
    icon: <PlayCircle className="h-5 w-5" aria-hidden="true" />,
    action: "Open coverage links"
  },
  {
    title: "Support",
    description: "Choose YouTube, Facebook, or Buy Me a MoonPie to support Mardi Gras - Mobile, Alabama.",
    href: "/links/support",
    categories: ["Support"],
    icon: <HeartHandshake className="h-5 w-5" aria-hidden="true" />,
    action: "Support the channel"
  },
  {
    title: "Food and Drink",
    description: "Downtown restaurants, coffee, bakeries, breweries, dessert stops, and map links.",
    href: "/links/food-drink",
    categories: ["Food and Drink"],
    icon: <Utensils className="h-5 w-5" aria-hidden="true" />,
    action: "Find a downtown stop"
  },
  {
    title: "Parking and Access",
    description: "Parking, transportation, downtown access, and mobility-friendly planning resources.",
    href: "/links/parking-access",
    categories: ["Downtown Transportation", "Mobility-Friendly Access"],
    icon: <Car className="h-5 w-5" aria-hidden="true" />,
    action: "Plan your arrival"
  },
  {
    title: "Weather",
    description: "Weather-risk page for planning before and during parade coverage.",
    href: "/weather",
    categories: [],
    icon: <CloudSun className="h-5 w-5" aria-hidden="true" />,
    action: "Check weather"
  },
  {
    title: "Social Channels",
    description: "Follow Mardi Gras - Mobile, AL on YouTube, Facebook, Instagram, TikTok, X, and Snapchat.",
    href: "/links/social-channels",
    categories: ["Social Media"],
    icon: <Share2 className="h-5 w-5" aria-hidden="true" />,
    action: "Follow the channels"
  },
  {
    title: "Gear and Throws",
    description: "Mardi Gras gear, throws, and shopping resources selected for visitor planning.",
    href: "/links/gear-throws",
    categories: ["Mardi Gras Gear / Throws"],
    icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
    action: "Shop Mardi Gras"
  }
];

export default async function LinksPage() {
  const resources = await getResources();

  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Mobile quick links</p>
          <h1 className="mt-2 text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">
            Choose what you need.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-parade-muted sm:text-lg">
            This page replaces the old Linktree-style list with separated paths for parade coverage, support, food, parking, access, weather, social channels, and gear.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/watch" className="inline-flex items-center justify-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark">
              Watch Live <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/resources" className="inline-flex items-center justify-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
              Open Full Resource Guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickLinkGroups.map((group) => (
              <QuickLinkGroupCard
                key={group.title}
                title={group.title}
                description={group.description}
                href={group.href}
                icon={group.icon}
                action={group.action}
                count={countResourcesForCategories(resources, group.categories)}
              />
            ))}
          </div>
        </section>

        <section className="rounded border border-amber-200 bg-parade-goldSoft p-5 text-left">
          <div className="flex items-start gap-3">
            <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-black text-amber-950">Unofficial-source reminder</h2>
              <p className="mt-2 text-sm leading-6 text-amber-950">
                This is a visitor convenience directory. Parade schedules, routes, cancellations, road closures, parking rules, towing, public-safety instructions, and weather impacts should be verified through official City, public-safety, parade organization, and National Weather Service sources.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickLinkGroupCard({
  title,
  description,
  href,
  icon,
  action,
  count
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  action: string;
  count: number;
}) {
  return (
    <Link href={href} className="flex h-full min-w-0 flex-col rounded border border-parade-line bg-white p-5 shadow-civic transition hover:-translate-y-0.5 hover:bg-parade-purpleSoft">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded bg-parade-goldSoft text-parade-gold">
          {icon}
        </div>
        {count > 0 ? (
          <span className="rounded border border-parade-line bg-white px-2 py-1 text-xs font-bold uppercase text-parade-muted">
            {count} links
          </span>
        ) : null}
      </div>
      <h2 className="mt-4 text-xl font-black text-parade-ink">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-parade-muted">{description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-parade-purple">
        {action}
        {href.startsWith("/") ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : <ExternalLink className="h-4 w-4" aria-hidden="true" />}
      </span>
    </Link>
  );
}

function countResourcesForCategories(resources: Awaited<ReturnType<typeof getResources>>, categories: string[]) {
  if (categories.length === 0) {
    return 0;
  }

  return resources.filter((resource) => categories.includes(resource.category)).length;
}
