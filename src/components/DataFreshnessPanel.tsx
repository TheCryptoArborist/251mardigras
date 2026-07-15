import { AlertTriangle, CheckCircle2, Clock3, Database, RefreshCw } from "lucide-react";
import type { SourceStatus } from "@/lib/data-access";
import { formatDateTime } from "@/lib/format";
import { StatusPill } from "./StatusPill";

type DataFreshnessPanelProps = {
  sources: SourceStatus[];
  alertCount: number;
  paradeCount: number;
  weatherCheckedAt?: string | null;
};

export function DataFreshnessPanel({ sources, alertCount, paradeCount, weatherCheckedAt }: DataFreshnessPanelProps) {
  const checkedCount = sources.filter((source) => source.lastCheckedAt).length;
  const successCount = sources.filter((source) => source.lastSuccessAt && !source.lastError).length;
  const errorCount = sources.filter((source) => source.lastError).length;
  const pendingCount = Math.max(sources.length - checkedCount, 0);
  const latestCheckedAt = latestDate(sources.map((source) => source.lastCheckedAt));
  const latestSuccessAt = latestDate(sources.map((source) => source.lastSuccessAt));
  const statusTone = errorCount ? "red" : pendingCount ? "gold" : checkedCount ? "green" : "gray";
  const statusLabel = errorCount ? "Needs review" : pendingCount ? "Pending checks" : checkedCount ? "Checks stored" : "Not checked";

  return (
    <section className="rounded border border-parade-line bg-white p-5 shadow-civic">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase text-parade-muted">Tracker freshness</p>
          <h2 className="mt-1 text-xl font-black text-parade-ink">Public-source check status</h2>
        </div>
        <StatusPill tone={statusTone}>{statusLabel}</StatusPill>
      </div>

      <p className="mt-3 text-sm leading-6 text-parade-muted">
        Local monitor status only. Parade, traffic, public safety, and weather decisions still need official-source verification.
      </p>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <FreshnessItem icon={<Database className="h-4 w-4" />} label="Monitored sources" value={String(sources.length)} />
        <FreshnessItem icon={<CheckCircle2 className="h-4 w-4" />} label="Successful checks" value={`${successCount}/${sources.length}`} />
        <FreshnessItem icon={<AlertTriangle className="h-4 w-4" />} label="Needs review" value={String(errorCount)} emphasize={errorCount > 0} />
        <FreshnessItem icon={<RefreshCw className="h-4 w-4" />} label="Pending checks" value={String(pendingCount)} />
      </dl>

      <dl className="mt-5 divide-y divide-parade-line border-y border-parade-line text-sm">
        <FreshnessRow label="Latest source check" value={formatDateTime(latestCheckedAt)} />
        <FreshnessRow label="Latest successful check" value={formatDateTime(latestSuccessAt)} />
        <FreshnessRow label="Weather snapshot" value={formatDateTime(weatherCheckedAt)} />
        <FreshnessRow label="Unacknowledged alerts" value={String(alertCount)} />
        <FreshnessRow label="Verified schedule records" value={String(paradeCount)} />
      </dl>

      <div className="mt-4 flex items-start gap-2 text-xs font-semibold leading-5 text-parade-muted">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" />
        A zero schedule count is intentional until official schedule parsing is added.
      </div>
    </section>
  );
}

function FreshnessItem({
  icon,
  label,
  value,
  emphasize = false
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded border border-parade-line px-3 py-2">
      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded ${emphasize ? "bg-red-50 text-red-700" : "bg-parade-purpleSoft text-parade-purple"}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <dt className="text-xs font-bold uppercase text-parade-muted">{label}</dt>
        <dd className={`text-base font-black ${emphasize ? "text-red-700" : "text-parade-ink"}`}>{value}</dd>
      </div>
    </div>
  );
}

function FreshnessRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-parade-muted">{label}</dt>
      <dd className="text-right font-semibold text-parade-ink">{value}</dd>
    </div>
  );
}

function latestDate(values: Array<string | null>) {
  const timestamps = values
    .map((value) => (value ? new Date(value).getTime() : Number.NaN))
    .filter((value) => !Number.isNaN(value));

  if (timestamps.length === 0) {
    return null;
  }

  return new Date(Math.max(...timestamps));
}
