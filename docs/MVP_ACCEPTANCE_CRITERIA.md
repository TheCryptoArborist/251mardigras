# MG251 MVP Acceptance Criteria

## Release boundary

These criteria apply to a fictional-data Sui Testnet MVP. Passing them does not authorize Mainnet, production payments, real verification documents, or public launch.

## A. Product and rights

- [ ] No fungible MG251 coin exists.
- [ ] Every object maps to a documented service entitlement, deliverable, credential, or content policy.
- [ ] Terms presented in the prototype do not promise ownership, profit, yield, resale, buybacks, or appreciation.
- [ ] Tier names, prices, benefits, seasons, and administrator addresses are configurable.
- [ ] Contributor rewards remain deferred/offchain unless separately approved.

## B. Fictional user experience

- [ ] A fictional user can complete a familiar sign-in simulation.
- [ ] The primary interface says `Sign In`, `Join MG251`, `Season Pass`, and `Member Access`, not wallet-first terminology.
- [ ] A fictional member can view tier, season, status, valid dates, benefits, renewal/upgrade, support, and recovery options.
- [ ] A fictional sponsor can review inventory, reservation status, creative status, schedule, and fulfillment evidence.
- [ ] A fictional organization can view verification status, authorized permissions, event drafts, corrections, and renewal.
- [ ] An administrator can see separate membership, sponsor, organization, content, recovery, and reconciliation queues.
- [ ] Mobile layouts have readable text and large tap targets.
- [ ] Existing purple/gold branding is used; green is not introduced as an MG251 brand color.
- [ ] Prototype routes are no-index and not linked from live public navigation.

## C. Authentication and authorization

- [ ] At least one supported OAuth/embedded-account path works in the public-pilot environment.
- [ ] A conventional wallet route, if included, is optional and separate.
- [ ] Server-side authorization guards every privileged route and action.
- [ ] Editorial, pass issuance, sponsor management, organization verification, content management, emergency, and support permissions are distinct.
- [ ] Client-side hiding and no-index metadata are not treated as authorization.
- [ ] Unauthorized-role tests pass.

## D. Season Pass

- [ ] A fictional user can receive one Season Pass on Sui Testnet without owning SUI.
- [ ] The pass/record has human-readable Display V2 metadata for generic public fields.
- [ ] No name, email, phone, billing, social identifier, order number, or recovery data appears onchain.
- [ ] No unrestricted public transfer function exists.
- [ ] Authorized administrator can issue, renew, upgrade, suspend, revoke, cancel, and recover/reassign according to valid transitions.
- [ ] Old account loses access after reassignment.
- [ ] Suspended, revoked, canceled, or time-expired pass does not unlock protected content.
- [ ] Access evaluates timestamp even if an explicit `Expired` transaction has not run.
- [ ] Every privileged action emits an event and writes an offchain audit record.

## E. Sponsor inventory and fulfillment

- [ ] Exclusive inventory has a unique slot key/time window.
- [ ] Concurrent reservation test cannot double-book a slot.
- [ ] Reservation holds expire safely.
- [ ] Receipt issuance requires approved order/payment/authorization state.
- [ ] Fictional creative is private until approved.
- [ ] Creative approval is bound to an immutable version/hash.
- [ ] Scheduling and live status require valid prior states.
- [ ] Fulfilled status requires product-specific evidence.
- [ ] Fulfillment record/report hashes do not expose private reports.
- [ ] Cancellation/refund/dispute transitions remain auditable.
- [ ] No public resale or unauthorized reassignment exists.

## F. Organization verification and events

- [ ] Fictional organization can apply with private fictional evidence.
- [ ] Reviewer can approve/reject under a versioned policy.
- [ ] Credential includes only minimal public fields.
- [ ] Public organization name is optional and consent-controlled.
- [ ] Credential can expire, renew, suspend, and revoke.
- [ ] Permissions are scoped by level and representative assignment.
- [ ] Verified organization cannot directly bypass editorial publication review.
- [ ] Event revisions identify actor, changed fields, time, source, and outcome.
- [ ] Removing a representative removes their permissions without deleting audit history.

## G. Payments and webhooks

- [ ] Only test-mode payment configuration is used.
- [ ] Webhook signatures and environment are verified.
- [ ] Duplicate/replayed webhook cannot issue another pass.
- [ ] Browser redirect cannot independently mark payment paid.
- [ ] Unique issuance key prevents duplicate Testnet objects.
- [ ] Refund/chargeback test updates entitlement according to configured policy.
- [ ] Payment, database, and Sui mismatches enter reconciliation.
- [ ] No production payment secret is committed or exposed to client code.

## H. Gas sponsorship

- [ ] Fictional user does not need SUI.
- [ ] Sponsored calls are package/module/function allowlisted.
- [ ] Arbitrary transfer/additional command is rejected.
- [ ] Maximum gas and per-user/global limits are enforced.
- [ ] Dedicated Testnet sponsor account is used.
- [ ] Testnet/Mainnet configuration cannot be confused silently.
- [ ] Spend and failures are monitored.
- [ ] Retry behavior is idempotent.

## I. Privacy, storage, and security

- [ ] Data classification review is complete.
- [ ] Private files use access-controlled storage and short-lived access.
- [ ] Upload type/size/malware controls are tested.
- [ ] Logs redact secrets, signed URLs, recovery evidence, and sensitive payment fields.
- [ ] Account recovery cannot be completed without approved evidence and authorization.
- [ ] Recovery evidence remains offchain and is not placed in ordinary logs.
- [ ] Capability and upgrade authority custody is documented.
- [ ] Emergency pause procedure is tested.
- [ ] Database backup/restore and Sui reconciliation are demonstrated.
- [ ] Secret scan passes.

## J. Configuration and deployment

- [ ] Package IDs, object IDs, addresses, networks, RPC endpoints, provider keys, payment secrets, and storage credentials are environment-configurable.
- [ ] No private key or production secret is in source control.
- [ ] Testnet deployment script and verification instructions exist.
- [ ] Package tests pass.
- [ ] Type checking, linting, and production build pass.
- [ ] No Mainnet deployment occurs.
- [ ] No real member, sponsor, organization, payment, event, or identity-document data is used.

## Exit decision

The MVP may proceed to a controlled 2027 pilot only after Peter approves the relevant open decisions, policies and terms are reviewed, security/privacy gates pass, and a pilot rollback/support plan exists.
