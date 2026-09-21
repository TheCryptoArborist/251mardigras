# MG251 Current Stack Audit

Date: 2026-08-27

Repository: `TheCryptoArborist/251mardigras`

## Current architecture

MG251 is already implemented as a single Next.js application using the App Router, React, TypeScript, Tailwind CSS, Prisma, and Netlify deployment configuration. The repository contains public visitor pages, public-source monitoring, weather data, parade/resource pages, a community-event calendar, and a lightweight administrative publisher.

Current relevant components:

- Next.js 15 and React 19 frontend/server routes.
- TypeScript strict mode.
- Tailwind with an established purple-and-gold `parade` palette.
- Prisma 6 with a SQLite development datasource.
- Netlify build from `npm run build` and `.next` output.
- Public event data stored in `data/community-events.json`.
- A community-event publisher that uses `ADMIN_EVENTS_SECRET`, commits approved JSON through GitHub, and optionally invokes a Netlify build hook.
- Existing `/admin` routes are marked no-index, but the shared admin layout does not establish account authentication or role-based authorization.

## Findings

### Suitable foundations

The existing App Router, TypeScript, Tailwind tokens, shared header/footer, Netlify deployment, and server-route support are suitable for an incremental MG251 membership prototype. There is no reason to rewrite the live site solely to add the Sui layer.

### Gaps before a public membership pilot

1. **Authentication:** no general member account or social-login system is present.
2. **Authorization:** no durable user/role/permission model is present.
3. **Database:** the current Prisma schema is focused on public-source monitoring; it contains no users, orders, entitlements, sponsors, organizations, credentials, content grants, recovery cases, or audit log.
4. **Production persistence:** SQLite is acceptable for local development but should not become the production transactional store for payments, account recovery, inventory locking, or concurrent sponsor reservations.
5. **Admin security:** no-index metadata is not an authorization boundary. Administrative routes need authenticated server-side role checks.
6. **Event workflow:** the JSON/GitHub publisher is intentionally lightweight. It may remain for the existing public calendar, but it must not become the source of truth for memberships, sponsor contracts, credentials, or privileged organization access.
7. **Payments:** no payment-provider integration, webhook ledger, refund reconciliation, or idempotency store exists.
8. **Sui:** no current Sui SDK, dApp Kit, Move package, network configuration, indexer, gas sponsor, or transaction allowlist exists in this repository.
9. **Private storage:** no dedicated private object storage/content entitlement layer is defined.
10. **Auditability:** existing change history is for monitored public sources, not privileged business actions.

## Recommended integration strategy

### Phase 0

Add an isolated, no-index fictional prototype and the documentation set. Do not add a link to the public navigation and do not introduce real data.

### Phase 1

Select and add:

- Managed Postgres-compatible production database.
- Server-side authentication with social providers.
- Explicit role and permission checks.
- Immutable or append-only business audit records.
- Private file storage with signed access.

Maintain the current public site routes and visual system.

### Phase 2

Add a dedicated Testnet Move package and server-only Sui transaction service. Keep package IDs, capability object IDs, sponsor addresses, RPC endpoints, and network selection in environment configuration.

### Phase 3

Add zkLogin/embedded accounts and sponsored transactions after the ordinary account, recovery, rate-limit, and authorization model is operational.

### Phase 4

Add test-mode conventional payments with signed webhook verification and reconciliation. Production payments remain blocked until policies and legal terms are approved.

## Proposed future offchain entities

- `User`
- `ExternalIdentity`
- `SuiAccount`
- `RoleAssignment`
- `Season`
- `MembershipTier`
- `MembershipOrder`
- `MembershipEntitlement`
- `EntitlementLifecycleEvent`
- `SponsorProduct`
- `SponsorInventorySlot`
- `SponsorReservation`
- `SponsorCreative`
- `SponsorFulfillment`
- `Organization`
- `OrganizationRepresentative`
- `VerificationApplication`
- `CredentialRecord`
- `EventDraft`
- `EventRevision`
- `ContentItem`
- `ContentGrant`
- `Payment`
- `Refund`
- `WebhookEvent`
- `RecoveryCase`
- `GasSponsorshipLog`
- `AuditLog`

## Source-of-truth boundaries

| Domain | Authoritative source |
| --- | --- |
| Card settlement, refund, chargeback, tax event | Payment provider plus MG251 payment ledger |
| Identity, roles, private profiles, contracts, editorial state | MG251 database |
| Active tokenized entitlement/credential lifecycle | Sui authoritative record, reconciled to MG251 database |
| Premium files and private evidence | Private storage system |
| Current lightweight public event calendar | Existing approved JSON flow until migrated |
| Social subscription status | Supported provider API/export/manual verification at the time checked |

## First technical gate

No privileged prototype route should be promoted into a production route until authenticated server-side authorization is demonstrated. Client-side hiding, no-index metadata, a shared password field, or possession of a frontend URL is not sufficient.
