import Link from "next/link";
import { ArrowRight, Car, ExternalLink, MapPinned, PlayCircle, Share2, ShieldCheck, Utensils } from "lucide-react";
import { LiveStreamEmbed } from "@/components/LiveStreamEmbed";
import { SectionHeader } from "@/components/SectionHeader";
import { getResources, type ResourceItem } from "@/lib/data-access";

export const dynamic = "force-dynamic";

const primaryActions = [
  {
    icon: <PlayCircle className="h-5 w-5" aria-hidden="true" />,
    title: "Watch Live",
    body: "Open the live player, YouTube channel, supporter link, and previous parade coverage.",
    href: "/watch",
    action: "Go to Watch Live"
  },
  {
    icon: <Share2 className="h-5 w-5" aria-hidden="true" />,
    title: "Quick Links",
    body: "Use the mobile-first page built to replace Linktree for social bios, posts, and QR codes.",
    href: "/links",
    action: "Open Quick Links"
  },
  {
    icon: <Utensils className="h-5 w-5" aria-hidden="true" />,
    title: "Food and Drink",
    body: "Find downtown restaurants, coffee, bakeries, breweries, dessert stops, and map links fast.",
    href: "/resources#food-and-drink-navigator",
    action: "Find Food Nearby"
  },
  {
    icon: <Car className="h-5 w-5" aria-hidden="true" />,
    title: "Plan Your Day",
    body: "Parking, transportation, mobility-friendly access, throws, gear, and visitor resources.",
    href: "/resources",
    action: "Open Visitor Guide"
  }
];

const foodPreviewLimit = 8;

export default async function HomePage() {
  const resources = await getResources();
  const foodResources = resources.filter((resource) => resource.category === "Food and Drink");
  const featuredFoodResources = foodResources.slice(0, foodPreviewLimit);

  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Mobile Mardi Gras visitor hub</p>
            <h1 className="mt-2 max-w-3xl text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">
              Mobile Mardi Gras, made easier.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-parade-muted">
              Watch live coverage, open quick links, find downtown food and drink stops, and plan your parade day from one simple starting point.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/watch" className="inline-flex items-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark">
                Watch live coverage <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/links" className="inline-flex items-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
                Open quick links
              </Link>
              <Link href="/resources#food-and-drink-navigator" className="inline-flex items-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
                Food and drink
              </Link>
            </div>
          </div>

          <aside className="rounded border border-parade-line bg-parade-purpleSoft p-5 shadow-civic">
            <h2 className="text-2xl font-black text-parade-ink">What do you need first?</h2>
            <p className="mt-2 text-sm leading-6 text-parade-muted">
              The most-used paths are pulled forward so visitors do not have to understand the tracker or search through technical pages.
            </p>
            <div className="mt-5 space-y-3">
              <QuickJump href="/watch" label="Watch live or replay coverage" icon={<PlayCircle className="h-4 w-4" aria-hidden="true" />} />
              <QuickJump href="/links" label="Open mobile quick links" icon={<Share2 className="h-4 w-4" aria-hidden="true" />} />
              <QuickJump href="/resources#food-and-drink-navigator" label="Navigate to food and drink" icon={<Utensils className="h-4 w-4" aria-hidden="true" />} />
              <QuickJump href="/resources" label="Plan parking, access, and downtown stops" icon={<Car className="h-4 w-4" aria-hidden="true" />} />
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <SectionHeader
            title="Start Here"
            description="Four simple paths replace the old dashboard-first layout. Pick the task and go."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {primaryActions.map((item) => (
              <PrimaryActionCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="rounded border border-parade-line bg-white p-5 shadow-civic">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Downtown food and drink</p>
              <h2 className="mt-1 text-2xl font-black text-parade-ink">Find a nearby stop fast</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-parade-muted">
                Food and drink links are treated as navigation tools for people already walking downtown or driving in during Mardi Gras.
              </p>
            </div>
            <Link href="/resources#food-and-drink-navigator" className="inline-flex shrink-0 items-center justify-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark">
              Open food navigator <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {featuredFoodResources.length > 0 ? (
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {featuredFoodResources.map((resource) => (
                <FoodStopLink key={resource.id} resource={resource} />
              ))}
            </div>
          ) : null}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <LiveStreamEmbed />
          <OfficialSourcePanel />
        </section>
      </div>
    </div>
  );
}

function QuickJump({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center justify-between gap-3 rounded border border-parade-line bg-white px-4 py-3 text-sm font-bold text-parade-ink hover:bg-parade-goldSoft">
      <span className="flex min-w-0 items-center gap-2">
        <span className="text-parade-purple">{icon}</span>
        <span className="min-w-0 truncate">{label}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" />
    </Link>
  );
}

function PrimaryActionCard({
  icon,
  title,
  body,
  href,
  action
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  action: string;
}) {
  return (
    <article className="min-w-0 rounded border border-parade-line bg-white p-5 shadow-civic">
      <div className="grid h-10 w-10 place-items-center rounded bg-parade-goldSoft text-parade-gold">{icon}</div>
      <h2 className="mt-4 text-xl font-black text-parade-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-parade-muted">{body}</p>
      <Link href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-parade-purple hover:underline">
        {action} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

function FoodStopLink({ resource }: { resource: ResourceItem }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="flex min-w-0 items-center justify-between gap-3 rounded border border-parade-line bg-white px-3 py-2 text-sm font-bold text-parade-ink hover:bg-parade-purpleSoft"
    >
      <span className="min-w-0 truncate">{resource.title}</span>
      <MapPinned className="h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" />
    </a>
  );
}

function OfficialSourcePanel() {
  return (
    <article className="rounded border border-amber-200 bg-parade-goldSoft p-5">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-black text-amber-950">Official information still matters</h2>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            This site helps visitors find coverage and planning links. Official parade schedules, routes, cancellations, road closures, parking rules, public-safety instructions, and weather impacts should still be verified through official public sources.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://www.cityofmobile.gov/mardigras/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-black text-amber-950 hover:underline"
            >
              City Mardi Gras page <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-black text-amber-950 hover:underline">
              Visitor resources <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
