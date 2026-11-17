# MG251 Data Classification

## Classification principles

1. Sui data is public and durable; publish only intentionally public, minimal fields.
2. A hash may still confirm or correlate a private document; do not treat hashing as anonymization.
3. Pseudonymous addresses can become identifiable through account linkage or user behavior.
4. Private evidence and secrets remain offchain.
5. Testnet development uses fictional data only.
6. Every field requires a purpose, owner, retention rule, and access rule.

## Class P0 — Public onchain

Permitted examples:

- Opaque pass, placement, slot, credential, season, and content references.
- Tier or product code designed for public display.
- Issue, valid-from, expiration, campaign, completion, and update timestamps.
- Current lifecycle status.
- Issuer address and package/policy/terms versions.
- Authorized account address.
- Consented public organization name.
- Benefits, deliverables, fulfillment, or report manifest hashes.
- Public audit-event timestamps and action types.

Restrictions:

- Use opaque identifiers rather than emails, usernames, order numbers, or social IDs.
- Do not embed private file URLs.
- Do not publish negotiated price, billing status, dispute reason, recovery reason, or moderator notes.
- Display metadata must remain minimal.

## Class P1 — Public website

Examples:

- Public event details.
- Public organization profile approved for display.
- Public sponsor creative during campaign.
- Public membership product description and terms summary.
- Public sponsor opportunities and standardized deliverables.
- Public editorial corrections.

Public website data may still be editable/removable; it should not automatically be duplicated onchain.

## Class C1 — Member/customer confidential

Examples:

- Name, email, telephone number.
- Billing and mailing address.
- Social account identifiers.
- Notification preferences.
- Support history.
- Membership order details.
- Account recovery evidence.
- Device/session/security metadata.

Access: the user, authorized support, and narrowly scoped administrators.

## Class C2 — Organization/sponsor confidential

Examples:

- Representative identity and contact.
- Verification documents.
- Organization authorization evidence.
- Sponsor contracts and negotiated pricing.
- Billing contacts.
- Creative drafts and rejected versions.
- Private performance reports.
- Unpublished event details.
- Internal campaign notes.

Access: assigned representatives and authorized MG251 roles.

## Class I1 — Internal restricted

Examples:

- Payment/refund/chargeback ledger.
- Tax/accounting records.
- Editorial/moderation notes.
- Complaint and dispute records.
- Fraud/risk findings.
- Administrative audit logs.
- Gas-spend monitoring.
- Incident records.
- Legal correspondence.
- Content-rights evidence.

Access is role-based and logged.

## Class S1 — Secrets

Examples:

- OAuth client secrets.
- Payment-provider secrets and webhook keys.
- Session signing/encryption keys.
- Sui private keys and capability custody material.
- Gas-sponsor signing key.
- Database credentials.
- Storage credentials.
- GitHub/Netlify deployment tokens.
- Email/SMS provider keys.

Rules:

- Never commit to source control.
- Never expose through `NEXT_PUBLIC_*` variables.
- Store in the deployment secret manager or hardware-backed custody as appropriate.
- Rotate after suspected exposure.
- Separate Testnet and production values.

## Class X — Prohibited storage

Do not store unless a separately approved legal/operational requirement exists:

- Payment card numbers/CVV.
- User passwords for third-party platforms.
- Seed phrases or member private keys.
- Government IDs onchain.
- Home addresses onchain.
- OAuth access/refresh tokens onchain.
- Private contact details onchain.
- Real identity or payment documents in Testnet fixtures.

## Data map by product

| Data | Sui | MG251 database | Private storage | Public website |
| --- | --- | --- | --- | --- |
| Pass status/dates/tier code | Minimal public record | Mirrored/indexed | No | Member dashboard after auth |
| Member identity/contact | No | Yes | Evidence only where needed | No |
| Payment events | No | Yes | Provider receipts where needed | No |
| Sponsor slot/product/status | Minimal public record | Yes | No | Public inventory summary as configured |
| Sponsor contract/price | No | Yes | Yes | No |
| Sponsor creative | Hash/reference only | Metadata | Yes | Approved published version only |
| Organization credential status | Minimal public record | Yes | No | Public name/level only with consent |
| Verification evidence | No | Metadata | Yes | No |
| Event draft/revisions | Hash only if justified | Yes | Assets | Approved public version only |
| Premium media | Reference/policy only | Metadata | Yes | Protected response only |
| Recovery evidence | No | Case metadata | Yes | No |

## Logging rule

Logs must redact secrets, payment details, identity documents, signed URLs, OAuth tokens, and full recovery evidence. Production logs need retention, access, and deletion controls distinct from ordinary application data.
