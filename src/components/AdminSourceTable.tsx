import type { SourceStatus } from "@/lib/data-access";
import { formatDateTime } from "@/lib/format";
import { StatusPill } from "./StatusPill";

export function AdminSourceTable({ sources }: { sources: SourceStatus[] }) {
  return (
    <div className="overflow-hidden rounded border border-parade-line bg-white shadow-civic">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-parade-line text-sm">
          <thead className="bg-parade-purpleSoft text-left text-xs font-bold uppercase text-parade-muted">
            <tr>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Last checked</th>
              <th className="px-4 py-3">Last success</th>
              <th className="px-4 py-3">Last error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-parade-line">
            {sources.map((source) => (
              <tr key={source.id}>
                <td className="min-w-72 px-4 py-3">
                  <a href={source.url} target="_blank" rel="noreferrer" className="font-bold text-parade-purple hover:underline">
                    {source.name}
                  </a>
                </td>
                <td className="px-4 py-3 text-parade-muted">{source.sourceType.replaceAll("_", " ")}</td>
                <td className="px-4 py-3">
                  <StatusPill tone={source.active ? "green" : "gray"}>{source.active ? "Active" : "Paused"}</StatusPill>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-parade-muted">{formatDateTime(source.lastCheckedAt)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-parade-muted">{formatDateTime(source.lastSuccessAt)}</td>
                <td className="min-w-64 px-4 py-3 text-red-700">{source.lastError ?? "None"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

