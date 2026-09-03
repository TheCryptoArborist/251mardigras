import {
  DisabledButton,
  MetricCard,
  PageIntro,
  Panel,
  PrototypePage,
  SectionHeading,
  StatusPill
} from "@/components/mg251-mvp/PrototypeUi";
import { fictionalAdminMetrics, fictionalAdminQueues } from "@/lib/mg251-mvp/fictional-data";

const fictionalAudit = [
  { time: "10:42 AM", action: "Pass issuance simulated", actor: "Fictional Pass Issuer", result: "Testnet pending" },
  { time: "10:18 AM", action: "Creative version reviewed", actor: "Fictional Sponsor Manager", result: "Changes requested" },
  { time: "9:55 AM", action: "Credential application opened", actor: "Fictional Verifier", result: "Under review" },
  { time: "9:31 AM", action: "Event correction submitted", actor: "Fictional Organization Rep", result: "Editorial queue" }
] as const;

export default function Mg251AdminPrototypePage() {
  return (
    <PrototypePage>
      <PageIntro
        eyebrow="Fictional administrative control center"
        title="Separate authority, visible exceptions, and auditable lifecycle actions."
        description="Editorial authority does not automatically grant payment, issuance, contract, verification, recovery, emergency, or package-upgrade authority. Every production action will require server-side authorization and an audit record."
      />

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeading
            eyebrow="Environment"
            title="Testnet operations only"
            description="No production credentials, payments, personal data, or Mainnet objects are configured in this Phase 0 branch."
          />
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="gold">Sui Testnet</StatusPill>
            <StatusPill>Issuance prototype active</StatusPill>
            <StatusPill tone="neutral">Mainnet disabled</StatusPill>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {fictionalAdminMetrics.map((metric) => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value} detail={metric.detail} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading
          eyebrow="Role-scoped queues"
          title="Administrative work by domain"
          description="Counts and records are fictional. Production queue access will be restricted by named role assignments and checked on the server for every read and write."
        />
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {fictionalAdminQueues.map((queue) => (
            <Panel key={queue.title} className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-parade-gold">{queue.role}</p>
                  <h3 className="mt-2 text-xl font-black text-parade-purpleDeep">{queue.title}</h3>
                </div>
                <span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-parade-goldBright px-3 text-lg font-black text-parade-purpleDeep">
                  {queue.count}
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm leading-6 text-parade-muted">{queue.description}</p>
              <div className="mt-5">
                <DisabledButton>Open Fictional Queue</DisabledButton>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel>
          <SectionHeading
            eyebrow="Audit preview"
            title="Recent fictional activity"
            description="Production records will include actor, role, object/order/case reference, prior/new status, reason code, policy version, timestamp, Sui digest, and result. Private reasons stay offchain."
          />
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-parade-muted">
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Actor</th>
                  <th className="px-3 py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {fictionalAudit.map((entry) => (
                  <tr key={`${entry.time}-${entry.action}`} className="bg-parade-purpleMist text-parade-ink">
                    <td className="rounded-l-2xl px-3 py-3 font-bold">{entry.time}</td>
                    <td className="px-3 py-3 font-bold">{entry.action}</td>
                    <td className="px-3 py-3">{entry.actor}</td>
                    <td className="rounded-r-2xl px-3 py-3">{entry.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="border-red-200 bg-red-50">
          <SectionHeading eyebrow="Restricted" title="Emergency controls" description="The production emergency role is separate from ordinary editorial and support access." />
          <div className="space-y-3 text-sm leading-6 text-red-900">
            <p>Potential controls include pausing new issuance, stopping gas sponsorship, disabling a compromised integration, and preserving security/revocation actions.</p>
            <p>Package upgrade authority and private keys are not exposed through this interface.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <DisabledButton>Pause Testnet Issuance</DisabledButton>
            <DisabledButton>Review Incident Runbook</DisabledButton>
          </div>
        </Panel>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-3">
        <Panel>
          <SectionHeading title="Reconciliation first" />
          <p className="text-sm leading-6 text-parade-muted">
            Paid orders without passes, active passes after refund, database/Sui mismatches, failed sponsored transactions, and reservation conflicts appear in operator queues instead of being silently ignored.
          </p>
        </Panel>
        <Panel>
          <SectionHeading title="Least privilege" />
          <p className="text-sm leading-6 text-parade-muted">
            Editorial, pass issuer, sponsor manager, organization verifier, content manager, recovery, emergency, and upgrade functions are separately authorized and reviewable.
          </p>
        </Panel>
        <Panel>
          <SectionHeading title="No frontend secrets" />
          <p className="text-sm leading-6 text-parade-muted">
            Payment keys, OAuth secrets, Sui signing keys, capability custody, storage credentials, database credentials, and deployment tokens remain server-side or in protected custody.
          </p>
        </Panel>
      </section>
    </PrototypePage>
  );
}
