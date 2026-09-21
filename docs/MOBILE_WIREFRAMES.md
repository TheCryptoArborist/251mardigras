# MG251 Mobile Wireframes

These wireframes define information hierarchy and touch behavior, not final prices, benefits, policies, or launch copy. All examples are fictional.

## Shared mobile shell

```text
┌─────────────────────────────┐
│ MG251                       │
│ Phase 0 Fictional Prototype │
├─────────────────────────────┤
│ Overview Member Sponsor     │
│ Organization Admin          │
├─────────────────────────────┤
│ Page title                  │
│ One-sentence purpose        │
│ [Primary action]            │
└─────────────────────────────┘
```

Requirements:

- 44px+ tap targets.
- Status and expiration visible without opening technical details.
- Purple/gold with neutral surfaces; no green.
- No horizontal scrolling for ordinary content.
- Plain-language labels.
- Prototype notice always visible.
- Optional technical details below primary business information.

## Membership landing

```text
┌─────────────────────────────┐
│ Join MG251 for 2027         │
│ Direct access to configured │
│ member coverage & benefits. │
│                             │
│ Entry Pass                  │
│ Benefit summary             │
│ Dates: Configurable         │
│ Price: Not decided          │
│ [Review Entry Pass]         │
│                             │
│ VIP Pass                    │
│ Benefit summary             │
│ Dates: Configurable         │
│ Price: Not decided          │
│ [Review VIP Pass]           │
│                             │
│ Already a member elsewhere? │
│ [Check eligibility]         │
└─────────────────────────────┘
```

Do not display a purchase button until product, price, terms, renewal, and refund decisions are approved.

## Sign-in

```text
┌─────────────────────────────┐
│ Sign in to MG251            │
│ Keep your pass and benefits │
│ connected across devices.   │
│                             │
│ [Continue with Google]      │
│ [Continue with Apple]       │
│ [Other approved option]     │
│                             │
│ Advanced Sui user?          │
│ [Optional wallet sign-in]   │
│                             │
│ MG251 handles network fees. │
└─────────────────────────────┘
```

Provider buttons are placeholders until a provider decision is approved.

## Member dashboard

```text
┌─────────────────────────────┐
│ Welcome, Fictional Member   │
│                             │
│ 2027 VIP PASS               │
│ ACTIVE                      │
│ Valid Jan 1–Mar 31, 2027    │
│ [View Pass Details]         │
│                             │
│ Your Benefits               │
│ • Premium alerts            │
│ • Replay early access       │
│ • Member guides             │
│ [See all benefits]          │
│                             │
│ New for Members             │
│ [Content card] [Open]       │
│ [Content card] [Locked]     │
│                             │
│ [Manage Notifications]      │
│ [Renew or Upgrade]          │
│ [Get Account Help]          │
└─────────────────────────────┘
```

## Pass detail

```text
┌─────────────────────────────┐
│ 2027 Season Pass            │
│ VIP Pass · Active           │
│                             │
│ Valid from: Jan 1, 2027     │
│ Expires: Mar 31, 2027       │
│ Issued by: MG251            │
│                             │
│ What this pass provides     │
│ [Configured benefits]       │
│                             │
│ What it does not provide    │
│ No equity, yield, resale,   │
│ or ownership of content.    │
│                             │
│ [Request Renewal]           │
│ [Account Recovery]          │
│ Technical details ▾         │
└─────────────────────────────┘
```

## Premium content library

```text
┌─────────────────────────────┐
│ Member Coverage             │
│ Filter: All / Entry / VIP   │
│                             │
│ [Thumbnail] Route Guide     │
│ VIP • Available now         │
│ [Open]                      │
│                             │
│ [Thumbnail] Replay Archive  │
│ Entry • Available now       │
│ [Open]                      │
│                             │
│ [Thumbnail] Interview       │
│ Scheduled Jan 15            │
│ [Notify Me]                 │
└─────────────────────────────┘
```

## Sponsor inventory

```text
┌─────────────────────────────┐
│ Sponsor MG251               │
│ Defined placements with     │
│ documented deliverables.    │
│                             │
│ Homepage Feature            │
│ Window: Fictional dates     │
│ Availability: Available     │
│ [View Deliverables]         │
│                             │
│ Parade Replay Sponsor       │
│ Availability: Reserved      │
│ [Join Waitlist / Details]   │
│                             │
│ [Request Custom Package]    │
└─────────────────────────────┘
```

## Sponsor dashboard

```text
┌─────────────────────────────┐
│ Fictional Sponsor Dashboard │
│                             │
│ Homepage Feature            │
│ Status: Awaiting Creative   │
│ Campaign: Feb 1–7           │
│                             │
│ 1 Terms accepted ✓          │
│ 2 Payment confirmed ✓       │
│ 3 Creative needed           │
│ 4 Review                    │
│ 5 Scheduled                 │
│ 6 Fulfillment report        │
│                             │
│ [Upload Fictional Creative] │
│ [View Deliverables]         │
│ [Contact Support]           │
└─────────────────────────────┘
```

## Organization verification application

```text
┌─────────────────────────────┐
│ Verify an Organization      │
│ MG251 verifies a defined    │
│ relationship and scope.     │
│                             │
│ Organization type [Select]  │
│ Requested level [Select]    │
│ Public name consent [ ]     │
│ Representative details      │
│ Private evidence upload     │
│                             │
│ This is not government or   │
│ safety certification.       │
│                             │
│ [Save Draft]                │
│ [Submit for Review]         │
└─────────────────────────────┘
```

## Organization dashboard

```text
┌─────────────────────────────┐
│ Fictional Organization      │
│ VERIFIED                    │
│ Authorized Event Manager    │
│ Expires: Dec 31, 2027       │
│                             │
│ Permissions                 │
│ ✓ Create event drafts       │
│ ✓ Submit corrections        │
│ ✕ Publish without review    │
│                             │
│ Event Drafts                │
│ [Poker Crawl] Under Review  │
│ [Community Sale] Draft      │
│                             │
│ [Create Event Draft]        │
│ [Manage Representatives]    │
│ [Request Renewal]           │
└─────────────────────────────┘
```

## Administrative dashboard

```text
┌─────────────────────────────┐
│ MG251 Administration        │
│ Role: Platform Admin        │
│                             │
│ Attention                   │
│ 3 payment reconciliations   │
│ 2 verification reviews      │
│ 1 creative approval         │
│ 0 gas budget alerts         │
│                             │
│ Memberships [Open Queue]    │
│ Sponsors    [Open Queue]    │
│ Organizations [Open Queue]  │
│ Content     [Open Queue]    │
│ Recovery    [Open Queue]    │
│ Audit       [View]          │
│                             │
│ Issuance: TESTNET / ACTIVE  │
│ [Emergency Controls]        │
└─────────────────────────────┘
```

Editorial administrators must see only editorial queues; access to payment, issuance, contracts, or recovery is not implied.

## Error and restricted states

Every screen needs clear states for:

- sign-in required;
- entitlement pending;
- suspended/expired/revoked;
- provider/RPC temporarily unavailable;
- payment received but issuance pending;
- reconciliation review;
- inventory no longer available;
- credential renewal due;
- unauthorized action;
- support/recovery case opened.

Messages should explain the business outcome first and hide technical diagnostics from ordinary users.
