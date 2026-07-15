import { AlertTriangle, ExternalLink } from "lucide-react";
import type { PublicChange } from "@/lib/data-access";
import { formatDateTime } from "@/lib/format";
import { StatusPill } from "./StatusPill";

const toneBySeverity: Record<PublicChange["severity"], "green" | "gold" | "purple" | "red" | "gray"> = {
  high: "red",
  medium: "gold",
  low: "gray",
  info: "purple"
};

export function AlertCard({ alert }: { alert: PublicChange }) {
  return (
    <article className="rounded border border-parade-line bg-white p-4 shadow-civic">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded bg-red-50 text-red-700">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusPill tone={toneBySeverity[alert.severity]}>{alert.label}</StatusPill>
            <span className="text-xs font-semibold text-parade-muted">{formatDateTime(alert.detectedAt)}</span>
          </div>
          <h3 className="text-base font-bold text-parade-ink">{alert.title}</h3>
          <p className="mt-2 text-sm leading-6 text-parade-muted">{alert.summary}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-parade-muted">
            <span>Source: {alert.source}</span>
            {alert.sourceUrl ? (
              <a href={alert.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-parade-purple hover:underline">
                Open source <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

