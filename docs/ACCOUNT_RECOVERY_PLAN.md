# MG251 Account Recovery Plan

Status: Draft framework. Final evidence and support procedures require approval.

## Objectives

- Restore legitimate access after device, provider, session, embedded-account, or organizational representative loss.
- Prevent an attacker from using support to seize a pass, sponsor placement, credential, or administrative role.
- Avoid unrestricted self-transfer.
- Preserve a complete audit trail.
- Minimize and promptly retire sensitive recovery evidence.

## Recovery triggers

- Lost or replaced device.
- Lost social-login provider access.
- Changed email or provider account.
- Lost zkLogin salt or inability to reproduce the prior Sui address.
- Compromised account/session.
- Deceased or departed organization representative.
- Sponsor employee turnover.
- Incorrect initial account linkage.
- Administrative account compromise.

## Standard member recovery flow

```text
User opens recovery case
→ existing sessions and risk signals are reviewed
→ user provides the approved minimum evidence
→ high-risk actions are temporarily restricted
→ support verifies the case under the evidence matrix
→ authorized recovery administrator approves or denies
→ old entitlement is suspended
→ replacement MG251 account/Sui address is established
→ authoritative holder field is reassigned, or old record is revoked and replacement issued
→ Sui recovery event and offchain audit record are written
→ old account is denied access
→ user receives security confirmation
→ sensitive evidence is retained only for the approved period
```

## No unrestricted transfer

The user-facing product does not expose a generic transfer function. Recovery is an issuer-controlled administrative lifecycle action. A compromised holder must not be able to move the entitlement freely before support can intervene.

## Evidence tiers

Final evidence is unresolved. The policy should define risk-based tiers rather than collecting every possible document.

Potential signals:

- access to current verified email/provider;
- prior account/session/device continuity;
- order/payment reference verification through a safe method;
- prior support or membership details not publicly available;
- organization-authorized representative confirmation;
- sponsor contract/contact verification;
- delay/cooldown and notification to the prior account;
- dual review for VIP, partner, sponsor, credential, or administrator recovery.

Do not request full card numbers, passwords, seed phrases, or third-party credentials.

## zkLogin-specific requirement

The design must document how the salt is created, stored, recovered, and protected. A user’s Sui address depends on the same identity inputs and salt; loss or mismatch can produce an unrecoverable prior address. MG251 therefore needs an account layer that can map a verified person/account to a replacement address and execute controlled reassignment or reissue.

## Organization representative recovery

Organization access is not shared-password access. When a representative departs or loses access:

1. suspend the affected representative assignment;
2. verify authorization through the organization’s approved process;
3. add a newly verified representative with scoped permissions;
4. remove old sessions and permissions;
5. record who approved the change;
6. leave the organization credential’s public meaning unchanged unless the organization itself requires reverification.

## Sponsor recovery

Sponsor dashboard recovery must verify the contracting entity and authorized contact. It may reassign the authorized sponsor account only through the controlling agreement/support procedure. The public placement remains nontransferable.

## Administrative recovery

Administrative/capability recovery requires a separate high-security runbook:

- no ordinary member-support override;
- protected backup/custody process;
- minimum two-person review where practical;
- emergency pause consideration;
- key/capability rotation;
- incident logging and reconciliation;
- production notification obligations.

## Risk controls

- Rate-limit case creation and evidence attempts.
- Avoid revealing whether a specific social address/account exists.
- Reauthenticate support agents for sensitive decisions.
- Record reason codes and approver identity.
- Notify old and new contact channels where safe.
- Use cooldowns for high-risk reassignment when no active compromise requires immediate action.
- Deny premium access during unresolved suspicious recovery where policy permits.
- Prevent concurrent recovery cases from racing.
- Bind recovery completion to one idempotency key.

## Reassignment versus revoke/reissue

### Reassignment

Preferred when the authoritative shared record can safely update `holder_address` and preserve the same serial/history.

### Revoke and reissue

Preferred when policy, package version, corrupted state, or legal recordkeeping requires a new record. The new record must reference the recovery case and predecessor offchain; public events use opaque references.

In both cases, the old account loses authority immediately when the successful recovery transition finalizes.

## Recovery acceptance tests

- Attacker without approved evidence cannot reassign a pass.
- Old account is denied after recovery.
- Duplicate completion requests do not create duplicate passes.
- Suspended/revoked records cannot be recovered through an ordinary renewal endpoint.
- Organization representative changes do not grant unrelated permissions.
- Every recovery action records case ID, actor, approval, old/new account references, timestamp, outcome, and Sui digest.
- Recovery evidence is not emitted onchain or written to ordinary logs.
