# MG251 Tokenized Membership and Sponsor Platform — Project Brief

## 1. Concise definition of what MG251 is tokenizing

MG251 is tokenizing **defined rights and verifiable records issued by the MG251 platform**, not people, followers, social accounts, Mardi Gras organizations, parades, public streets, the City of Mobile, or ownership in the MG251 business.

The MVP covers four controlled product families:

1. **2027 Season Pass** — a time-limited membership entitlement.
2. **Sponsor Placement Receipt** — a verifiable record of a reserved advertising product and its fulfillment lifecycle.
3. **Verified Organization Credential** — a nontransferable platform credential granting narrowly defined submission and management permissions.
4. **Premium Content Access** — server-enforced access based on an active entitlement.

Contributor recognition is deferred until the first three products are stable. No fungible MG251 coin, public token sale, marketplace, staking, yield, revenue sharing, or Mainnet deployment is in scope.

## 2. Product-rights matrix

| Product | Right represented | Transfer | Cash redemption | Investment rights | MVP source of truth |
| --- | --- | --- | --- | --- | --- |
| Season Pass | Time-limited MG251 membership access | No public transfer; controlled recovery reassignment only | No | No | Sui entitlement status + MG251 account record |
| Sponsor Placement Receipt | Contracted advertising deliverables | No public transfer; MG251-approved reassignment only | Contract/refund policy only | No | Signed agreement/payment record + Sui lifecycle record |
| Verified Organization Credential | Defined platform permissions and verification status | No | No | No | MG251 verification record + Sui credential status |
| Contributor Badge | Recognition or limited feature access | No | No | No | Deferred; offchain points first |
| Future equity, note, or revenue instrument | Separately documented legal rights | Restricted | Instrument-specific | Yes | Excluded from this project |

## 3. Core journeys

### Member

`Visit MG251 → choose a provisional tier → sign in → test payment or access code → backend verifies the order → sponsored Testnet transaction → active Season Pass → member dashboard → premium access check`

### Sponsor

`Review inventory → request a placement → availability hold → accept terms → test payment confirmation → Placement Receipt → submit fictional creative → MG251 approval → schedule → fulfillment evidence → Fulfilled`

### Organization

`Create account → submit fictional verification application → private review → credential issuance → submit or edit authorized event draft → editorial review → publish or return for correction`

### Administrator

`Authenticate → operate within assigned role → perform a privileged action → offchain audit record + Sui event → reconcile state → investigate exceptions`

## 4. Membership-tier framework

Tiers are configuration, not code constants. The prototype uses fictional placeholders only:

- Entry Pass
- VIP Pass
- Complimentary Pass
- Partner Pass
- Press or Contributor Pass

Every tier requires a code, public label, eligibility rule, start and expiration dates, benefit manifest, price configuration, renewal rule, recovery rule, and suspension/revocation policy. Final names, prices, benefits, and relationship to Facebook, YouTube, Patreon, and other memberships remain unresolved.

## 5. Sponsor-inventory framework

A sponsor product is a template. A sponsor inventory slot is a uniquely bookable occurrence of that product for a defined publication window. Exclusive inventory must have a single slot key and a database uniqueness constraint. The onchain lifecycle record may only be created or reserved through the Sponsor Manager capability.

Initial configurable product families:

- Homepage feature
- Featured event
- Parade replay sponsorship
- Livestream acknowledgment
- Food & Drink placement
- Mardi Gras Gear placement
- Newsletter placement
- Social feature
- Video commercial
- Seasonal package

No negotiated price, private agreement, billing contact, or unpublished performance report goes onchain.

## 6. Organization-verification framework

Verification levels are separately defined permissions, not a universal endorsement:

- Identity Verified
- Organization Verified
- Authorized Event Manager
- Official Information Source
- Commercial Partner
- Media Partner

MG251 retains editorial approval. A credential does not imply government endorsement, legal certification, solvency, insurance, event safety, or accuracy beyond the checks documented in the verification policy.

## 7. Public/private data map

### Public on Sui

Opaque serial or credential identifiers, season code, tier code, issue/expiration timestamps, status, issuer, policy versions, sponsor product/slot code, campaign window, consented public organization name, document hashes, and lifecycle event timestamps.

### Private encrypted or access-controlled

Names, email addresses, phone numbers, billing addresses, social identifiers, contracts, creative drafts, reports, verification evidence, unpublished event details, premium media, and recovery evidence.

### Internal business records

Payment events, refunds, chargebacks, tax records, negotiated prices, moderation notes, complaints, access logs, secrets, privileged audit records, and legal correspondence.

## 8. Mobile wireframe direction

The static prototype is isolated under `/prototype/mg251` and is deliberately absent from the live navigation. It provides fictional views for member, sponsor, organization, and administrator roles. It uses the existing purple-and-gold design tokens, large touch targets, plain language, and no wallet-first terminology.

## 9. Proposed Move objects and capabilities

Authoritative lifecycle records should be shared objects or shared-registry child records, not naive address-owned mutable objects. A `key`-only address-owned object prevents unrestricted public transfer, but the holder still controls an address-owned object. MG251 needs cap-guarded administrative lifecycle actions such as suspension, renewal, revocation, and recovery reassignment without requiring a compromised or unavailable holder to sign.

Proposed objects:

- `MG251Registry`
- `SeasonConfig`
- `SeasonPassRecord`
- `SponsorInventorySlot`
- `SponsorPlacementRecord`
- `OrganizationCredentialRecord`
- `ContentRelease`
- `FulfillmentRecord`

Proposed capabilities:

- `MG251AdminCap`
- `PassIssuerCap`
- `SponsorManagerCap`
- `OrganizationVerifierCap`
- `ContentManagerCap`
- `EmergencyCap`

An optional holder-owned display badge may be added later, but access decisions must always consult the authoritative record so revocation and expiration cannot be bypassed by a stale object.

## 10. Payment, refund, and recovery flows

The payment provider is authoritative for settlement, refunds, chargebacks, recurring billing, and taxes. The Sui record is authoritative for the current onchain entitlement. MG251 must reconcile both systems. Webhooks require signature verification, durable event IDs, order-level idempotency, and replay-safe processing.

Recovery is a case-managed offchain process. MG251 verifies the account holder, suspends the old entitlement, changes the authoritative holder field or revokes/reissues, records the recovery event, and closes the case. There is no unrestricted self-transfer endpoint.

## 11. Privacy and threat summary

Primary threats include account takeover, OAuth-provider loss, zkLogin salt loss, gas-sponsor abuse, payment-webhook replay, duplicate issuance, double booking, role escalation, stale entitlement caches, public-metadata leakage, capability compromise, upgrade-authority misuse, malicious file uploads, and social-engineering recovery attempts.

Controls include least-privilege roles, separate administrative accounts, allowlisted sponsored calls, gas limits, webhook idempotency, unique inventory constraints, content scanning, short-lived sessions, explicit cache invalidation, append-only audits, an emergency pause, and no real personal data during Testnet development.

## 12. First-sprint implementation tasks

1. Preserve the live site and keep prototype routes unlinked and no-indexed.
2. Create the Phase 0 documentation set.
3. Build fictional mobile views for all four roles.
4. Define configuration-driven tiers, statuses, inventory, and permissions.
5. Select a production database/authentication direction without migrating yet.
6. Scaffold the Move package only after the rights/state model is approved.
7. Write unit tests for status transitions, no-public-transfer behavior, double-booking prevention, and privileged capability checks.
8. Present unresolved business decisions before payments or production authentication.

## 13. Repository direction

Do not rewrite the current application into a monorepo during Phase 0. Extend the existing Next.js repository incrementally:

```text
src/app/prototype/mg251/        # fictional no-index prototype
src/components/mg251-mvp/       # prototype-only UI
src/lib/mg251-mvp/              # fictional configuration/data
src/server/mg251/                # future server-only domain services
move/mg251_membership/           # future Testnet Move package
docs/                            # product, policy, security, and architecture records
```

A later split into separate `apps/web`, `apps/api`, and packages should occur only when operational complexity justifies it.

## 14. Testnet acceptance criteria

The MVP must demonstrate gasless fictional issuance, controlled lifecycle actions, no public pass transfer, status-aware premium access, inventory double-booking prevention, sponsor fulfillment evidence, organization permission boundaries, complete audit events, webhook idempotency, mobile usability, environment-configurable IDs, no committed secrets, no real personal data, and no Mainnet deployment.

## 15. Decisions requiring Peter’s input

All unresolved business decisions are recorded in `docs/DECISION_LOG.md`. The highest-priority decisions are:

- Whether direct MG251 membership replaces, supplements, or mirrors existing memberships.
- Final tier names, prices, benefits, dates, renewal model, and refund rules.
- Launch payment method and recognized external memberships.
- Initial sponsor products, exclusivity, deliverables, and cancellation rules.
- Verification eligibility, evidence, expiration, and organization editing limits.
- Legal entity, brand/content ownership, contract authority, and policy owner.
- Pilot users, gas budget, administrator roles, and success thresholds.

No unresolved answer is treated as approved merely because a provisional example appears in the prototype.
