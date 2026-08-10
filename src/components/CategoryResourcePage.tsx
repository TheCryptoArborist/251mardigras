import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, MapPinned } from "lucide-react";
import type { ResourceItem } from "@/lib/data-access";

type CategoryResourcePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  resources: ResourceItem[];
  primaryHref?: string;
  primaryAction?: string;
  emptyMessage?: string;
  resourceActionLabel?: string;
  officialReminder?: string;
  resourceLogoPaths?: Record<string, string>;
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
  resourceLogoPaths = {}
}: CategoryResourcePageProps) {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-line bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist">
        <div className="absolute right-[-6rem] top-[-8rem] h-64 w-64 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="mx-auto max-w-5xl px-4 py-9 sm:px-6 lg:px-8 lg:py-12">
          <p className="text-sm font-black uppercase tracking-wide text-parade-purple">{eyebrow}</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-parade-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-parade-muted sm:text-lg">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={primaryHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-purple px-5 py-3 text-sm font-black text-white shadow-civic transition hover:-translate-y-0.5 hover:bg-parade-purpleDark">
              {primaryAction} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full border border-parade-line bg-white/80 px-5 py-3 text-sm font-black text-parade-purple transition hover:-translate-y-0.5 hover:bg-parade-purpleSoft">
              Back to homepage <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {resources.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => {
              const logoPath = resourceLogoPaths[resource.title] ?? resourceLogoPaths[normalizeResourceTitle(resource.title)];

              return (
                <ResourceButton key={resource.id} resource={resource} actionLabel={resourceActionLabel} logoPath={logoPath} />
              );
            })}
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-parade-line bg-parade-purpleSoft p-5 text-sm leading-6 text-parade-muted">
            {emptyMessage}
          </section>
        )}

        <section className="rounded-2xl border border-amber-200 bg-parade-goldSoft p-5 shadow-civic">
          <div className="flex items-start gap-3">
            <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-amber-950">
              <span className="font-black">Unofficial visitor resource.</span>{" "}
              {officialReminder}
            </p>
          </div>
        </section>
      </div>
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
      className="group flex min-w-0 items-center gap-3 rounded-2xl border border-parade-line bg-white px-4 py-3 text-left shadow-card transition hover:-translate-y-1 hover:bg-parade-purpleMist"
    >
      <ResourceLogo title={resource.title} logoPath={logoPath} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-black text-parade-ink">{resource.title}</span>
        <span className="mt-1 block truncate text-xs font-semibold uppercase text-parade-muted">{resource.category}</span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-black uppercase text-parade-purple group-hover:underline">
        {actionLabel}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </span>
    </a>
  );
}

function ResourceLogo({ title, logoPath }: { title: string; logoPath?: string }) {
  if (logoPath) {
    return (
      <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-parade-line bg-white p-1.5 shadow-sm" aria-hidden="true">
        <Image src={logoPath} alt={`${title} logo`} width={48} height={48} className="h-full w-full object-contain" />
      </span>
    );
  }

  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-parade-gold/40 bg-parade-goldSoft text-sm font-black text-parade-purple" aria-hidden="true">
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
