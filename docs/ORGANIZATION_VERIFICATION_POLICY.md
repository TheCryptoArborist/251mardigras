# MG251 Organization Verification Policy — Draft Framework

Status: Phase 0 draft. This document is not a public certification policy until approved.

## Purpose

MG251 may issue a nontransferable platform credential to an approved organization or representative. The credential communicates the scope of MG251’s own verification and grants defined platform permissions. It does not establish government approval, legal certification, event safety, insurance, solvency, or endorsement by another Mardi Gras organization.

## Potential eligible applicants

- Mardi Gras organizations.
- Community organizations.
- Nonprofits.
- Event organizers.
- Local businesses and vendors.
- Government/public agencies.
- Media partners.
- Other contributors approved under written criteria.

Final eligibility remains an open business decision.

## Verification levels

| Level | Meaning | Possible permissions |
| --- | --- | --- |
| Identity Verified | MG251 verified the applicant account against the approved process | Complete applications, receive notices |
| Organization Verified | MG251 verified the organization relationship and approved public identity | Manage organization profile drafts, expedited submission |
| Authorized Event Manager | Organization authorized the account to manage specified events | Create/edit authorized event drafts |
| Official Information Source | MG251 approved the account as a source for specific official updates | Submit official corrections with source attribution |
| Commercial Partner | Active commercial relationship under separate agreement | Access sponsor/partner workflow |
| Media Partner | Approved media relationship under separate terms | Access designated media workflow |

One account may hold multiple scoped permissions. Labels and permissions must not be conflated.

## Application data

Public-facing application fields should be separated from private evidence. Private evidence may include organization contact, representative role, authorization evidence, supporting documents, and reviewer notes. Collect only what the approved policy requires.

Do not place personal contacts, private email/phone, home address, tax ID, government ID, internal documents, payment records, credentials, or verification evidence on Sui.

## Review workflow

1. Applicant creates an MG251 account.
2. Applicant selects requested organization and permission scope.
3. Applicant provides required private evidence and public-display consent.
4. Reviewer validates evidence against the current policy.
5. Reviewer records findings and decision.
6. Approved application creates a credential record with explicit level, scope, dates, status, and policy version.
7. Applicant receives permission only after both offchain and onchain state reconcile.
8. Credential expires or enters renewal review according to policy.

## Public name and consent

The organization’s public name may be included onchain only when:

- the organization authorized public display;
- the exact approved spelling is documented;
- no private representative information is included;
- MG251 can remove future display references where operationally possible, while acknowledging immutable historical events may remain public.

An opaque `organization_reference` should be used when public display is not authorized.

## Editorial authority

Verification does not automatically publish every submission. The MVP rule is:

- verified organizations may create and revise authorized drafts;
- MG251 editorial administrators approve, reject, schedule, publish, unpublish, or request correction;
- every revision records actor, timestamp, changed fields, source, and editorial outcome;
- emergency correction paths remain auditable.

## Status model

```text
Pending Review
Verified
Renewal Due
Expired
Suspended
Revoked
Rejected
```

Suspension temporarily removes credential permissions. Revocation removes them until a new approved process occurs. Rejection reasons remain private unless disclosure is required.

## Representative management

Organization authority belongs to verified representative assignments, not shared passwords. Adding/removing representatives requires:

- authorized organization action or MG251 review;
- least-privilege role selection;
- expiration or periodic review;
- immediate revocation path;
- audit record.

## Renewal

The final review cadence is unresolved. Renewal should verify that the organization still exists, the representative remains authorized, public display consent remains current, and the requested permission scope remains appropriate.

## Appeals and corrections

The policy should provide a support channel for factual correction, reconsideration, representative removal, compromised-account response, and public-name correction. Appeals do not preserve platform permissions during a suspension unless an authorized reviewer grants a documented temporary exception.

## Prohibited implications

A credential may not claim or imply:

- City of Mobile or government endorsement;
- endorsement by another Mardi Gras society;
- legal compliance certification;
- financial solvency;
- insurance coverage;
- event safety or accessibility certification;
- guaranteed accuracy outside the facts MG251 actually checked;
- editorial immunity.
