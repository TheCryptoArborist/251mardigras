# MG251 Sui Move Architecture

Status: Proposed Testnet architecture. No Mainnet deployment is authorized.

## Design goals

- Represent controlled service rights and audit state, not a fungible coin.
- Support issuer-controlled issuance, renewal, upgrade, suspension, revocation, expiration handling, and recovery reassignment.
- Prevent unrestricted public transfer.
- Keep private member, sponsor, organization, payment, and document data offchain.
- Emit complete lifecycle events.
- Separate privileged roles.
- Keep package IDs, object IDs, addresses, and network configuration outside source code.

## Critical ownership decision

A Sui object with `key` but without `store` cannot use unrestricted `public_transfer`; transfer can be limited to functions in the defining module. However, an **address-owned object is controlled by the holder address**. That ownership model is not sufficient by itself when MG251 must suspend, revoke, renew, or reassign an entitlement after the holder is unavailable or compromised.

Therefore, the MVP’s authoritative mutable lifecycle objects should be **shared objects or shared-registry child records**, with `holder_address` or `authorized_account` stored as a field and every mutation guarded by the relevant capability. No public transfer function is exposed.

An optional address-owned display/badge object may be added later, but it must never be the sole access authority because it can become stale after suspension or revocation.

Official references:

- Custom transfer rules: https://docs.sui.io/concepts/transfers/custom-rules
- Object ownership: https://docs.sui.io/concepts/object-ownership
- Object Display: https://docs.sui.io/standards/display

## Package structure

```text
move/mg251_membership/
├── Move.toml
├── sources/
│   ├── registry.move
│   ├── season.move
│   ├── pass.move
│   ├── sponsor.move
│   ├── organization.move
│   ├── content.move
│   ├── events.move
│   ├── errors.move
│   └── version.move
└── tests/
    ├── registry_tests.move
    ├── pass_tests.move
    ├── sponsor_tests.move
    ├── organization_tests.move
    └── authorization_tests.move
```

Modules may be consolidated during implementation if clearer and safer, but role separation and tests remain required.

## Registry

```move
public struct MG251Registry has key {
    id: UID,
    platform_name: String,
    issuer: address,
    active_season: u64,
    terms_version: u64,
    privacy_version: u64,
    package_version: u64,
    issuance_paused: bool,
    created_at_ms: u64,
    updated_at_ms: u64,
}
```

The registry is shared. It contains no personal information.

## Capabilities

```move
public struct MG251AdminCap has key, store { id: UID }
public struct PassIssuerCap has key, store { id: UID }
public struct SponsorManagerCap has key, store { id: UID }
public struct OrganizationVerifierCap has key, store { id: UID }
public struct ContentManagerCap has key, store { id: UID }
public struct EmergencyCap has key, store { id: UID }
```

Capability functions must verify the expected capability type and registry/package relationship. Capability objects are never transferred to a public frontend or stored in a general-purpose hot wallet.

## Season configuration

```move
public struct SeasonConfig has key {
    id: UID,
    registry_id: ID,
    season_id: u64,
    season_code: String,
    valid_from_ms: u64,
    expires_at_ms: u64,
    status: u8,
    terms_version: u64,
    created_at_ms: u64,
    updated_at_ms: u64,
}
```

Tier names, benefits, prices, and private terms remain offchain/configured. Public tier codes and manifest hashes may be referenced by pass records.

## Season Pass Record

```move
public struct SeasonPassRecord has key {
    id: UID,
    registry_id: ID,
    serial_number: u64,
    season_id: u64,
    tier_code: String,
    holder_address: address,
    issued_at_ms: u64,
    valid_from_ms: u64,
    expires_at_ms: u64,
    status: u8,
    issuance_source_code: u8,
    terms_version: u64,
    benefits_manifest_hash: vector<u8>,
    updated_at_ms: u64,
}
```

Required entry functions, all capability-guarded as applicable:

- `issue_pass`
- `renew_pass`
- `upgrade_pass`
- `suspend_pass`
- `reassign_pass`
- `revoke_pass`
- `cancel_pass`

Expiration should be evaluated from `expires_at_ms` during access checks even if no transaction has yet materialized an `Expired` status. A maintenance function may synchronize display status, but time validity cannot depend on a cron transaction.

## Sponsor Inventory Slot

```move
public struct SponsorInventorySlot has key {
    id: UID,
    registry_id: ID,
    slot_reference: String,
    product_code: String,
    season_id: u64,
    campaign_start_ms: u64,
    campaign_end_ms: u64,
    status: u8,
    placement_id: Option<ID>,
    updated_at_ms: u64,
}
```

A slot may transition from available to reserved only once unless an authorized cancellation explicitly releases it. The offchain database remains responsible for transactional checkout holds; the onchain slot provides verifiable lifecycle state and a second guard.

## Sponsor Placement Record

```move
public struct SponsorPlacementRecord has key {
    id: UID,
    registry_id: ID,
    slot_id: ID,
    placement_reference: String,
    product_code: String,
    season_id: u64,
    authorized_sponsor: address,
    campaign_start_ms: u64,
    campaign_end_ms: u64,
    status: u8,
    deliverables_manifest_hash: vector<u8>,
    fulfillment_manifest_hash: vector<u8>,
    issued_at_ms: u64,
    fulfilled_at_ms: Option<u64>,
    terms_version: u64,
    updated_at_ms: u64,
}
```

Negotiated price, agreement, billing contact, creative, and private performance details remain offchain.

## Organization Credential Record

```move
public struct OrganizationCredentialRecord has key {
    id: UID,
    registry_id: ID,
    credential_reference: String,
    organization_reference: String,
    approved_public_name: Option<String>,
    credential_level: u8,
    authorized_account: address,
    issued_at_ms: u64,
    expires_at_ms: u64,
    status: u8,
    verification_policy_version: u64,
    updated_at_ms: u64,
}
```

The public name is optional and is included only after documented consent.

## Content Release

```move
public struct ContentRelease has key {
    id: UID,
    registry_id: ID,
    content_reference: String,
    required_tier_code: String,
    release_at_ms: u64,
    access_expires_at_ms: Option<u64>,
    encrypted_storage_reference: Option<String>,
    content_manifest_hash: vector<u8>,
    status: u8,
    created_at_ms: u64,
    updated_at_ms: u64,
}
```

For the MVP, private storage identifiers should normally stay offchain. This object can initially omit `encrypted_storage_reference` and keep only an opaque content reference and manifest hash.

## Fulfillment Record

Fulfillment records should be append-only objects/events associated with a placement. Corrections create a new record referencing the prior record; they do not silently replace history.

## Events

Emit events for every privileged lifecycle action, including:

```text
SeasonCreated
PassIssued
PassRenewed
PassUpgraded
PassSuspended
PassReassigned
PassRevoked
PassCanceled
SponsorSlotCreated
SponsorPlacementReserved
SponsorCreativeApproved
SponsorPlacementScheduled
SponsorPlacementLive
SponsorPlacementFulfilled
SponsorPlacementCanceled
SponsorPlacementRefunded
OrganizationCredentialIssued
OrganizationCredentialRenewed
OrganizationCredentialSuspended
OrganizationCredentialRevoked
ContentPublished
ContentAccessPolicyChanged
IssuancePaused
IssuanceResumed
PackageVersionChanged
```

Events use opaque references and addresses only; private reasons and documents remain offchain.

## Display V2

Use Sui Object Display V2 for human-readable public fields such as product name, season code, public status, expiration, and generic image reference. Display metadata must not reveal member identity, billing state, private sponsor identity, dispute details, or verification evidence.

## Concurrency and shared-object design

Avoid routing every action through one heavily contended mutable registry object. The registry anchors configuration and pause state; each pass, slot, placement, credential, and content record should be independently addressable/shared where practical. The backend must account for shared-object versions and retry safely.

## Status representation

Move may use `u8` values with constants and validation functions for compactness. Invalid status values and transitions abort. Offchain TypeScript types must map exactly to the package version.

## Clock and time

Use the Sui `Clock` for timestamp-sensitive entry functions. Access services must independently evaluate current time and authoritative object fields; they must not trust a client clock.

## Pause behavior

`EmergencyCap` may pause issuance and selected administrative mutations. Pause should not silently reactivate expired access or prevent necessary revocation/security actions. Exact allowed operations during pause require tests and documentation.

## Upgrade policy

- Record package version in the registry.
- Keep upgrade authority separate from routine issuer/sponsor/verifier accounts.
- Review storage compatibility and event semantics.
- Test migration/reconciliation on Testnet.
- No Mainnet upgrade or deployment in the initial sprint.

## Required Move tests

- Unauthorized caller cannot issue or mutate records.
- Public transfer functions are unavailable.
- Valid status transitions succeed; invalid transitions abort.
- Expiration boundary behaves correctly.
- Reassignment changes authoritative account and records an event.
- Old account no longer satisfies access check after reassignment.
- Exclusive sponsor slot cannot be reserved twice.
- Fulfillment requires permitted prior status and evidence hash.
- Credential permissions end after suspension/revocation/expiration.
- Pause blocks issuance but preserves emergency/security actions.
- No public object contains prohibited personal fields.
