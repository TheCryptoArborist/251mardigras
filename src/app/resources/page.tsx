import Link from "next/link";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Car,
  CloudSun,
  ExternalLink,
  Landmark,
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
const historyTitles = ["Mobile Carnival Museum"];
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

const socialBranding: Record<string, { icon: ReactNode; background: string; foreground: string; label: string }> = {
  YouTube: {
    icon: <YouTubeLogo />,
    background: "#ff0000",
    foreground: "#ffffff",
    label: "Subscribe on YouTube"
  },
  Facebook: {
    icon: <FacebookLogo />,
    background: "#1877f2",
    foreground: "#ffffff",
    label: "Follow on Facebook"
  },
  Instagram: {
    icon: <InstagramLogo />,
    background: "linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 72%, #515bd4 100%)",
    foreground: "#ffffff",
    label: "Follow on Instagram"
  },
  TikTok: {
    icon: <TikTokLogo />,
    background: "#000000",
    foreground: "#ffffff",
    label: "Follow on TikTok"
  },
  X: {
    icon: <XLogo />,
    background: "#000000",
    foreground: "#ffffff",
    label: "Follow on X"
  }
};

export default async function ResourcesPage() {
  const resources = await getResources();
  const socialResources = pickResources(resources, socialTitles);
  const watchResources = pickResources(resources, watchTitles);
  const parkingResources = pickResources(resources, parkingTitles);
  const historyResources = pickResources(resources, historyTitles);
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
            Subscribe on YouTube, follow the Mardi Gras channels, watch coverage, explore Mobile Carnival history, and jump to the visitor tools without digging through repeated link lists.
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
                <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Subscribe and follow first</p>
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

        {historyResources.length > 0 ? <HistoryCultureSection resources={historyResources} /> : null}

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

function HistoryCultureSection({ resources }: { resources: ResourceItem[] }) {
  return (
    <section id="mobile-mardi-gras-history" className="scroll-mt-24 space-y-4">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-5 text-white shadow-card">
        <span className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-32 w-32 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
        <span className="pointer-events-none absolute bottom-[-5rem] left-[-4rem] h-40 w-40 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow">
            <Landmark className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Brief history</p>
            <h2 className="mt-1 text-2xl font-black text-white">Mobile Mardi Gras History</h2>
            <div className="mt-3 space-y-3 text-sm leading-6 text-purple-100">
              <p>
                Mobile is widely known as the birthplace of American Mardi Gras. The city&apos;s Carnival story is often traced to its early French colonial roots and the well-known 1703 tradition, but like much of Carnival, the story includes both history and myth.
              </p>
              <p>
                The organized mystic society culture, balls, symbolism, and traditions that shaped modern Mobile Mardi Gras developed most clearly in the 1830s and 1840s. Today, Mobile Mardi Gras continues through parades, balls, mystic societies, music, costumes, throws, and community celebrations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SectionTitle
        title="History & Culture"
        description="Learn more about Mobile Carnival history, mystic society traditions, costumes, artifacts, and Mardi Gras culture. Verify hours, tickets, and tour details with the museum before visiting."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="group flex min-w-0 items-center gap-3 rounded-2xl border border-parade-gold/30 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:bg-parade-goldSoft hover:shadow-civic"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/35">
              <Landmark className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-black text-parade-purpleDark">{resource.title}</span>
              <span className="mt-1 block truncate text-xs font-semibold uppercase text-parade-muted">Visit museum website</span>
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-parade-purple transition group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}

function CompactResourceButton({ resource }: { resource: ResourceItem }) {
  const socialBrand = socialBranding[resource.title];
  const actionLabel = resource.title === "YouTube" ? "Subscribe" : "Follow";

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      aria-label={socialBrand?.label ?? `Open ${resource.title}`}
      className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/20 bg-white/95 px-3 py-2.5 text-parade-purpleDark shadow-sm transition hover:-translate-y-0.5 hover:bg-parade-goldSoft"
    >
      {socialBrand ? (
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-sm ring-1 ring-black/5"
          style={{ background: socialBrand.background, color: socialBrand.foreground }}
          aria-hidden="true"
        >
          {socialBrand.icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-black">{resource.title}</span>
        <span className="mt-0.5 block truncate text-[0.68rem] font-black uppercase tracking-wide text-parade-muted">{actionLabel}</span>
      </span>
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

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4h-3v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.9V24c5.8-.9 10.2-5.9 10.2-11.9Z" />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M16.7 1.8c.4 3.1 2.1 5 5.1 5.2v3.5a8.7 8.7 0 0 1-5.1-1.6v7.1c0 4.5-3.1 6.7-6.3 6.7-3.6 0-6.4-2.5-6.4-5.9 0-3.6 3-6.1 6.9-5.9v3.7c-1.7-.2-3 .7-3 2.1 0 1.3 1.1 2.1 2.4 2.1 1.4 0 2.5-.8 2.5-2.8V1.8h3.9Z" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.7l-5.2-6.8L5.6 22H2.3l7.7-8.8L1.8 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.6 3.9H5.7L17.7 20Z" />
    </svg>
  );
}
