import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, MapPinned } from "lucide-react";
import type { ResourceItem } from "@/lib/data-access";

type CategoryResourcePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  resources: ResourceItem[];
  primaryHref?: string | null;
  primaryAction?: string | null;
  emptyMessage?: string;
  resourceActionLabel?: string;
  officialReminder?: string;
  resourceLogoPaths?: Record<string, string>;
  showHeroQuickView?: boolean;
  showResourceSection?: boolean;
  showOfficialReminder?: boolean;
};

export function CategoryResourcePage({
  eyebrow,
  title,
  description,
  resources,
  primaryHref = "/resources",
  primaryAction = "Open full resource guide",
  emptyMessage = "No direct resources are currently published in this category. Use the full resource guide for the latest available links.",
  resourceActionLabel = "Open resource",
  officialReminder = "Verify parade schedules, routes, cancellations, road closures, parking rules, towing, public-safety instructions, and weather impacts with official sources.",
  resourceLogoPaths = {},
  showHeroQuickView = true,
  showResourceSection = true,
  showOfficialReminder = false
}: CategoryResourcePageProps) {
  const hasPrimaryAction = Boolean(primaryHref && primaryAction);
  const showBodyContent = showResourceSection || showOfficialReminder;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.35fr] lg:items-center lg:px-8 lg:py-12">
          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright shadow-glow">
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-purple-100 sm:text-lg">
              {description}
            </p>
            {hasPrimaryAction ? (
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={primaryHref as string} className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright">
                  {primaryAction} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ) : null}
          </div>

          {showHeroQuickView ? (
            <div className="relative z-10 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 shadow-glow backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Quick view</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <HeroMetric label="Resources" value={String(resources.length)} />
                <HeroMetric label="Links" value="Direct" />
              </div>
              <p className="mt-4 text-xs font-semibold leading-5 text-purple-100">
                Visitor convenience links only. Confirm details with the source or host before making plans.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {showBodyContent ? (
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          {showResourceSection ? (
            resources.length > 0 ? (
              <section className="grid gap-4 md:grid-cols-2">
                {resources.map((resource) => {
                  const logoPath = resourceLogoPaths[resource.title] ?? resourceLogoPaths[normalizeResourceTitle(resource.title)];

                  return (
                    <ResourceButton key={resource.id} resource={resource} actionLabel={resourceActionLabel} logoPath={logoPath} />
                  );
                })}
              </section>
            ) : (
              <section className="rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist p-5 text-sm leading-6 text-parade-muted shadow-card">
                {emptyMessage}
              </section>
            )
          ) : null}

          {showOfficialReminder ? (
            <section className="rounded-[1.5rem] border border-amber-200 bg-parade-goldSoft p-5 shadow-civic">
              <div className="flex items-start gap-3">
                <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
                <p className="text-sm font-medium leading-6 text-amber-950">
                  <span className="font-black">Unofficial visitor resource.</span>{" "}
                  {officialReminder}
                </p>
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/90 px-3 py-3">
      <p className="text-2xl font-black text-parade-purpleDark">{value}</p>
      <p className="mt-1 text-[0.65rem] font-black uppercase tracking-wide text-parade-muted">{label}</p>
    </div>
  );
}

function ResourceButton({
  resource,
  actionLabel,
  logoPath
}: {
  resource: ResourceItem;
  actionLabel: string;
  logoPath?: string;
}) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist px-4 py-3 text-left shadow-card transition hover:-translate-y-1 hover:shadow-glow"
    >
      <span className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-20 w-20 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <ResourceLogo title={resource.title} logoPath={logoPath} />
      <span className="relative z-10 min-w-0 flex-1">
        <span className="block truncate text-sm font-black text-parade-purpleDark">{resource.title}</span>
        <span className="mt-1 block truncate text-xs font-semibold uppercase text-parade-muted">{resource.category}</span>
      </span>
      <span className="relative z-10 inline-flex shrink-0 items-center gap-1 rounded-full bg-parade-purple px-3 py-2 text-xs font-black uppercase text-white transition group-hover:bg-parade-purpleDark">
        {actionLabel}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </span>
    </a>
  );
}

function ResourceLogo({ title, logoPath }: { title: string; logoPath?: string }) {
  if (logoPath) {
    return (
      <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-parade-gold/35 bg-white p-1.5 shadow-sm" aria-hidden="true">
        <Image src={logoPath} alt={`${title} logo`} width={48} height={48} className="h-full w-full object-contain" />
      </span>
    );
  }

  return (
    <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-parade-gold/40 bg-parade-goldSoft text-sm font-black text-parade-purple" aria-hidden="true">
      {initialsFor(title)}
    </span>
  );
}

function initialsFor(title: string) {
  const words = normalizeResourceTitle(title)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase()).join("") || "MG";
}

function normalizeResourceTitle(title: string) {
  return title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
