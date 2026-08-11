import Link from "next/link";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Car,
  CloudSun,
  ExternalLink,
  MapPinned,
  PlayCircle,
  Share2,
  ShoppingBag,
  Utensils
} from "lucide-react";
import { getResources, type ResourceItem } from "@/lib/data-access";

export const dynamic = "force-dynamic";

const socialTitles = ["YouTube", "Facebook", "Instagram", "TikTok", "X"];
const watchTitles = ["Current livestream", "Become a Channel Supporter", "Previous parade playlists"];
const parkingTitles = [
  "City of Mobile Parking and Transportation Guide",
  "Downtown Parking Map",
  "ParkWhiz Google Play link",
  "ParkWhiz Apple App Store link"
];
const replayTitles = ["Mardi Gras 2026 Playlist", "Mardi Gras 2025 Playlist", "Mardi Gras 2024 Playlist", "Mardi Gras 2023 Playlist"];

const toolCards = [
  {
    title: "Watch live coverage",
    description: "Open the live coverage hub and current player.",
    href: "/watch",
    icon: <PlayCircle className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Community events",
    description: "See approved Mardi Gras-related community events.",
    href: "/events",
    icon: <CalendarDays className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Food and drink map",
    description: "Find downtown stops and direct directions.",
    href: "/food-drink",
    icon: <Utensils className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Parking guide",
    description: "Open parking and access resources before heading downtown.",
    href: "/parking-access",
    icon: <Car className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Weather",
    description: "Check weather planning information before parade time.",
    href: "/weather",
    icon: <CloudSun className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Mardi Gras gear",
    description: "Find throws, shirts, gear, and shopping resources.",
    href: "/mardi-gras-gear",
    icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />
  }
];

export default async function ResourcesPage() {
  const resources = await getResources();
  const socialResources = pickResources(resources, socialTitles);
  const watchResources = pickResources(resources, watchTitles);
  const parkingResources = pickResources(resources, parkingTitles);
  const replayResources = pickResources(resources, replayTitles);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-9 sm:px-6 lg:px-8 lg:py-11">
          <p className="inline-flex rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright shadow-glow">
            Visitor resources
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Find the Mardi Gras links you need
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-purple-100 sm:text-lg">
            Follow the Mardi Gras channels, watch coverage, and jump to the visitor tools without digging through repeated link lists.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {socialResources.length > 0 ? (
          <section className="rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-5 text-white shadow-card">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow">
                <Share2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Follow first</p>
                <h2 className="mt-1 text-2xl font-black text-white">Mardi Gras - Mobile, AL social channels</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-purple-100">
                  Announcements, live updates, video coverage, reels, and community posts start here.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {socialResources.map((resource) => (
                <CompactResourceButton key={resource.id} resource={resource} />
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <SectionTitle
            title="Visitor tools"
            description="Use these pages instead of scrolling through the same links in multiple places."
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {toolCards.map((card) => (
              <ToolCard key={card.href} {...card} />
            ))}
          </div>
        </section>

        {watchResources.length > 0 ? (
          <ResourceGroup
            title="Watch and support"
            description="Coverage and support links only. Social links stay above."
            resources={watchResources}
            icon={<PlayCircle className="h-5 w-5" aria-hidden="true" />}
          />
        ) : null}

        {parkingResources.length > 0 ? (
          <ResourceGroup
            title="Parking guide"
            description="Direct parking and access-planning links. Verify parking, towing, and traffic instructions with official sources."
            resources={parkingResources}
            icon={<MapPinned className="h-5 w-5" aria-hidden="true" />}
          />
        ) : null}

        {replayResources.length > 0 ? (
          <ResourceGroup
            title="Previous parade seasons"
            description="Past parade-season playlists from the Mobile Mardi Gras video archive."
            resources={replayResources}
            icon={<PlayCircle className="h-5 w-5" aria-hidden="true" />}
          />
        ) : null}

        <section className="rounded-[1.25rem] border border-parade-gold/35 bg-parade-goldSoft p-4 text-sm leading-6 text-amber-950 shadow-civic">
          <span className="font-black">Unofficial visitor resource.</span> Verify parade schedules, routes, closures, parking, public safety, weather, and event details with official sources or the host organization before making plans.
        </section>
      </div>
    </div>
  );
}

function pickResources(resources: ResourceItem[], titles: string[]) {
  return titles
    .map((title) => resources.find((resource) => resource.title === title))
    .filter((resource): resource is ResourceItem => Boolean(resource));
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-parade-purpleDark">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-parade-muted">{description}</p>
    </div>
  );
}

function CompactResourceButton({ resource }: { resource: ResourceItem }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="group flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/95 px-4 py-3 text-parade-purpleDark shadow-sm transition hover:-translate-y-0.5 hover:bg-parade-goldSoft"
    >
      <span className="min-w-0 truncate text-sm font-black">{resource.title}</span>
      <ExternalLink className="h-4 w-4 shrink-0 text-parade-purple transition group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  );
}

function ToolCard({ title, description, href, icon }: { title: string; description: string; href: string; icon: ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative flex min-w-0 gap-3 overflow-hidden rounded-[1.35rem] border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-4 shadow-card transition hover:-translate-y-1 hover:shadow-glow"
    >
      <span className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-20 w-20 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
        {icon}
      </span>
      <span className="relative z-10 min-w-0">
        <span className="block text-base font-black text-parade-purpleDark">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-parade-muted">{description}</span>
      </span>
    </Link>
  );
}

function ResourceGroup({
  title,
  description,
  resources,
  icon
}: {
  title: string;
  description: string;
  resources: ResourceItem[];
  icon: ReactNode;
}) {
  return (
    <section>
      <SectionTitle title={title} description={description} />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="group flex min-w-0 items-center gap-3 rounded-2xl border border-parade-gold/30 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:bg-parade-goldSoft hover:shadow-civic"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/35">
              {icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-black text-parade-purpleDark">{resource.title}</span>
              <span className="mt-1 block truncate text-xs font-semibold uppercase text-parade-muted">{resource.category}</span>
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-parade-purple transition group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
