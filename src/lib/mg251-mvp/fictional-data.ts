export const prototypeNotice =
  "Phase 0 fictional prototype — no real accounts, payments, memberships, sponsor bookings, organizations, or blockchain transactions are created.";

export const fictionalMember = {
  displayName: "Alex Paradegoer",
  pass: {
    label: "MG251 2027 VIP Pass",
    tier: "VIP Pass",
    season: "2027",
    status: "Active",
    validFrom: "January 1, 2027",
    expiresAt: "March 31, 2027",
    serial: "MVP-2027-000251"
  },
  benefits: [
    "Premium parade and event alerts",
    "Early access to selected replay coverage",
    "Member route, parking, and access guides",
    "Member-only polls and selected archives"
  ],
  content: [
    {
      title: "Downtown Access Guide",
      description: "Fictional member guide for route access, parking, and arrival planning.",
      access: "VIP",
      status: "Available now"
    },
    {
      title: "2027 Replay Archive",
      description: "Fictional replay collection shown for interface testing only.",
      access: "Entry",
      status: "Available now"
    },
    {
      title: "Behind the Barricades",
      description: "Fictional extended interview scheduled for a later release.",
      access: "VIP",
      status: "Scheduled January 15"
    }
  ]
} as const;

export const fictionalSponsorInventory = [
  {
    product: "Homepage Featured Sponsor",
    slot: "February 1–7, 2027",
    availability: "Available",
    deliverables: "Seven-day homepage placement with approved creative and fulfillment capture.",
    exclusive: true
  },
  {
    product: "Parade Replay Sponsor",
    slot: "Fictional Replay Window A",
    availability: "Reserved",
    deliverables: "Opening acknowledgment and sponsor card on one selected replay.",
    exclusive: true
  },
  {
    product: "Food & Drink Feature",
    slot: "February 8–14, 2027",
    availability: "Available",
    deliverables: "Featured listing in the Food & Drink section for the stated window.",
    exclusive: false
  }
] as const;

export const fictionalSponsorCampaign = {
  sponsorName: "Fictional Gulf Coast Business",
  product: "Homepage Featured Sponsor",
  campaign: "February 1–7, 2027",
  status: "Awaiting Creative",
  steps: [
    { label: "Terms accepted", complete: true },
    { label: "Test payment confirmed", complete: true },
    { label: "Creative submitted", complete: false },
    { label: "Creative approved", complete: false },
    { label: "Campaign scheduled", complete: false },
    { label: "Fulfillment report", complete: false }
  ]
} as const;

export const fictionalOrganization = {
  name: "Fictional Mobile Community Society",
  status: "Verified",
  level: "Authorized Event Manager",
  issuedAt: "August 15, 2026",
  expiresAt: "December 31, 2027",
  permissions: [
    { label: "Create event drafts", allowed: true },
    { label: "Edit authorized event drafts", allowed: true },
    { label: "Submit official corrections", allowed: true },
    { label: "Publish without MG251 editorial review", allowed: false },
    { label: "Issue memberships or sponsor receipts", allowed: false }
  ],
  events: [
    {
      title: "Fictional Poker Crawl",
      date: "January 16, 2027",
      status: "Under Review",
      lastChange: "Venue note corrected"
    },
    {
      title: "Fictional Community Fundraiser",
      date: "February 6, 2027",
      status: "Draft",
      lastChange: "Saved by organization representative"
    }
  ]
} as const;

export const fictionalAdminMetrics = [
  { label: "Membership reconciliations", value: "3", detail: "Test orders requiring review" },
  { label: "Verification reviews", value: "2", detail: "Fictional applications" },
  { label: "Creative approvals", value: "1", detail: "Version awaiting review" },
  { label: "Gas budget alerts", value: "0", detail: "Testnet sponsor only" }
] as const;

export const fictionalAdminQueues = [
  {
    title: "Memberships",
    description: "Issue, renew, suspend, revoke, and recover fictional Testnet passes.",
    count: 3,
    role: "Pass Issuer"
  },
  {
    title: "Sponsors",
    description: "Review inventory, creative, scheduling, and fictional fulfillment evidence.",
    count: 2,
    role: "Sponsor Manager"
  },
  {
    title: "Organizations",
    description: "Review applications, representative scope, renewal, and event changes.",
    count: 2,
    role: "Organization Verifier / Editorial"
  },
  {
    title: "Content",
    description: "Configure fictional access tiers, release windows, and withdrawal status.",
    count: 1,
    role: "Content Manager"
  },
  {
    title: "Recovery",
    description: "Case-managed account reassignment with evidence and audit requirements.",
    count: 1,
    role: "Authorized Recovery Admin"
  },
  {
    title: "Audit & Reconciliation",
    description: "Compare payment, database, and Sui Testnet lifecycle state.",
    count: 4,
    role: "Platform Admin"
  }
] as const;

export const provisionalTiers = [
  {
    name: "Entry Pass",
    code: "ENTRY",
    description: "A configurable foundation tier. Final benefits, dates, and price are unresolved."
  },
  {
    name: "VIP Pass",
    code: "VIP",
    description: "A configurable premium tier. The prototype does not authorize any specific promise."
  },
  {
    name: "Complimentary Pass",
    code: "COMP",
    description: "An audited, noncash access grant issued only by an authorized MG251 role."
  },
  {
    name: "Partner / Press Pass",
    code: "PARTNER",
    description: "A scoped pass for approved relationships under separate terms."
  }
] as const;
