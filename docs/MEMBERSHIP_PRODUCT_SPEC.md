# MG251 Membership Product Specification

## Product purpose

The MG251 Season Pass is a time-limited service entitlement that converts an external social audience into a direct MG251 account relationship. It is not company ownership, a financial instrument, a cryptocurrency investment, or a permanent media license.

## Configuration model

Membership products must be managed through configuration or administrative records rather than hard-coded labels and prices.

Required tier fields:

```text
tier_code
public_name
public_description
season_id
valid_from
expires_at
sale_start
sale_end
price_configuration
benefits_manifest_version
eligibility_rule
renewal_rule
upgrade_rule
refund_rule
recovery_rule
status
terms_version
```

Provisional fictional tiers used only in the prototype:

- Entry Pass
- VIP Pass
- Complimentary Pass
- Partner Pass
- Press or Contributor Pass

## Candidate benefits

A benefit may be enabled only after MG251 documents how it will be delivered. Candidate categories include:

- Premium parade/event alerts.
- Early access to selected announcements or replays.
- Premium livestream or archive access.
- Member route, parking, weather, or access guides.
- Priority event notifications.
- Member polls.
- Selected partner benefits.
- Reduced pricing or early access for defined MG251 products.

The benefits manifest must identify the exact benefit, eligible tiers, availability period, operational owner, access method, limitations, and withdrawal policy.

## Member-facing states

```text
Pending
Active
Suspended
Expired
Reassigned
Revoked
Canceled
```

The interface must show status, tier, season, valid dates, renewal/upgrade availability, current benefits, and support/recovery actions. It must not require the user to understand gas, transaction digests, package IDs, or object ownership.

## Issuance sources

- Direct conventional payment.
- Complimentary administrative issuance.
- Approved access code.
- Verified external membership.
- Future SUI/USDC/TREE payment, only after separate approval.

Each source requires a unique order or authorization reference so retries cannot create duplicate active entitlements.

## Access evaluation

The application must evaluate:

1. authenticated MG251 user;
2. linked Sui account/address;
3. authoritative pass record;
4. pass status;
5. current time against `valid_from` and `expires_at`;
6. required tier or benefit code;
7. suspension/revocation overrides;
8. current terms/policy version where acceptance is required.

Access must fail closed when authoritative status cannot be verified. A short operational grace policy may be configured later, but it must be explicit and audited.

## Transfer and recovery

No public transfer or marketplace exists. The pass may be reassigned only through the documented recovery process. The old account must no longer retain access after reassignment. A stale display object or screenshot is not proof of current entitlement.

## Renewal and upgrades

Renewal and upgrade behavior remains unresolved. The implementation must support configuration for:

- fixed-season renewal;
- manual renewal;
- future recurring renewal;
- immediate or future-dated upgrades;
- proration or no proration;
- external membership synchronization;
- grace period or immediate expiration.

No automatic renewal is activated until authorization, notices, cancellation, refund, and failed-payment handling are approved.

## Suspension and revocation

Suspension is temporary and reviewable. Revocation is a final access termination under the applicable terms unless an authorized administrator reverses it through a separately audited action. Reasons remain private unless disclosure is legally or operationally required.

## Notifications

Member preferences should separately control email, push, SMS, and general marketing where supported. Mandatory transactional/security notices must be distinguished from optional marketing messages.

## Prohibited promises

The Season Pass does not provide:

- ownership, voting, dividends, revenue sharing, interest, yield, buybacks, or staking;
- guaranteed resale or appreciation;
- ownership of media or intellectual property;
- a claim against Facebook, Instagram, YouTube, X, Patreon, or another platform;
- guaranteed access to every current or future MG251 service;
- a public transfer right.

## Prototype boundary

All names, users, orders, benefits, dates, and content shown under `/prototype/mg251` are fictional. No prototype action creates an account, collects payment, writes to Sui, sends a notification, or changes the live site.
