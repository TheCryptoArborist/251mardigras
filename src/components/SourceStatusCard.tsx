import { ExternalLink } from "lucide-react";
import type { SourceStatus } from "@/lib/data-access";
import { formatDateTime } from "@/lib/format";
import { StatusPill } from "./StatusPill";

export function SourceStatusCard({ source }: { source: SourceStatus }) {
  const healthy = Boolean(source.lastSuccessAt && !source.lastError);
  const tone = source.lastError ? "red" : healthy ? "green" : "gold";

  return (
    <article className="rounded border border-parade-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-parade-ink">{source.name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase text-parade-muted">{source.sourceType.replaceAll("_", " ")}</p>
        </div>
        <StatusPill tone={tone}>{source.lastError ? "Error" : healthy ? "Healthy" : "Pending"}</StatusPill>
      </div>
      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-parade-muted">Last checked</dt>
          <dd className="text-right font-semibold text-parade-ink">{formatDateTime(source.lastCheckedAt)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-parade-muted">Last success</dt>
          <dd className="text-right font-semibold text-parade-ink">{formatDateTime(source.lastSuccessAt)}</dd>
        </div>
      </dl>
      {source.lastError ? <p className="mt-3 text-sm leading-6 text-red-700">{source.lastError}</p> : null}
      <a href={source.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-parade-purple hover:underline">
        Open source <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </article>
  );
}

