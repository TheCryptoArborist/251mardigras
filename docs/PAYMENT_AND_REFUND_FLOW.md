# MG251 Payment and Refund Flow

Status: Phase 0 design. No production payment is authorized.

## Payment priority

1. Conventional card/online payment.
2. Complimentary or promotional access code.
3. Approved external-membership verification.
4. Future SUI or USDC payment.
5. Optional TREE payment in a later separately approved phase.

No customer must acquire cryptocurrency to join MG251.

## Source-of-truth model

| Question | Authoritative source |
| --- | --- |
| Was a card charge authorized/settled/refunded/charged back? | Payment provider and MG251 payment ledger |
| What order and product did the customer buy? | MG251 order database |
| Is the tokenized entitlement currently active? | Authoritative Sui record, reconciled to MG251 database |
| What benefits/content may the account access? | MG251 policy/configuration plus current entitlement status |

Neither system may silently overwrite the other. Mismatches enter reconciliation review.

## Test-mode fiat flow

```text
Customer creates order
→ server calculates configured product/price
→ payment provider creates test checkout
→ provider returns signed webhook
→ server verifies signature and environment
→ durable WebhookEvent is inserted by provider event ID
→ order/payment transition is applied exactly once
→ issuance job uses a unique issuance key
→ sponsored Sui Testnet transaction creates/activates entitlement
→ transaction result is stored
→ customer receives confirmation
```

## Idempotency requirements

- Unique constraint on payment-provider event ID.
- Unique constraint on successful entitlement issuance per order/product/season.
- Transactional status updates.
- Safe retry after timeout.
- No issuance based only on browser redirect or client claim.
- Separate handling for duplicate, out-of-order, and delayed webhooks.
- Operator-visible exception queue.

## Payment states

```text
Created
Pending
Authorized
Paid
Failed
Canceled
Partially Refunded
Refunded
Charged Back
Disputed
```

Payment state and pass state are related but not identical. The approved policy defines the transition between them.

## Renewal

Renewal remains configurable and unresolved. No automatic renewal is enabled until MG251 approves:

- explicit authorization language;
- price and renewal date disclosure;
- reminder notices where required;
- cancellation path;
- failed-payment behavior;
- grace period;
- partial-season treatment;
- refund policy;
- external membership synchronization.

## Member refund flow

```text
Refund request or provider event
→ verify order, policy, delivery, and requester
→ approve/deny/partially approve under policy
→ payment provider processes refund
→ MG251 records refund event
→ entitlement status changes according to policy
→ Sui lifecycle event is submitted
→ database/Sui reconciliation completes
→ customer receives decision and effective-access date
```

The policy must decide whether access ends immediately, at the refund effective time, or after a defined period.

## Sponsor cancellation/refund flow

Sponsor treatment depends on the agreement, campaign stage, incurred work, noncancelable inventory, make-good options, and completed deliverables. The system must not assume a universal full-refund rule. Every adjustment records agreement version, approver, reason, financial event, inventory release decision, and onchain status transition.

## Chargebacks and disputes

Provisional technical behavior is to place the entitlement/reservation into an operator-review state and prevent duplicate replacement issuance. Final access treatment is a policy decision. Evidence and correspondence remain private.

## Complimentary access codes

Codes require:

- campaign/code identifier;
- allowed product/tier;
- start/end and redemption limit;
- single-use or multi-use behavior;
- eligibility rule;
- issuer/approver;
- redemption audit;
- revocation/abuse handling.

Codes are not stored in plaintext after issuance where avoidable.

## Future crypto payment

A future crypto checkout must lock a quoted amount for a defined window, verify finality, record fair-market-value/accounting data, prevent underpayment/replay, and define refund denomination/value rules. Paying with TREE, SUI, or USDC grants no extra ownership or investment rights.

## Reconciliation dashboard

Operators need queues for:

- paid order with no entitlement;
- entitlement with missing paid/authorized order;
- refund/chargeback with active entitlement;
- failed or expired sponsored transaction;
- duplicate webhook;
- onchain/database status mismatch;
- sponsor reservation/payment mismatch.
