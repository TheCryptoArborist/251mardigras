import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  ExternalLink,
  HeartHandshake,
  Landmark,
  MapPinned,
  PlayCircle,
  Share2,
  ShoppingBag,
  Utensils
} from "lucide-react";
import { getResources, type ResourceItem } from "@/lib/data-access";

export const dynamic = "force-dynamic";

const categoryPages = [
  {
    slug: "parade-coverage",
    title: "Parade Coverage",
    eyebrow: "Watch first",
    description: "Live coverage, YouTube channel access, and previous parade-season replays.",
    categories: ["Live Coverage / Channel Support", "Previous Parade Seasons"],
    icon: <PlayCircle className="h-5 w-5" aria-hidden="true" />,
    primaryHref: "/watch",
    primaryAction: "Open Watch Live page"
  },
  {
    slug: "support",
    title: "Support",
    eyebrow: "Support the channel",
    description: "Choose YouTube, Facebook, or Buy Me a MoonPie to support Mardi Gras - Mobile, Alabama coverage, videos, and community event updates.",
    categories: ["Support"],
    icon: <HeartHandshake className="h-5 w-5" aria-hidden="true" />,
    primaryHref: "/",
    primaryAction: "Back to homepage"
  },
  {
    slug: "food-drink",
    title: "Food and Drink",
    eyebrow: "Downtown stops",
    description: "Restaurants, coffee, bakeries, breweries, dessert stops, and direct map or venue links for people walking or driving downtown.",
    categories: ["Food and Drink"],
    icon: <Utensils className="h-5 w-5" aria-hidden="true" />,
    primaryHref: "/resources#food-and-drink-navigator",
    primaryAction: "Open food navigator"
  },
  {
    slug: "parking-access",
    title: "Parking and Access",
    eyebrow: "Get downtown",
    description: "Parking, transportation, downtown access, and mobility-friendly visitor resources. Verify official rules before travel.",
    categories: ["Downtown Transportation", "Mobility-Friendly Access"],
    icon: <Car className="h-5 w-5" aria-hidden="true" />,
    primaryHref: "/resources",
    primaryAction: "Open visitor guide"
  },
  {
    slug: "history-culture",
    title: "History & Culture",
    eyebrow: "Mobile Mardi Gras history",
    description: "Mobile Carnival Museum and culture resources for visitors who want to learn more about Mobile Carnival history, mystic society traditions, costumes, artifacts, and Mardi Gras culture.",
    categories: ["History & Culture"],
    icon: <Landmark className="h-5 w-5" aria-hidden="true" />,
    primaryHref: "/resources",
    primaryAction: "Open full resource guide"
  },
  {
    slug: "social-channels",
    title: "Social Channels",
    eyebrow: "Follow along",
    description: "Direct social destinations for Mardi Gras - Mobile, AL.",
    categories: ["Social Media"],
    icon: <Share2 className="h-5 w-5" aria-hidden="true" />,
    primaryHref: "/watch",
    primaryAction: "Open coverage hub"
  },
  {
    slug: "gear-throws",
    title: "Gear and Throws",
    eyebrow: "Mardi Gras shopping",
    description: "Throws, gear, and selected shopping resources for Mobile Mardi Gras visitors.",
    categories: ["Mardi Gras Gear / Throws"],
    icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
    primaryHref: "/resources",
    primaryAction: "Open full guide"
  }
];

type LinksCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function LinksCategoryPage({ params }: LinksCategoryPageProps) {
  const { category } = await params;
  const page = categoryPages.find((item) => item.slug === category);

  if (!page) {
    notFound();
  }

  const resources = await getResources();
  const pageResources = resources.filter((resource) => page.categories.includes(resource.category));

  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/links" className="inline-flex items-center gap-2 text-sm font-bold text-parade-purple hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Quick Links
          </Link>
          <div className="mt-6 flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded bg-parade-goldSoft text-parade-gold">
              {page.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">{page.eyebrow}</p>
              <h1 className="mt-1 text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">{page.title}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-parade-muted sm:text-lg">{page.description}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={page.primaryHref} className="inline-flex items-center justify-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark">
              {page.primaryAction} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/resources" className="inline-flex items-center justify-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
              Open Full Resource Guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {pageResources.length > 0 ? (
          <section className="space-y-3">
            {pageResources.map((resource) => (
              <CategoryResourceLink key={resource.id} resource={resource} />
            ))}
          </section>
        ) : (
          <section className="rounded border border-dashed border-parade-line bg-parade-purpleSoft p-5 text-sm leading-6 text-parade-muted">
            No direct resources are currently published in this category. Use the full resource guide for the latest available links.
          </section>
        )}

        <section className="rounded border border-amber-200 bg-parade-goldSoft p-5">
          <div className="flex items-start gap-3">
            <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-amber-950">
              <span className="font-black">Unofficial visitor resource.</span>{" "}
              Verify parade schedules, routes, cancellations, road closures, parking rules, towing, public-safety instructions, and weather impacts with official sources.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function CategoryResourceLink({ resource }: { resource: ResourceItem }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="flex min-w-0 items-center justify-between gap-3 rounded border border-parade-line bg-white px-4 py-3 text-left shadow-civic transition hover:bg-parade-purpleSoft"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-black text-parade-ink">{resource.title}</span>
        <span className="mt-1 block truncate text-xs font-semibold uppercase text-parade-muted">{resource.category}</span>
      </span>
      <ExternalLink className="h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" />
    </a>
  );
}
