import { Database, History, ShieldCheck } from "lucide-react";
import { AdminRecheckButton } from "@/components/AdminRecheckButton";
import { AdminSourceTable } from "@/components/AdminSourceTable";
import { ChangeHistoryTable } from "@/components/ChangeHistoryTable";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusPill } from "@/components/StatusPill";
import { getLatestSnapshots, getPublicChanges, getSourceStatuses } from "@/lib/data-access";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [sources, changes, snapshots] = await Promise.all([getSourceStatuses(), getPublicChanges(10), getLatestSnapshots()]);
  const sourcesWithErrors = sources.filter((source) => source.lastError);
  const checkedSources = sources.filter((source) => source.lastCheckedAt);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeader
        title="Admin Dashboard"
        description="Operational view for source status, detected changes, latest snapshots, and manual checks."
        action={<AdminRecheckButton />}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <AdminMetric icon={<ShieldCheck className="h-5 w-5" />} label="Sources monitored" value={String(sources.length)} tone="green" />
        <AdminMetric icon={<History className="h-5 w-5" />} label="Checked sources" value={String(checkedSources.length)} tone="purple" />
        <AdminMetric icon={<Database className="h-5 w-5" />} label="Source errors" value={String(sourcesWithErrors.length)} tone={sourcesWithErrors.length ? "red" : "green"} />
      </section>

      <section>
        <SectionHeader title="Source Status" description="Last checked time, detected source errors, and active state for each monitored source." />
        <AdminSourceTable sources={sources} />
      </section>

      <section>
        <SectionHeader title="Detected Changes" description="Unacknowledged medium/high changes that should be reviewed before public alerting." />
        <ChangeHistoryTable changes={changes} />
      </section>

      <section>
        <SectionHeader title="Latest Snapshots" description="Most recent stored source snapshots. Run the source checker after migrating and seeding the database." />
        <div className="overflow-hidden rounded border border-parade-line bg-white shadow-civic">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-parade-line text-sm">
              <thead className="bg-parade-purpleSoft text-left text-xs font-bold uppercase text-parade-muted">
                <tr>
                  <th className="px-4 py-3">Checked</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Content hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parade-line">
                {snapshots.length ? (
                  snapshots.map((snapshot) => (
                    <tr key={snapshot.id}>
                      <td className="whitespace-nowrap px-4 py-3 text-parade-muted">{formatDateTime(snapshot.checkedAt)}</td>
                      <td className="px-4 py-3 font-semibold text-parade-ink">{snapshot.source.name}</td>
                      <td className="px-4 py-3">
                        <StatusPill tone={snapshot.statusCode && snapshot.statusCode >= 400 ? "red" : "green"}>
                          {snapshot.statusCode ?? "Stored"}
                        </StatusPill>
                      </td>
                      <td className="max-w-60 truncate px-4 py-3 font-mono text-xs text-parade-muted">{snapshot.contentHash}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-parade-muted">
                      No snapshots stored yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function AdminMetric({
  icon,
  label,
  value,
  tone
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "green" | "purple" | "red";
}) {
  const color = {
    green: "bg-parade-greenSoft text-parade-green",
    purple: "bg-parade-purpleSoft text-parade-purple",
    red: "bg-red-50 text-red-700"
  }[tone];

  return (
    <article className="rounded border border-parade-line bg-white p-5 shadow-civic">
      <div className={`grid h-10 w-10 place-items-center rounded ${color}`}>{icon}</div>
      <p className="mt-4 text-3xl font-black text-parade-ink">{value}</p>
      <p className="mt-1 text-sm font-bold uppercase text-parade-muted">{label}</p>
    </article>
  );
}

