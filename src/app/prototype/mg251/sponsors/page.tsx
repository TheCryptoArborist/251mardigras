import {
  CheckRow,
  DisabledButton,
  KeyValue,
  PageIntro,
  Panel,
  PrototypePage,
  SectionHeading,
  StatusPill
} from "@/components/mg251-mvp/PrototypeUi";
import { fictionalSponsorCampaign, fictionalSponsorInventory } from "@/lib/mg251-mvp/fictional-data";

function availabilityTone(availability: string): "gold" | "neutral" {
  return availability === "Available" ? "gold" : "neutral";
}

export default function Mg251SponsorPrototypePage() {
  return (
    <PrototypePage>
      <PageIntro
        eyebrow="Fictional sponsor experience"
        title="Defined MG251 placements with visible status and verifiable fulfillment."
        description="Sponsors reserve a specific product and publication window. Private contracts, negotiated prices, billing contacts, creative drafts, and performance reports remain offchain."
      />

      <section className="mt-10">
        <SectionHeading
          eyebrow="Sponsor inventory"
          title="Available and reserved placement examples"
          description="A product template is not inventory by itself. Every exclusive publication window must have a unique, concurrency-safe slot so two sponsors cannot reserve it."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {fictionalSponsorInventory.map((item) => (
            <Panel key={`${item.product}-${item.slot}`} className="flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusPill tone={availabilityTone(item.availability)}>{item.availability}</StatusPill>
                <span className="text-xs font-black uppercase tracking-wide text-parade-muted">{item.exclusive ? "Exclusive slot" : "Nonexclusive"}</span>
              </div>
              <h2 className="mt-5 text-xl font-black text-parade-purpleDeep">{item.product}</h2>
              <p className="mt-1 text-sm font-bold text-parade-gold">{item.slot}</p>
              <p className="mt-4 flex-1 text-sm leading-6 text-parade-muted">{item.deliverables}</p>
              <div className="mt-5">
                <DisabledButton>{item.availability === "Available" ? "Request This Placement" : "View Reservation Status"}</DisabledButton>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <SectionHeading eyebrow="Campaign summary" title={fictionalSponsorCampaign.sponsorName} />
          <dl>
            <KeyValue label="Placement" value={fictionalSponsorCampaign.product} />
            <KeyValue label="Campaign window" value={fictionalSponsorCampaign.campaign} />
            <KeyValue label="Current status" value={<StatusPill tone="gold">{fictionalSponsorCampaign.status}</StatusPill>} />
            <KeyValue label="Public resale" value="Not permitted" />
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <DisabledButton>Upload Fictional Creative</DisabledButton>
            <DisabledButton>Request Permitted Change</DisabledButton>
          </div>
        </Panel>

        <Panel>
          <SectionHeading
            eyebrow="Placement lifecycle"
            title="What happens next"
            description="Each step is tied to an authorized action and an immutable creative or evidence version. A later file replacement returns to review."
          />
          <ol className="space-y-3">
            {fictionalSponsorCampaign.steps.map((step) => (
              <CheckRow key={step.label} label={step.label} complete={step.complete} />
            ))}
          </ol>
        </Panel>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-3">
        <Panel>
          <SectionHeading title="Creative approval" />
          <p className="text-sm leading-6 text-parade-muted">
            Sponsor files are private until approved. The approved version is identified by a stable file/version reference and manifest hash. Any change creates a new review cycle.
          </p>
        </Panel>
        <Panel>
          <SectionHeading title="Fulfillment evidence" />
          <p className="text-sm leading-6 text-parade-muted">
            Every product defines evidence before sale: publication URL/window, screenshot/archive capture, video timestamp, send record, or another objective deliverable record.
          </p>
        </Panel>
        <Panel>
          <SectionHeading title="Contract controls" />
          <p className="text-sm leading-6 text-parade-muted">
            Cancellation, refund, partial performance, make-good, and dispute rules come from the approved agreement. The Sui record follows that decision and preserves an audit event.
          </p>
        </Panel>
      </section>

      <Panel className="mt-12 border-parade-gold/50 bg-parade-goldSoft">
        <h2 className="text-xl font-black text-parade-purpleDeep">What a Sponsor Placement Receipt does not provide</h2>
        <p className="mt-2 leading-7 text-parade-ink">
          It does not create permanent ownership of website space, a social media account, MG251’s audience, future inventory, editorial control, intellectual property, or an investment interest. Public reassignment and resale are disabled.
        </p>
      </Panel>
    </PrototypePage>
  );
}
