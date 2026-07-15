export const LINKTREE_URL = "https://linktr.ee/Mardi_Gras_MobileAL";

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@MobileMardiGras";
export const YOUTUBE_CHANNEL_ID = "UCyqSGKVwxdMcXMgwaRMnDiA";
export const YOUTUBE_SUPPORTER_URL = "https://www.youtube.com/channel/UCyqSGKVwxdMcXMgwaRMnDiA/join";
export const YOUTUBE_LIVE_EMBED_URL =
  "https://www.youtube.com/embed/live_stream?channel=UCyqSGKVwxdMcXMgwaRMnDiA";
export const MOBILITY_ACCESS_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSftgyJN88i7T51O6aSrA3cVfsQyhxywi3ehE_DJxpYTt1D2VQ/viewform";

export const linktreeProfile = {
  title: "Mardi Gras - Mobile, AL",
  tagline: "Experience Mardi Gras from Mobile, Alabama, where it all began in 1703.",
  sourceUrl: LINKTREE_URL,
  joined: "July 2024"
};

export const linktreeCategoryHighlights = [
  {
    title: "Social media and contact",
    detail: "YouTube, Facebook, Instagram, X, TikTok, email, phone, and Snapchat are listed from the public Linktree profile."
  },
  {
    title: "Downtown transportation",
    detail: "Parking apps, parking guide links, a downtown parking map, and the City parking guide are grouped for parade-day planning."
  },
  {
    title: "Mobility-friendly access",
    detail: "The Linktree links to a third-party SNASY registration form for mobility-friendly parade access support."
  },
  {
    title: "Food and drink",
    detail: "The Linktree lists downtown food, coffee, bakery, brewery, barbecue, and dessert stops for parade visitors."
  },
  {
    title: "Gear, throws, and past seasons",
    detail: "Throws, gear, channel support, livestream, and previous parade-season playlists are collected as convenience resources."
  }
];

export const DOWNTOWN_MOBILE_COORDINATES = {
  latitude: 30.6954,
  longitude: -88.0399
};

export const cityUpdateKeywords = [
  "Mardi Gras",
  "parade",
  "route",
  "parking",
  "tow",
  "towed",
  "traffic",
  "road closure",
  "downtown",
  "horse",
  "vendor",
  "safety",
  "litter",
  "barricade",
  "Fat Tuesday",
  "Joe Cain",
  "Lundi Gras",
  "Dauphin Street",
  "Royal Street",
  "Government Street",
  "Bienville Square",
  "Mardi Gras Park"
];

export type OfficialSourceSeed = {
  name: string;
  url: string;
  sourceType: string;
  checkIntervalMinutes: number;
};

export const officialSources: OfficialSourceSeed[] = [
  {
    name: "City of Mobile Mardi Gras dashboard",
    url: "https://www.cityofmobile.gov/mardigras/",
    sourceType: "official_city_page",
    checkIntervalMinutes: 360
  },
  {
    name: "Parade schedule and routes StoryMap",
    url: "https://storymaps.arcgis.com/stories/aa1969cf3b68462a8676acdfb4839ad4",
    sourceType: "official_arcgis_storymap",
    checkIntervalMinutes: 360
  },
  {
    name: "Mardi Gras General Information",
    url: "https://www.cityofmobile.gov/mardi-gras-general-information/",
    sourceType: "official_city_page",
    checkIntervalMinutes: 360
  },
  {
    name: "Mardi Gras Parking and Transportation",
    url: "https://www.cityofmobile.gov/mardi-gras-parade-parking/",
    sourceType: "official_city_page",
    checkIntervalMinutes: 360
  },
  {
    name: "Mardi Gras Rules and Safety Tips",
    url: "https://www.cityofmobile.gov/mardi-gras-safety-tips/",
    sourceType: "official_city_page",
    checkIntervalMinutes: 360
  },
  {
    name: "Mardi Gras Vendor Information",
    url: "https://www.cityofmobile.gov/departments/revenue/mardi-gras-vendor-information/",
    sourceType: "official_city_page",
    checkIntervalMinutes: 360
  },
  {
    name: "Horse Use Policy",
    url: "https://www.cityofmobile.gov/horse-use-policy/",
    sourceType: "official_city_page",
    checkIntervalMinutes: 360
  },
  {
    name: "Keep Mardi Gras Litter-Free",
    url: "https://www.cityofmobile.gov/keep-mardi-gras-litter-free/",
    sourceType: "official_city_page",
    checkIntervalMinutes: 360
  },
  {
    name: "City Updates",
    url: "https://www.cityofmobile.gov/city-updates/",
    sourceType: "official_city_updates",
    checkIntervalMinutes: 360
  },
  {
    name: "Mobile Police Mardi Gras page",
    url: "https://www.mobilepd.org/mardi-gras/",
    sourceType: "official_public_safety_page",
    checkIntervalMinutes: 360
  }
];

export type ResourceSeed = {
  title: string;
  url: string;
  category: string;
  description: string;
  source: string;
  sourceUrl: string;
  sortOrder: number;
};

const linktreeResource = (
  title: string,
  category: string,
  description: string,
  sortOrder: number,
  url = LINKTREE_URL
): ResourceSeed => ({
  title,
  url,
  category,
  description,
  source: "Mardi Gras Mobile Linktree",
  sourceUrl: LINKTREE_URL,
  sortOrder
});

export const resourceSeeds: ResourceSeed[] = [
  linktreeResource("YouTube", "Social Media", "Mobile Mardi Gras video channel listed on the public Linktree profile.", 1, YOUTUBE_CHANNEL_URL),
  linktreeResource("Facebook", "Social Media", "Facebook account listed on the Linktree profile. Open Linktree for the current destination.", 2),
  linktreeResource("Instagram", "Social Media", "Instagram account listed on the Linktree profile. Open Linktree for the current destination.", 3),
  linktreeResource("X", "Social Media", "X account listed on the Linktree profile. Open Linktree for the current destination.", 4),
  linktreeResource("TikTok", "Social Media", "TikTok account listed on the Linktree profile. Open Linktree for the current destination.", 5),
  linktreeResource("Email", "Social Media", "Email/contact option listed on the Linktree profile.", 6),
  linktreeResource("Phone", "Social Media", "Phone/contact option listed on the Linktree profile.", 7),
  linktreeResource("Snapchat", "Social Media", "Snapchat account listed on the Linktree profile.", 8),
  linktreeResource("YouTube channel", "Live Coverage / Channel Support", "Live, short-form, and previous Mobile Mardi Gras video coverage.", 1, YOUTUBE_CHANNEL_URL),
  linktreeResource("Current livestream", "Live Coverage / Channel Support", "Dashboard embed uses the public Mobile Mardi Gras YouTube channel when a livestream is active.", 2, YOUTUBE_CHANNEL_URL),
  linktreeResource("Become a Channel Supporter", "Live Coverage / Channel Support", "YouTube channel membership link listed from the Linktree profile.", 3, YOUTUBE_SUPPORTER_URL),
  linktreeResource("Previous parade playlists", "Live Coverage / Channel Support", "Prior parade-season playlists and channel archive resources.", 4, YOUTUBE_CHANNEL_URL),
  linktreeResource("ParkWhiz Google Play link", "Downtown Transportation", "Parking app link listed by Linktree for downtown transportation planning.", 1),
  linktreeResource("ParkWhiz Apple App Store link", "Downtown Transportation", "Parking app link listed by Linktree for downtown transportation planning.", 2),
  linktreeResource("Mardi Gras 2026 Parking Guide Mobile, Alabama", "Downtown Transportation", "Parking guide link listed by Linktree. Verify parking, towing, and traffic rules with official sources.", 3),
  linktreeResource("Downtown Parking Map", "Downtown Transportation", "Downtown parking map link listed by Linktree. Verify closures and towing rules before travel.", 4),
  linktreeResource(
    "City of Mobile Parking and Transportation Guide",
    "Downtown Transportation",
    "Official City page should be verified before travel.",
    5,
    "https://www.cityofmobile.gov/mardi-gras-parade-parking/"
  ),
  linktreeResource(
    "Need Mobility-Friendly Mardi Gras Access? Click Here",
    "Mobility-Friendly Access",
    "Third-party SNASY registration form for mobility-friendly parade access support. This does not verify the official parade schedule.",
    1,
    MOBILITY_ACCESS_FORM_URL
  ),
  ...[
    "The Outsider",
    "Greer's Saint Louis Market",
    "ellenJAY Bakery",
    "Bake My Day",
    "Guncles Gluten Free",
    "Big Bad Breakfast",
    "Serda's Coffee Co.",
    "Knuckle Bones Elixir Co.",
    "Great Day Latte",
    "Moe's Original BBQ",
    "Cammie's Old Dutch Ice Cream Shoppe",
    "LODA Bier Garten",
    "POST",
    "Braided River Brewing Company",
    "Joe Cain Cafe",
    "Bob's Downtown Restaurant",
    "Pop's Midtown",
    "Lemon T's"
  ].map((title, index) =>
    linktreeResource(title, "Food and Drink", "Food or drink stop listed in the Linktree directory. Confirm hours, reservations, and parade-day access with the venue.", index + 1)
  ),
  linktreeResource("Port City Throws", "Mardi Gras Gear / Throws", "Mardi Gras throws and gear resource listed on Linktree.", 1),
  linktreeResource("Additional gear or throws links", "Mardi Gras Gear / Throws", "Additional throws or gear resources can be followed through the live Linktree profile.", 2),
  linktreeResource("Mardi Gras 2025 Playlist", "Previous Parade Seasons", "Previous parade season playlist from the Mobile Mardi Gras video archive.", 1, YOUTUBE_CHANNEL_URL),
  linktreeResource("Mardi Gras 2024 Playlist", "Previous Parade Seasons", "Previous parade season playlist from the Mobile Mardi Gras video archive.", 2, YOUTUBE_CHANNEL_URL),
  linktreeResource("Mardi Gras 2023 Playlist", "Previous Parade Seasons", "Previous parade season playlist from the Mobile Mardi Gras video archive.", 3, YOUTUBE_CHANNEL_URL)
];

export const publicDisclaimers = [
  "This is an unofficial Mobile Mardi Gras tracker using public sources.",
  "Official parade, traffic, public safety, and emergency decisions should be verified through the City of Mobile and public safety agencies.",
  "Weather information should be verified through the National Weather Service.",
  "Weather risk does not mean a parade is canceled unless officially announced.",
  "Resource links may include third-party websites."
];

export const publicAlertLabels = [
  "ROUTE CHANGE",
  "TIME CHANGE",
  "CANCELLATION",
  "ROAD CLOSURE",
  "TOWING / PARKING CHANGE",
  "SEVERE WEATHER",
  "PUBLIC SAFETY UPDATE",
  "VENDOR POLICY UPDATE",
  "HORSE POLICY UPDATE",
  "NEW RESOURCE"
];
