import {
  AdvancedDetails,
  DisabledButton,
  KeyValue,
  PageIntro,
  Panel,
  PrimaryLink,
  PrototypePage,
  SecondaryLink,
  SectionHeading,
  StatusPill
} from "@/components/mg251-mvp/PrototypeUi";
import { fictionalMember } from "@/lib/mg251-mvp/fictional-data";

export default function Mg251MemberPrototypePage() {
  return (
    <PrototypePage>
      <PageIntro
        eyebrow="Fictional member dashboard"
        title={`Welcome, ${fictionalMember.displayName}`}
        description="The member sees a familiar pass, expiration, benefits, protected coverage, notification settings, and support actions. Network fees and blockchain mechanics remain in the background."
        actions={
          <>
            <PrimaryLink href="#season-pass">View Season Pass</PrimaryLink>
            <SecondaryLink href="#member-content">Browse Member Coverage</SecondaryLink>
          </>
        }
      />

      <section id="season-pass" className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel className="overflow-hidden border-parade-gold/50 bg-gradient-to-br from-white to-parade-goldSoft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-parade-gold">MG251 Season Pass</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-parade-purpleDeep">{fictionalMember.pass.label}</h2>
              <p className="mt-2 text-sm font-bold text-parade-muted">Serial {fictionalMember.pass.serial}</p>
            </div>
            <StatusPill tone="gold">{fictionalMember.pass.status}</StatusPill>
          </div>

          <dl className="mt-7 grid gap-x-6 sm:grid-cols-2">
            <KeyValue label="Tier" value={fictionalMember.pass.tier} />
            <KeyValue label="Season" value={fictionalMember.pass.season} />
            <KeyValue label="Valid from" value={fictionalMember.pass.validFrom} />
            <KeyValue label="Expires" value={fictionalMember.pass.expiresAt} />
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <DisabledButton>Request Renewal</DisabledButton>
            <DisabledButton>Review Upgrade Options</DisabledButton>
            <DisabledButton>Get Account Help</DisabledButton>
          </div>
          <p className="mt-3 text-xs font-semibold text-parade-muted">Actions are disabled because this is a fictional Phase 0 prototype.</p>
        </Panel>

        <Panel>
          <SectionHeading eyebrow="Configured access" title="Your current benefits" />
          <ul className="space-y-3">
            {fictionalMember.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3 rounded-2xl border border-parade-line bg-parade-purpleMist p-4 text-sm font-bold text-parade-ink">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-parade-goldBright text-parade-purpleDeep" aria-hidden="true">
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      <section id="member-content" className="mt-12">
        <SectionHeading
          eyebrow="Premium content"
          title="Member coverage library"
          description="The production server will verify current status, dates, tier, and content policy before returning a protected stream or short-lived file link. These cards do not expose real media."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {fictionalMember.content.map((item) => (
            <Panel key={item.title} className="flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <StatusPill>{item.access} access</StatusPill>
                <span className="text-xs font-bold text-parade-muted">{item.status}</span>
              </div>
              <div className="mt-5 aspect-video rounded-2xl bg-gradient-to-br from-parade-purpleDeep to-parade-purple" aria-hidden="true">
                <div className="flex h-full items-center justify-center text-4xl text-parade-goldBright">MG251</div>
              </div>
              <h3 className="mt-5 text-xl font-black text-parade-purpleDeep">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-parade-muted">{item.description}</p>
              <div className="mt-5">
                <DisabledButton>{item.status.startsWith("Scheduled") ? "Notify Me" : "Open Coverage"}</DisabledButton>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-2">
        <Panel>
          <SectionHeading title="Notification preferences" description="Transactional, security, and optional marketing messages must be separated." />
          <div className="space-y-3">
            {[
              "Premium parade and event alerts",
              "New member coverage",
              "Renewal and expiration reminders",
              "Optional sponsor offers"
            ].map((preference, index) => (
              <label key={preference} className="flex min-h-12 items-center justify-between gap-4 rounded-2xl border border-parade-line px-4 py-3">
                <span className="font-bold text-parade-ink">{preference}</span>
                <input type="checkbox" defaultChecked={index < 3} disabled className="h-5 w-5 accent-parade-purple" />
              </label>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionHeading title="What this pass does not provide" />
          <ul className="space-y-3 text-sm leading-6 text-parade-ink">
            <li>No ownership, company vote, dividend, revenue share, interest, or staking yield.</li>
            <li>No guaranteed resale value, floor price, buyback, or public transfer right.</li>
            <li>No ownership of MG251 video, photography, articles, website space, or social accounts.</li>
            <li>No claim against Facebook, Instagram, YouTube, X, Patreon, a parade, or the City of Mobile.</li>
          </ul>
          <div className="mt-6">
            <AdvancedDetails>
              <p>
                The production implementation may show an optional Sui object ID, package version, issuer address, and transaction digest. Access will still depend on the current authoritative entitlement record, not a screenshot or cached badge.
              </p>
            </AdvancedDetails>
          </div>
        </Panel>
      </section>
    </PrototypePage>
  );
}
