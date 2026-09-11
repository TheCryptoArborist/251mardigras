# MG251 Gas Sponsorship Policy

Status: Testnet draft. No production gas budget or sponsor key is approved.

## Purpose

MG251 may sponsor Sui transactions so ordinary members, sponsors, and organization representatives do not need to acquire SUI or understand gas. Sponsorship is a restricted platform service, not a general gas faucet.

Official reference: https://docs.sui.io/guides/developer/sui-101/sponsor-txn

## Dedicated accounts

Use separate accounts for:

- Testnet gas sponsorship.
- Future Mainnet gas sponsorship.
- Contract deployment.
- Package upgrade authority.
- Pass issuance.
- Sponsor administration.
- Organization verification.
- Emergency actions.

Do not use TREE treasury, TREE deployer, NFTree, Peter’s daily personal wallet, or one unrestricted hot wallet for all roles.

## Allowed transaction policy

The sponsor service must reconstruct or validate the complete transaction and allow only approved package/module/function combinations, such as:

- receive/issue an approved Season Pass through the backend workflow;
- approved renewal/upgrade action;
- approved sponsor placement lifecycle action initiated by an authorized server role;
- approved organization credential action;
- other explicitly versioned Testnet calls.

It must reject:

- arbitrary transfers;
- arbitrary Move calls;
- coin operations unrelated to the approved workflow;
- unrecognized package IDs or networks;
- unexpected shared/input objects;
- gas budgets above the configured cap;
- transaction data supplied only as an opaque user-controlled blob;
- expired or already-used sponsorship requests.

## Validation checklist before signing

- Correct network and chain identifier.
- Approved package ID and package version.
- Approved module/function.
- Expected sender/user address.
- Expected registry and record object IDs.
- Expected arguments and status transition.
- No additional commands.
- Maximum gas budget.
- Current user/account/role authorization.
- Valid order, recovery case, reservation, or administrative action reference.
- Idempotency key unused or safely retryable.
- Rate-limit budget available.

## Limits

Configure and monitor:

- per-user request rate;
- per-IP/device risk rate where appropriate;
- per-action daily limit;
- maximum gas per transaction;
- daily and monthly sponsor-address spend;
- concurrent outstanding requests;
- repeated failure threshold;
- global emergency cutoff.

Final numeric limits and monthly budget are open decisions.

## Request lifecycle

```text
Authenticated authorized request
→ server creates/validates business action
→ transaction is constructed from server-controlled template
→ simulation/dry-run where appropriate
→ sponsor policy validates exact transaction
→ user and sponsor signatures are collected in the required order
→ transaction is executed
→ digest/effects are persisted
→ business state is reconciled
→ request/idempotency record is finalized
```

A browser callback alone does not prove execution. The backend records final effects and handles safe retries.

## Abuse monitoring

Alert on:

- spend above threshold;
- repeated rejected transaction shapes;
- unusual user/device concentration;
- bursts of failed transactions;
- unexpected package/module/function;
- duplicate issuance attempts;
- sponsor coin/object contention;
- RPC/indexer discrepancies;
- unexplained balance change.

## Object contention

A single gas coin or heavily reused shared object may become a concurrency bottleneck. The implementation should maintain an appropriate gas-coin pool/selection strategy, avoid unnecessary mutation of one global object, and queue or retry safely when object versions conflict.

## Failure behavior

- Do not mark an entitlement issued until final effects are verified.
- Preserve idempotency after RPC timeout.
- Do not automatically resubmit an unknown transaction without checking digest/business state.
- Place unresolved requests in reconciliation review.
- Provide a nontechnical user message while retaining technical diagnostics privately.

## Key protection

Testnet keys may use development custody with no real value or personal data. Before Mainnet, the sponsor key requires protected server-side custody, restricted signing interface, separate operator permissions, backup/rotation procedures, and incident response. The private key is never shipped to the frontend.

## Emergency response

`EmergencyCap`/server controls may pause sponsorship independently from public content. During an incident:

1. stop signing new sponsored transactions;
2. preserve logs and pending request state;
3. rotate/secure keys if needed;
4. reconcile all recent digests and spend;
5. resume only after policy and allowlist verification.

## Test requirements

- Arbitrary transfer is rejected.
- Unapproved package/function is rejected.
- Added transaction command is rejected.
- Excess gas budget is rejected.
- Expired/replayed request is rejected.
- Per-user/global limits work.
- Safe retry does not duplicate issuance.
- Separate Testnet configuration is enforced.
- Sponsor balance/spend metrics are observable.
