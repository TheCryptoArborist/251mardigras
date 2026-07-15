import { ExternalLink } from "lucide-react";
import type { ResourceItem } from "@/lib/data-access";

export function ResourceCard({ resource }: { resource: ResourceItem }) {
  return (
    <article className="flex h-full flex-col rounded border border-parade-line bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-civic">
      <h3 className="text-base font-bold text-parade-ink">{resource.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-parade-muted">{resource.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase text-parade-muted">{resource.source}</span>
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-bold text-parade-purple hover:underline"
        >
          Open <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

