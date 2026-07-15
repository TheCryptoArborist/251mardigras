import type { PublicChange } from "@/lib/data-access";
import { formatDateTime } from "@/lib/format";
import { StatusPill } from "./StatusPill";

const toneBySeverity: Record<PublicChange["severity"], "green" | "gold" | "purple" | "red" | "gray"> = {
  high: "red",
  medium: "gold",
  low: "gray",
  info: "purple"
};

export function ChangeHistoryTable({ changes }: { changes: PublicChange[] }) {
  if (changes.length === 0) {
    return (
      <div className="rounded border border-parade-line bg-white p-6 text-sm leading-6 text-parade-muted">
        No unacknowledged route, schedule, parking, safety, or weather changes are currently stored.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded border border-parade-line bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-parade-line text-sm">
          <thead className="bg-parade-purpleSoft text-left text-xs font-bold uppercase text-parade-muted">
            <tr>
              <th className="px-4 py-3">Detected</th>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">Summary</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-parade-line">
            {changes.map((change) => (
              <tr key={change.id}>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-parade-muted">{formatDateTime(change.detectedAt)}</td>
                <td className="px-4 py-3">
                  <StatusPill tone={toneBySeverity[change.severity]}>{change.label}</StatusPill>
                </td>
                <td className="max-w-xl px-4 py-3 text-parade-ink">{change.title}</td>
                <td className="px-4 py-3 text-parade-muted">{change.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

