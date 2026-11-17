import {
  DisabledButton,
  KeyValue,
  PageIntro,
  Panel,
  PrototypePage,
  SectionHeading,
  StatusPill
} from "@/components/mg251-mvp/PrototypeUi";
import { fictionalOrganization } from "@/lib/mg251-mvp/fictional-data";

export default function Mg251OrganizationPrototypePage() {
  return (
    <PrototypePage>
      <PageIntro
        eyebrow="Fictional verified organization"
        title="Scoped authority to manage information—while MG251 retains editorial review."
        description="The credential identifies what MG251 verified and which platform permissions an approved representative holds. It is not government, legal, financial, insurance, or event-safety certification."
      />

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel className="border-parade-gold/50 bg-gradient-to-br from-white to-parade-goldSoft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-parade-gold">MG251 organization credential</p>
              <h2 className="mt-2 text-2xl font-black text-parade-purpleDeep">{fictionalOrganization.name}</h2>
            </div>
            <StatusPill tone="gold">{fictionalOrganization.status}</StatusPill>
          </div>
          <dl className="mt-6">
            <KeyValue label="Credential level" value={fictionalOrganization.level} />
            <KeyValue label="Issued" value={fictionalOrganization.issuedAt} />
            <KeyValue label="Expires" value={fictionalOrganization.expiresAt} />
            <KeyValue label="Public name" value="Displayed only with documented consent" />
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <DisabledButton>Request Renewal</DisabledButton>
            <DisabledButton>Manage Representatives</DisabledButton>
          </div>
        </Panel>

        <Panel>
          <SectionHeading eyebrow="Permission scope" title="What this representative may do" />
          <ul className="space-y-3">
            {fictionalOrganization.permissions.map((permission) => (
              <li
                key={permission.label}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-sm font-bold ${
                  permission.allowed
                    ? "border-parade-gold/40 bg-parade-goldSoft text-parade-purpleDeep"
                    : "border-parade-line bg-slate-100 text-slate-600"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    permission.allowed ? "bg-parade-goldBright" : "bg-slate-200"
                  }`}
                  aria-hidden="true"
                >
                  {permission.allowed ? "✓" : "×"}
                </span>
                <span>{permission.label}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      <section className="mt-12">
        <SectionHeading
          eyebrow="Event management"
          title="Authorized drafts and editorial review"
          description="Verified organizations can create or revise permitted drafts. Publication, unpublication, and final corrections remain MG251 editorial actions in the MVP."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {fictionalOrganization.events.map((event) => (
            <Panel key={event.title}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusPill tone={event.status === "Under Review" ? "gold" : "neutral"}>{event.status}</StatusPill>
                <span className="text-xs font-bold text-parade-muted">{event.date}</span>
              </div>
              <h3 className="mt-4 text-xl font-black text-parade-purpleDeep">{event.title}</h3>
              <p className="mt-2 text-sm leading-6 text-parade-muted">Last recorded change: {event.lastChange}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <DisabledButton>Open Event Draft</DisabledButton>
                <DisabledButton>Submit Correction</DisabledButton>
              </div>
            </Panel>
          ))}
        </div>
        <div className="mt-5">
          <DisabledButton>Create Fictional Event Draft</DisabledButton>
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-2">
        <Panel>
          <SectionHeading title="Verification review boundary" />
          <p className="leading-7 text-parade-muted">
            Private representative details, authorization evidence, government identification, tax records, internal documents, and reviewer notes stay offchain and outside the public organization profile. The Sui credential contains only minimal identifiers, level, dates, status, policy version, authorized account, and an optional consented public name.
          </p>
        </Panel>
        <Panel>
          <SectionHeading title="Representative changes" />
          <p className="leading-7 text-parade-muted">
            Organization access belongs to named, scoped representative assignments—not a shared password. Departed or compromised representatives are suspended and removed through an audited workflow, while the organization may appoint a newly verified representative.
          </p>
        </Panel>
      </section>

      <Panel className="mt-12 border-red-200 bg-red-50">
        <h2 className="text-xl font-black text-red-900">Credential disclaimer</h2>
        <p className="mt-2 leading-7 text-red-900">
          MG251 verification does not imply City of Mobile endorsement, approval by another Mardi Gras organization, legal compliance certification, financial solvency, insurance coverage, event safety, or accuracy beyond the facts and scope MG251 actually reviewed.
        </p>
      </Panel>
    </PrototypePage>
  );
}
