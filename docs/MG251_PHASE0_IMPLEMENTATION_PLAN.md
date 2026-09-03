# MG251 Phase 0 and First-Sprint Implementation Plan

## Governing constraints

- Extend `mg251.xyz`; do not create a separate crypto-first website.
- Do not create a fungible MG251 coin.
- Do not deploy to Mainnet.
- Do not use real members, organizations, sponsors, payments, event records, or identity documents.
- Do not expose prototype routes in the live navigation.
- Use provisional, configurable labels where decisions remain open.
- Preserve existing public event/weather/resource functionality.

## Sprint workstreams

### 1. Product and policy

Deliver:

- project brief;
- asset/rights inventory;
- product-rights matrix;
- membership specification;
- sponsor inventory specification;
- organization verification framework;
- premium content policy;
- payment/refund flow;
- data classification;
- privacy/retention requirements;
- threat model;
- recovery and gas sponsorship policies;
- acceptance criteria and pilot plan.

Exit condition: all unresolved business questions are visible in the decision log and no provisional value is represented as approved.

### 2. Isolated fictional mobile prototype

Routes:

```text
/prototype/mg251
/prototype/mg251/member
/prototype/mg251/sponsors
/prototype/mg251/organizations
/prototype/mg251/admin
```

Requirements:

- no-index metadata;
- no live navigation link;
- fictional data notice;
- member pass/benefits/content states;
- sponsor inventory and fulfillment workflow;
- organization credential, permissions, and event drafts;
- administrative queues and role separation;
- existing purple/gold Tailwind tokens;
- no forms that submit real data;
- no payment/auth/Sui side effects.

### 3. Production architecture decision record

Evaluate and record, without migrating in this sprint:

- managed Postgres-compatible database;
- server-side authentication/session provider;
- OAuth providers and account-linking/recovery model;
- private storage/CDN;
- payment provider;
- email/notification provider;
- Sui RPC/indexer and gas sponsor design;
- operational logging/monitoring.

The current SQLite/public JSON systems remain untouched during this evaluation.

### 4. Move scaffold — after Phase 0 review

Create Testnet-only package with:

- registry;
- separate capabilities;
- season configuration;
- shared authoritative pass records;
- sponsor inventory slots and placement records;
- organization credential records;
- content/fulfillment references;
- status validation;
- events;
- Display V2;
- unit tests.

Do not scaffold a fungible coin module.

### 5. Offchain domain scaffold — after architecture selection

Proposed server modules:

```text
src/server/mg251/auth/
src/server/mg251/membership/
src/server/mg251/sponsors/
src/server/mg251/organizations/
src/server/mg251/content/
src/server/mg251/payments/
src/server/mg251/recovery/
src/server/mg251/sui/
src/server/mg251/audit/
src/server/mg251/reconciliation/
```

Proposed public/business routes after approval:

```text
/membership
/member
/member/pass
/member/content
/sponsors
/sponsors/inventory
/sponsors/dashboard
/organizations/verify
/organizations/dashboard
/admin/memberships
/admin/sponsors
/admin/organizations
/admin/content
```

These are not added as production routes during Phase 0.

## Sequenced tasks

| Order | Task | Output | Blocking decision |
| --- | --- | --- | --- |
| 1 | Audit repo/live architecture | `STACK_AUDIT.md` | None |
| 2 | Define rights/data/status boundaries | Product/policy docs | Peter approval later |
| 3 | Build isolated static prototype | No-index fictional routes | None |
| 4 | Review prototype and decision log | Updated approvals | Peter input |
| 5 | Select database/auth/storage direction | Architecture decision | Providers/budget |
| 6 | Scaffold Move package | Testnet package/tests | Rights model approval |
| 7 | Add account/auth domain | Test accounts only | Login/recovery decisions |
| 8 | Add Sui Testnet service | Gasless fictional issuance | Sponsor account/config |
| 9 | Add test-mode payment ledger/webhooks | Idempotent fictional/test order flow | Provider/refund decisions |
| 10 | Add sponsor/organization pilots | Limited approved workflow | Product/policy decisions |

## Technical quality gates

For every code phase:

- TypeScript strict checks.
- ESLint with no warnings.
- Production Next.js build.
- Playwright mobile smoke tests.
- No secrets or real personal data.
- Server-only modules do not enter client bundle.
- Authz negative tests.
- Accessibility review for keyboard, labels, focus, contrast, and touch targets.
- Environment/network guards prevent accidental Mainnet use.

## Proposed automated tests

### Prototype

- All prototype routes return 200.
- Every prototype page contains the fictional-data notice.
- Metadata is no-index.
- No prototype link appears in the production header.
- Mobile viewport has no horizontal overflow.

### Membership

- Status/date access matrix.
- Duplicate order/issuance prevention.
- Reassignment invalidates old account.
- Unauthorized role denied.

### Sponsor

- Concurrent reservation conflict.
- Expired hold release.
- Creative version approval.
- Fulfillment evidence requirement.

### Organization

- Scope-limited permissions.
- Editorial approval required.
- Representative removal.
- Expiration/suspension/revocation.

### Payments/gas

- Forged/replayed webhook rejection.
- Transaction allowlist and gas cap.
- Unknown execution result reconciliation.

## First review package

Present to Peter in this order:

1. What is tokenized.
2. Rights matrix.
3. Role journeys.
4. Tier framework.
5. Sponsor inventory framework.
6. Verification framework.
7. Data map.
8. Mobile prototype.
9. Move object/capability model.
10. Payment/refund/recovery flow.
11. Threat/privacy summary.
12. Sprint tasks and repo structure.
13. Testnet acceptance criteria.
14. Open decisions.

No payment or production authentication work begins until the relevant decisions are approved.
