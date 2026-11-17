# MG251 Product Rights Matrix

This matrix is the binding product-design boundary for the MVP. Any change that adds transferability, cash redemption, investment rights, ownership, or a profit expectation requires a separate legal and product review.

| Product | Rights granted | Duration | Holder action | MG251 action | Transferability | Refund/cash treatment | Public data | Private data | Investment rights |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Season Pass | Access to configured member benefits and content | Explicit start and expiration | View, use benefits, request renewal/upgrade/recovery | Issue, activate, renew, upgrade, suspend, revoke, expire, reassign through recovery | No public transfer; no marketplace | Governed by membership refund policy; not cash redeemable | Opaque ID, season/tier code, dates, status, issuer, policy versions | Identity, contact, billing, social link, order, support history | None |
| Complimentary Pass | Same configured access as its assigned tier | Explicit start and expiration | View and use benefits | Issue only through authorized role; suspend/revoke/expire | No | No cash value | Same minimal pass metadata | Issuance reason and approval record | None |
| Partner/Press Pass | Defined partner or media access | Explicit start and expiration | Use configured access | Issue, constrain, suspend, revoke, expire | No | No cash value unless separate contract states otherwise | Opaque ID, tier code, dates, status | Identity, affiliation, agreement, notes | None |
| Sponsor Placement Receipt | Defined contracted advertising deliverables | Campaign/reservation period | Submit creative, review status/evidence, request permitted changes | Reserve, approve, schedule, mark live/fulfilled, cancel/refund/dispute | No public transfer; MG251-approved reassignment only | Agreement and refund policy control | Placement/slot code, product code, campaign window, status, hashes | Price, contract, billing contact, creative drafts, reports | None |
| Verified Organization Credential | Defined platform permissions and verification status | Expiring credential | Submit/manage authorized records, request renewal | Verify, issue, renew, suspend, revoke, expire | No | No cash value | Credential ID, level, dates, status, optional consented public name | Representatives, evidence, private contact, review notes | None |
| Contributor Badge | Recognition or configured noncash feature access | Badge-specific | Display or use limited feature | Issue/revoke after verification | No | No cash redemption | Badge type/date/status if public display is enabled | Submission evidence and moderation record | None |
| Premium Content Grant | Access to selected protected content | Entitlement/content window | View authorized content | Publish, restrict, archive, withdraw | Not transferable | No separate cash redemption | Content reference, tier rule, release window, status | Actual media, access logs, license records | None |
| Future equity/note/revenue instrument | Rights defined by separate legal instrument | Instrument-specific | Instrument-specific | Instrument-specific | Restricted | Instrument-specific | Separate project | Separate project | Yes; excluded |

## Prohibited category blending

The following combinations are prohibited in the MVP:

- A Season Pass that also promises profit, dividends, resale support, buybacks, staking yield, or ownership.
- A Sponsor Receipt that claims permanent ownership of website space or social-account access.
- An Organization Credential that implies government certification, safety approval, insurance, solvency, or endorsement by another organization.
- A Contributor Badge that is transferable, cash redeemable, or automatically issued for unverified submissions.
- A premium-content object that publicly exposes the protected file or private metadata.

## Access-decision rule

A visual pass, badge, receipt, screenshot, transaction digest, cached response, or holder-owned display object is not independently authoritative. The server must evaluate the current authoritative entitlement/credential record, current time, status, tier rule, and relevant policy version before granting protected access.

## Status-effect rule

| Status | Access effect |
| --- | --- |
| Pending / Pending Review | No protected access unless an explicit temporary grant exists |
| Active / Verified | Access according to configured rights |
| Suspended | Access denied pending review |
| Expired | Access denied except renewal/support functions |
| Reassigned | Old account denied; replacement account evaluated |
| Revoked | Access denied; reissue requires a new authorized decision |
| Canceled / Refunded | Access handled by controlling policy and reconciliation record |
| Disputed | Access determined by documented dispute policy, not an implicit default |

## Change control

Every product specification must identify:

- rights granted;
- rights excluded;
- eligibility;
- duration;
- status transitions;
- transfer/recovery rule;
- payment/refund rule;
- public/private data;
- administrative authority;
- audit events;
- controlling terms version.
