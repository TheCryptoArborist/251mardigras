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
  officialReminder = "Verify parade schedules, routes, cancellations, road closures, parking rules, towing, public-safety instructions, and weather impacts with official sources."
}: CategoryResourcePageProps) {
  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">{eyebrow}</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-parade-muted sm:text-lg">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={primaryHref} className="inline-flex items-center justify-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark">
              {primaryAction} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
              Back to homepage <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {resources.length > 0 ? (
          <section className="grid gap-3 md:grid-cols-2">
            {resources.map((resource) => (
              <ResourceButton key={resource.id} resource={resource} actionLabel={resourceActionLabel} />
            ))}
          </section>
        ) : (
          <section className="rounded border border-dashed border-parade-line bg-parade-purpleSoft p-5 text-sm leading-6 text-parade-muted">
            {emptyMessage}
          </section>
        )}

        <section className="rounded border border-amber-200 bg-parade-goldSoft p-5">
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

function ResourceButton({ resource, actionLabel }: { resource: ResourceItem; actionLabel: string }) {
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
      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-black uppercase text-parade-purple">
        {actionLabel}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </span>
    </a>
  );
}
