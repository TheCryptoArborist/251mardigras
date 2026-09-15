import {
  PageIntro,
  Panel,
  PrimaryLink,
  PrototypePage,
  SecondaryLink,
  SectionHeading,
  StatusPill
} from "@/components/mg251-mvp/PrototypeUi";
import { provisionalTiers } from "@/lib/mg251-mvp/fictional-data";

const roleCards = [
  {
    title: "Member",
    description: "View a fictional 2027 pass, benefits, premium coverage, expiration, and recovery options.",
    href: "/prototype/mg251/member",
    label: "Open Member View"
  },
  {
    title: "Sponsor",
    description: "Review fictional inventory, campaign steps, creative approval, and fulfillment evidence.",
    href: "/prototype/mg251/sponsors",
    label: "Open Sponsor View"
  },
  {
    title: "Verified Organization",
    description: "See scoped credentials, representative permissions, event drafts, and editorial review.",
    href: "/prototype/mg251/organizations",
    label: "Open Organization View"
  },
  {
    title: "Administrator",
    description: "Inspect separate queues for memberships, sponsors, organizations, content, recovery, and audit.",
    href: "/prototype/mg251/admin",
    label: "Open Admin View"
  }
] as const;

export default function Mg251PrototypeOverviewPage() {
  return (
    <PrototypePage>
      <PageIntro
        eyebrow="MG251 2027 planning prototype"
        title="Direct membership, verifiable sponsor products, and trusted event management—without a crypto learning curve."
        description="This isolated Phase 0 prototype turns the handoff into mobile-first business workflows. Every person, organization, campaign, benefit, date, and status shown here is fictional."
        actions={
          <>
            <PrimaryLink href="/prototype/mg251/member">View the Member Experience</PrimaryLink>
            <SecondaryLink href="/prototype/mg251/admin">Review Administrative Controls</SecondaryLink>
          </>
        }
      />

      <section className="mt-10">
        <SectionHeading
          eyebrow="Role journeys"
          title="Four familiar experiences, one MG251 account system"
          description="Sui operates behind the scenes. The primary interface is organized around membership, sponsor booking, organization verification, editorial review, and support."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {roleCards.map((role) => (
            <Panel key={role.title} className="flex flex-col">
              <div className="mb-4">
                <StatusPill>Fictional workflow</StatusPill>
              </div>
              <h3 className="text-xl font-black text-parade-purpleDeep">{role.title}</h3>
              <p className="mt-2 flex-1 leading-7 text-parade-muted">{role.description}</p>
              <div className="mt-5">
                <SecondaryLink href={role.href}>{role.label}</SecondaryLink>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading
          eyebrow="Configurable framework"
          title="Provisional membership tiers"
          description="These labels demonstrate a tier-capable interface. They do not set final prices, benefits, dates, renewal rules, or relationships with existing Facebook, YouTube, or Patreon memberships."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {provisionalTiers.map((tier) => (
            <Panel key={tier.code}>
              <StatusPill tone="gold">{tier.code}</StatusPill>
              <h3 className="mt-4 text-lg font-black text-parade-purpleDeep">{tier.name}</h3>
              <p className="mt-2 text-sm leading-6 text-parade-muted">{tier.description}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-2">
        <Panel>
          <SectionHeading title="What MG251 is tokenizing" />
          <ul className="space-y-3 text-sm leading-6 text-parade-ink">
            <li className="rounded-2xl bg-parade-purpleMist p-4">Time-limited access to defined MG251 membership benefits.</li>
            <li className="rounded-2xl bg-parade-purpleMist p-4">Reservations and fulfillment records for specific sponsor placements.</li>
            <li className="rounded-2xl bg-parade-purpleMist p-4">Scoped platform credentials for approved organizations and representatives.</li>
            <li className="rounded-2xl bg-parade-purpleMist p-4">Access-control signals for selected premium content.</li>
          </ul>
        </Panel>

        <Panel>
          <SectionHeading title="What it is not tokenizing" />
          <ul className="space-y-3 text-sm leading-6 text-parade-ink">
            <li className="rounded-2xl bg-parade-goldSoft p-4">Followers, subscribers, people, parades, organizations, public streets, or city property.</li>
            <li className="rounded-2xl bg-parade-goldSoft p-4">Equity, debt, revenue sharing, dividends, staking, yield, buybacks, or resale value.</li>
            <li className="rounded-2xl bg-parade-goldSoft p-4">Ownership of MG251 photographs, video, website space, or social media accounts.</li>
            <li className="rounded-2xl bg-parade-goldSoft p-4">A fungible MG251 coin or public marketplace.</li>
          </ul>
        </Panel>
      </section>

      <Panel className="mt-12 border-parade-gold/50 bg-parade-goldSoft">
        <h2 className="text-xl font-black text-parade-purpleDeep">Production controls remain intentionally disabled</h2>
        <p className="mt-2 max-w-4xl leading-7 text-parade-ink">
          This branch contains no social authentication, payment checkout, real upload, Sui transaction, production database migration, or Mainnet configuration. Those phases begin only after the unresolved decisions and policy gates are approved.
        </p>
      </Panel>
    </PrototypePage>
  );
}
