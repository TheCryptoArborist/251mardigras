# MG251 Privacy and Retention Requirements

Status: Draft requirements for product and counsel review.

## Privacy requirements

MG251 must provide a clear privacy notice describing:

- categories of information collected;
- purposes and legal/business basis;
- service providers and social/payment integrations;
- public Sui data and its persistence;
- premium-content access logging;
- sponsor and organization workflows;
- communication preferences;
- account recovery;
- retention and deletion limitations;
- contact and complaint process.

The interface must distinguish public onchain information from private MG251 account information before the user receives a pass or credential.

## Data minimization

- Collect only fields required for the current product/policy.
- Do not require a home address unless billing, fulfillment, or a documented verification rule needs it.
- Do not copy private Jotform submitter data into public events.
- Do not place identity, contact, billing, verification, recovery, or social-token data on Sui.
- Avoid storing raw OAuth claims when stable internal references are sufficient.
- Avoid indefinite file retention by default.

## Retention schedule framework

Final periods require legal, tax, contract, platform, and operational review.

| Record category | Provisional trigger | Required decision |
| --- | --- | --- |
| Account profile | Account closure/inactivity | Support, fraud, and legal retention period |
| Payment/order/refund/chargeback | Transaction completion | Tax/accounting and dispute period |
| Membership entitlement mirror | Expiration/revocation | Audit/support period |
| Sponsor contract and fulfillment | Campaign completion | Contract, tax, and claim period |
| Creative drafts | Approval/campaign completion | Delete rejected/superseded versions after defined period |
| Organization verification evidence | Credential expiration/revocation | Minimize and delete when no longer required |
| Event revisions | Publication/withdrawal | Editorial provenance and correction period |
| Premium content access logs | Access event | Short security/analytics period unless licensing requires more |
| Recovery evidence | Case closure | Short, restricted retention after decision |
| Security/incident logs | Event/incident closure | Risk-based period |
| Marketing preferences | Consent withdrawal | Preserve suppression proof without continued marketing profile |
| Onchain records | Issuance | Public and not practically erasable; minimize before publication |

## User requests

The production system needs a documented process for:

- access to account information;
- correction;
- account closure;
- communication opt-out;
- representative removal;
- organization public-name correction;
- content/privacy complaint;
- deletion where applicable;
- explanation of data that cannot be removed from a public blockchain.

A request must not erase legally required payment, fraud, security, or contract records without review.

## Public blockchain disclosure

Before issuance, the user should be told in ordinary language that MG251 creates a public digital entitlement record containing minimal identifiers, dates, status, and technical references. Public records may remain visible after expiration, reassignment, or revocation even though access is disabled.

## Third-party processors

Maintain a processor inventory covering authentication, payment, email/SMS, hosting, database, storage/CDN, analytics, support, GitHub/Netlify deployment, Sui RPC/indexing, gas sponsorship, and future Walrus/Seal services. Record purpose, data categories, region, retention, contract, incident contact, and deletion capability.

## OAuth and social integrations

- Request minimum scopes.
- Never request or store a user’s social password.
- Store tokens encrypted and offchain only when truly required.
- Provide a reconnection and provider-loss path.
- Do not make permanent access depend on an unrecoverable fragile integration.
- Document how external membership termination affects MG251 access.

## Children and age requirements

The launch policy must define minimum age, purchaser/guardian handling, communications, event submissions, and content access. The prototype makes no age eligibility representation.

## Backups

Retention/deletion procedures must include databases, object storage, logs, support tools, and backups. Backup restoration must not silently reactivate deleted accounts or revoked access.

## Privacy review gate

No real member, sponsor, organization, payment, recovery, or verification data may be introduced until:

1. final field inventory exists;
2. privacy notice and terms are approved;
3. retention schedule is approved;
4. role access is tested;
5. encryption and secret handling are reviewed;
6. deletion/correction procedures are tested;
7. public onchain disclosure is approved.
