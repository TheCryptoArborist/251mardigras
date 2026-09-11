# MG251 Decision Log

Status values: `OPEN`, `PROVISIONAL`, `APPROVED`, `REJECTED`, `SUPERSEDED`.

No `OPEN` or `PROVISIONAL` item is authorization to launch, charge customers, use real personal data, or deploy to Mainnet.

| ID | Decision | Status | Current constraint or provisional direction | Owner / evidence required |
| --- | --- | --- | --- | --- |
| D-001 | Legal entity operating MG251 | OPEN | Must be identified before contracts or production payments | Peter + legal/tax records |
| D-002 | Legal owner of MG251 brand | OPEN | Do not infer from social-account control | Peter + ownership records |
| D-003 | Legal owner/controller of `mg251.xyz` | OPEN | Verify registrar/account control | Peter + registrar record |
| D-004 | Ownership of original photos/video | OPEN | Build a rights inventory before premium use | Peter + creation/license records |
| D-005 | Licensed third-party premium content | OPEN | No content enters premium library without documented rights | Peter + licenses/permissions |
| D-006 | Relationship to existing Facebook/YouTube/Patreon memberships | OPEN | Direct pass may replace, supplement, or mirror; prototype does not decide | Peter + platform terms/data access |
| D-007 | Final membership tiers | OPEN | Placeholder tiers only | Peter |
| D-008 | Benefits per tier | OPEN | Promise only operationally deliverable benefits | Peter + operating plan |
| D-009 | Membership period | OPEN | Fixed 2027 season or another period must be explicit | Peter |
| D-010 | Automatic or manual renewal | OPEN | No automatic renewal until notices, authorization, and cancellation are reviewed | Peter + counsel/payment configuration |
| D-011 | Member refund policy | OPEN | Test-mode flows only | Peter + counsel |
| D-012 | Chargeback treatment | OPEN | Provisional: suspend access during confirmed chargeback review | Peter + payment-provider rules |
| D-013 | Mid-season upgrade rules | OPEN | Must define proration, effective date, and benefit transition | Peter |
| D-014 | Gifting | OPEN | Excluded from initial prototype; no public transfer | Peter |
| D-015 | Recovery evidence | OPEN | Must be privacy-minimizing and documented | Peter + security review |
| D-016 | Recognized external memberships | OPEN | No scraping; supported API/export/manual verification only | Peter + platform capabilities |
| D-017 | Social-login providers | OPEN | Prototype has generic sign-in; public pilot should select a small supported set | Peter + technical review |
| D-018 | Launch payment methods | OPEN | Conventional payment first is the governing constraint | Peter + provider selection |
| D-019 | Future TREE payment | OPEN | Separate optional payment rail only; no additional rights | Peter + accounting/legal review |
| D-020 | Premium content ready at launch | OPEN | Use fictional content until rights and operations are approved | Peter |
| D-021 | Initial sponsor products | OPEN | Placeholder product families only | Peter + sales plan |
| D-022 | Exclusive sponsor inventory | OPEN | Every exclusive slot needs a unique inventory key | Peter |
| D-023 | Sponsor fulfillment evidence | OPEN | Define evidence by product before sale | Peter + sponsor agreement |
| D-024 | Sponsor cancellation/refund rules | OPEN | Contract controls; no generic promise | Peter + counsel |
| D-025 | Organizations eligible for verification | OPEN | Eligibility categories require written criteria | Peter |
| D-026 | Verification evidence | OPEN | Private, minimal, retained only as required | Peter + policy review |
| D-027 | Credential expiration/review cadence | OPEN | Every credential must expire or be periodically reviewed | Peter |
| D-028 | Direct editing of published events | OPEN | Provisional: organizations edit drafts; MG251 retains publication control | Peter |
| D-029 | MG251 editorial approval | PROVISIONAL | Retained for all public event changes in MVP | Peter to approve |
| D-030 | Public organization information | OPEN | Public name only with consent; other fields policy-driven | Peter + organization consent model |
| D-031 | Contributor recognition criteria | OPEN | Deferred; offchain points before onchain badges | Peter |
| D-032 | Suspension/revocation conduct | OPEN | Must appear in membership, sponsor, verification, and community terms | Peter + counsel |
| D-033 | Authority to issue complimentary passes | OPEN | Separate role and audit required | Peter |
| D-034 | Contract upgrade authority custody | OPEN | Must be separate from daily personal/TREE/NFTree wallets | Peter + security plan |
| D-035 | Sponsored-transaction gas account | OPEN | Dedicated MG251 Testnet account first | Peter + technical setup |
| D-036 | Monthly gas budget | OPEN | Hard cap and alerts required before pilot | Peter |
| D-037 | Offchain-only information | PROVISIONAL | Personal, payment, contract, verification, content, secret, and recovery data remain offchain | Peter to approve data map |
| D-038 | Retention periods | OPEN | Legal/business purpose per category; no indefinite default | Peter + counsel/accountant |
| D-039 | Initial pilot participants | OPEN | Small invited group using fictional/Testnet data first | Peter |
| D-040 | Successful 2027 pilot definition | OPEN | Metrics and thresholds must be approved before launch | Peter |

## Architecture decisions made for Phase 0

| ID | Decision | Status | Rationale |
| --- | --- | --- | --- |
| A-001 | Extend the existing Next.js repository rather than rewrite it | APPROVED FOR PHASE 0 | Current App Router, TypeScript, Tailwind, and Netlify structure are compatible with an isolated prototype |
| A-002 | Keep prototype under `/prototype/mg251` and out of public navigation | APPROVED FOR PHASE 0 | Prevents fictional screens from appearing as launched products |
| A-003 | Use fictional data only | APPROVED FOR PHASE 0 | Required by the governing handoff |
| A-004 | No Mainnet, real payment, real identity, or production OAuth configuration | APPROVED FOR PHASE 0 | Required safety and acceptance boundary |
| A-005 | Authoritative mutable lifecycle records use shared/cap-controlled state | PROVISIONAL | Address-owned objects are controlled by their holder; MG251 requires issuer-controlled suspension, revocation, renewal, and recovery reassignment |
| A-006 | No public transfer function for passes, placements, or credentials | PROVISIONAL | These objects represent controlled service rights, not marketplace assets |
| A-007 | Existing GitHub/JSON event publisher is not the membership backend | APPROVED FOR PHASE 0 | It lacks account-level authorization, inventory locking, payment reconciliation, and durable domain audit records |
| A-008 | Production transactional persistence requires managed relational storage | PROVISIONAL | Needed for concurrency, webhook idempotency, roles, recovery, and auditability |

## Approval procedure

When Peter resolves a decision, update the row with:

- final answer;
- effective date;
- approver;
- linked policy/specification;
- implementation consequences;
- superseded decision, if any.

Changes to rights, transferability, payment promises, refunds, public data, or administrative authority require explicit review before code is promoted beyond fictional Testnet use.
