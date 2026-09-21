# MG251 Threat Model

## Scope

This threat model covers the member, sponsor, organization, editorial, administrative, payment, storage, and Sui Testnet components proposed for the MVP. It excludes Mainnet deployment and production payment activation.

## Assets to protect

- Member and representative accounts.
- Private contact, billing, contract, verification, and recovery data.
- Premium media and sponsor reports.
- Sponsor inventory and fulfillment integrity.
- Organization permissions and event revision integrity.
- Payment/refund ledger and webhook processing.
- Sui administrative capabilities, upgrade authority, and gas sponsor.
- MG251 brand, editorial authority, source code, deployment, and secrets.
- Audit history and reconciliation data.

## Trust boundaries

1. Browser/mobile client ↔ MG251 server.
2. MG251 server ↔ authentication provider.
3. MG251 server ↔ payment provider.
4. MG251 server ↔ database/private storage.
5. MG251 server/sponsor service ↔ Sui RPC/network.
6. Administrative user ↔ privileged server routes.
7. Organization/sponsor uploads ↔ scanning/review/publication.
8. GitHub/Netlify deployment ↔ production application.

## Principal threats and required controls

| Threat | Example | Required controls |
| --- | --- | --- |
| Account takeover | Stolen OAuth session controls a pass or organization | Secure cookies, short sessions, reauthentication for sensitive changes, provider/session revocation, anomaly logging |
| Provider or zkLogin recovery failure | User loses provider or salt and cannot reproduce address | Persistent recoverable account mapping, documented salt custody strategy, offchain recovery case, controlled reassignment/reissue |
| Privilege escalation | Member invokes admin/issuer endpoint | Server-side RBAC/ABAC on every action, separate roles, deny by default, tests for forbidden calls |
| Shared-secret admin compromise | Current lightweight admin secret is reused for higher-risk actions | Do not extend shared-secret model; introduce named accounts, MFA-capable auth, scoped roles, action logs |
| Capability/private-key compromise | Attacker issues/revokes records or upgrades package | Separate custody, hardware-backed protection before Mainnet, minimal hot capabilities, rotation/recovery plan, alerts |
| Upgrade abuse | Compromised upgrade authority changes rights | Upgrade policy, protected custody, review procedure, package version events, emergency pause |
| Gas sponsor drain | User submits arbitrary or expensive transactions | Allowlists, per-user/IP/device rate limits, gas caps, daily budget, dedicated address, simulation/validation, alerts |
| Sponsored transaction substitution | Sponsor signs altered call or recipient | Reconstruct/validate exact transaction kind, package/module/function, objects, sender, gas budget, network, expiry |
| Webhook replay/forgery | Duplicate or fake paid event issues passes | Signature verification, environment check, unique event ID, order idempotency, transactional handler, replay tests |
| Duplicate issuance | Timeout/retry creates multiple entitlements | Unique issuance key, state machine, transaction digest storage, reconciliation |
| Sponsor double booking | Concurrent checkouts reserve the same exclusive slot | Database unique constraint, transaction/locking, expiring holds, onchain slot state, reconciliation |
| Status race/stale cache | Revoked pass still unlocks content | Short cache, explicit invalidation, authoritative lookup for sensitive content, deny on uncertainty |
| Public metadata leakage | Object fields reveal member identity or private campaign | Minimal opaque IDs, data classification review, no private URLs/names without consent, metadata tests |
| Hash correlation | Published hash confirms possession/content of a private document | Salted/versioned manifest strategy where appropriate; assess whether a hash is necessary; never expose source file |
| Malicious upload | Sponsor or organization uploads malware or unsafe media | File allowlist, size limits, malware scan, metadata stripping, isolated processing, review before publication |
| Creative swap after approval | Sponsor replaces approved file | Immutable version IDs/hashes, approval bound to version, new review after any change |
| Event misinformation/spam | Credentialed account posts false schedule | Scoped permissions, editorial approval, source attribution, revision history, suspension path |
| Recovery social engineering | Attacker persuades support to reassign a pass | Documented evidence tiers, reauthentication, cooldown for risky cases, dual review where warranted, audit trail |
| Support data exposure | Agent can browse unnecessary private evidence | Least-privilege case access, redacted views, access logging, retention limits |
| Content link sharing | Signed URL grants broad/long access | Short-lived item-bound URLs/tokens, rate limits, access logs, no permanent protected URL |
| Deployment secret exposure | Token committed or exposed in frontend | Secret manager, scanning, no `NEXT_PUBLIC` secrets, rotation, separate environments |
| Database loss/corruption | Entitlement/payment mappings disappear | Managed backups, restore tests, immutable provider/Sui references, reconciliation rebuild plan |
| RPC/indexer outage | Access decision cannot verify status | Defined fail-closed behavior, bounded cache/grace policy, provider redundancy where justified, incident messaging |
| Denial of service | Login, access, or sponsor booking flooded | Rate limits, queues, bot controls, capacity monitoring, graceful degradation |
| Insider misuse | Admin issues complimentary passes or edits fulfillment improperly | Role separation, reason codes, append-only audit, periodic review, alerts for sensitive actions |

## Abuse cases by role

### Member

Attempts to reuse an expired pass, replay a sponsored transaction, enumerate private content, share signed URLs, create duplicate complimentary redemptions, or claim another social identity.

### Sponsor

Attempts to hold inventory without payment, upload unauthorized/malicious creative, replace approved creative, overstate fulfillment metrics, or transfer a placement outside MG251 approval.

### Organization

Attempts to impersonate an organization, add unauthorized representatives, publish unreviewed events, alter another organization’s records, or use verification as a broad endorsement.

### Administrator

Accidental or malicious over-issuance, revocation, refund, reassignment, credential grant, content disclosure, package upgrade, or gas spending.

## Security acceptance gates

Before public pilot:

- Authentication and server-side authorization tests pass.
- No privileged route depends solely on no-index metadata or a shared frontend secret.
- Webhook replay and duplicate issuance tests pass.
- Sponsor double-booking concurrency test passes.
- Sponsored transaction allowlist and gas-limit tests pass.
- Recovery tabletop exercise completes.
- Capability custody and emergency pause are documented.
- Secret scan is clean.
- Privacy/onchain metadata review is complete.
- Database restore and reconciliation procedures are demonstrated.

## Incident priorities

1. Stop further harm: pause issuance/sponsorship or disable affected route.
2. Preserve evidence and audit state.
3. Revoke/rotate compromised credentials or keys.
4. Reconcile payment, database, and Sui state.
5. Notify affected users/providers as required.
6. Restore through tested procedures.
7. Document root cause and corrective actions.
