# MG251 Sponsor Inventory Specification

## Purpose

MG251 sells specifically defined advertising deliverables, not a generic advertising token. The sponsor system must separate reusable product definitions from uniquely bookable inventory slots and from the final placement/fulfillment record.

## Domain model

### Sponsor Product

A configurable commercial template:

```text
product_code
public_name
public_description
channel
placement_type
default_duration
creative_requirements
approval_required
fulfillment_evidence_rule
reporting_rule
cancellation_rule
exclusivity_rule
active
terms_version
```

### Sponsor Inventory Slot

A uniquely bookable occurrence:

```text
slot_id
product_code
season_id
publication_start
publication_end
exclusive_key
status
hold_expires_at
reservation_id
created_at
updated_at
```

An exclusive slot must have a database uniqueness constraint covering its exclusive key and time window. Reservation must occur inside a transaction or equivalent concurrency-safe operation.

### Sponsor Reservation

The offchain business workflow record containing sponsor account, private contacts, negotiated price, agreement, payment state, creative state, approvals, internal notes, and reconciliation identifiers.

### Sponsor Placement Record

The minimal Sui lifecycle record containing placement/slot code, product code, authorized sponsor address, campaign window, status, document hashes, issue/fulfillment timestamps, terms version, and update timestamp.

## Provisional product families

- Homepage featured sponsor.
- Featured community event.
- Parade replay sponsorship.
- Livestream sponsor acknowledgment.
- Food & Drink placement.
- Mardi Gras Gear placement.
- Newsletter placement.
- Social media feature.
- Video or livestream commercial.
- Presenting sponsor package.
- Multi-deliverable seasonal package.

Final inventory, prices, deliverables, channel availability, and exclusivity remain open decisions.

## Status model

```text
Available
Reserved
Awaiting Payment
Awaiting Creative
Under Review
Approved
Scheduled
Live
Fulfilled
Canceled
Refunded
Disputed
```

Only valid transitions may be executed. Examples:

- `Available → Reserved` requires an unexpired availability check.
- `Reserved → Awaiting Payment` requires accepted terms.
- `Awaiting Payment → Awaiting Creative` requires confirmed payment or authorized invoice approval.
- `Under Review → Approved` requires an authorized creative reviewer.
- `Scheduled → Live` requires the campaign window and publication evidence.
- `Live → Fulfilled` requires the product-specific fulfillment evidence.

## Double-booking prevention

Defense in depth:

1. Unique offchain slot/exclusive key.
2. Transactional reservation or compare-and-set update.
3. Expiring temporary holds.
4. Onchain `SponsorInventorySlot` status transition guarded by `SponsorManagerCap`.
5. Idempotent reservation and receipt issuance keys.
6. Reconciliation job comparing database and Sui status.
7. Manual exception queue.

A sponsor receipt must never be issued merely because a checkout page was opened.

## Creative workflow

- Sponsor submits files to private storage.
- File type, size, malware, and image/video constraints are validated.
- MG251 records a versioned creative submission.
- Authorized reviewer approves or rejects the exact version.
- Any post-approval change creates a new version and returns to review.
- Only approved versions can be scheduled.
- Public asset URLs are created only when publication is intended.

## Fulfillment evidence

Each product must define objective evidence before sale, such as:

- timestamped screenshot or archive capture;
- public URL and publication window;
- livestream/video timestamp;
- delivery log;
- newsletter send record;
- versioned creative hash;
- performance report, where promised.

The onchain record stores evidence/report hashes, not private reports or negotiated metrics.

## Reassignment, cancellation, disputes, and refunds

There is no public resale. Any reassignment requires MG251 approval and a written update to the controlling agreement. Cancellation, partial performance, refund, make-good placement, and dispute rules are product/contract terms. A status change on Sui must follow the controlling business decision and leave an audit trail.

## Prohibited representations

The receipt does not grant permanent ownership of website space, a social account, audience members, future inventory, intellectual property, editorial control, or an investment interest in MG251.
