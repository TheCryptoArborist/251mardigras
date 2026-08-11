export const SITE_URL = "https://mg251.xyz";
export const RESOURCE_DIRECTORY_URL = `${SITE_URL}/resources`;
export const RESOURCE_DIRECTORY_SOURCE = "Mardi Gras - Mobile, AL Resource Directory";

// Legacy import source only. Public resource clicks should resolve to direct destinations,
// not bounce visitors from this site to Linktree and then to another destination.
export const LINKTREE_URL = "https://linktr.ee/Mardi_Gras_MobileAL";

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@MobileMardiGras";
export const YOUTUBE_CHANNEL_ID = "UCyqSGKVwxdMcXMgwaRMnDiA";
export const YOUTUBE_SUPPORTER_URL = "https://www.youtube.com/channel/UCyqSGKVwxdMcXMgwaRMnDiA/join";
export const YOUTUBE_LIVE_EMBED_URL =
  "https://www.youtube.com/embed/live_stream?channel=UCyqSGKVwxdMcXMgwaRMnDiA";
export const MOBILITY_ACCESS_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSftgyJN88i7T51O6aSrA3cVfsQyhxywi3ehE_DJxpYTt1D2VQ/viewform";
export const MARDI_GRAS_2023_PLAYLIST_URL =
  "https://youtube.com/playlist?list=PLaLBJrBHRKOB3U6ETGoq6u2CF6FTxy3Vr&si=H19GGBst7zmVF1ro";
export const MARDI_GRAS_2024_PLAYLIST_URL =
  "https://youtube.com/playlist?list=PLaLBJrBHRKOCVEbSQJI_90b-2DeQkCFIQ&si=_wCvjlKD1BPpcPcm";
export const MARDI_GRAS_2025_PLAYLIST_URL =
  "https://youtube.com/playlist?list=PLaLBJrBHRKOB3tgHjiJAhn2cItOFv6N2_&si=YzqWqCRLFaw1ErX-";
export const MARDI_GRAS_2026_PLAYLIST_URL =
  "https://youtube.com/playlist?list=PLaLBJrBHRKOBFx4qYgyrU3OHNyzW-Gc5n&si=FSfofoLT9brlfPUw";

export const linktreeProfile = {
  title: "Mardi Gras - Mobile, AL Resource Directory",
  tagline:
    "Direct visitor links for live coverage, social channels, parking, access support, food, gear, throws, and previous parade seasons.",
  sourceUrl: RESOURCE_DIRECTORY_URL,
  joined: "2024 link inventory"
};

export const resourceCurationPrinciples = [
  "Public resources are selected for Mobile Mardi Gras livestream discovery, downtown visitor planning, access support, food and drink, gear, throws, or previous parade coverage.",
  "Legacy imported links are reviewed before publication; general discount, affiliate, or non-Mardi Gras offers are not automatically displayed in the public directory.",
  "Contact methods should be handled by a dedicated website contact/submission path instead of being mixed into the visitor resource directory.",
  "Visitor resources are convenience links. Parade schedules, routes, closures, parking rules, towing, public-safety decisions, and weather impacts still require official-source verification."
];

export const linktreeCategoryHighlights = [
  {
    title: "Social media",
    detail: "YouTube, Facebook, Instagram, X, TikTok, and Snapchat destinations are maintained as direct resource links."
  },
  {
    title: "Downtown transportation",
    detail: "Parking apps, parking guide links, a downtown parking map, and the City parking guide are grouped for parade-day planning."
  },
  {
    title: "Mobility-friendly access",
    detail: "A third-party SNASY registration form is linked for mobility-friendly parade access support."
  },
  {
    title: "Food and drink",
    detail: "Downtown food, coffee, bakery, brewery, barbecue, and dessert stops are grouped for parade visitors."
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

const directoryResource = (
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
  source: RESOURCE_DIRECTORY_SOURCE,
  sourceUrl: RESOURCE_DIRECTORY_URL,
  sortOrder
});

export const resourceSeeds: ResourceSeed[] = [
  directoryResource("YouTube", "Social Media", "Mobile Mardi Gras video channel for live coverage, shorts, replays, and previous season videos.", 1, YOUTUBE_CHANNEL_URL),
  directoryResource("Facebook", "Social Media", "Mobile Mardi Gras Facebook destination maintained as a direct social link.", 2),
  directoryResource("Instagram", "Social Media", "Mobile Mardi Gras Instagram destination maintained as a direct social link.", 3),
  directoryResource("X", "Social Media", "Mobile Mardi Gras X destination maintained as a direct social link.", 4),
  directoryResource("TikTok", "Social Media", "Mobile Mardi Gras TikTok destination maintained as a direct social link.", 5),
  directoryResource("Snapchat", "Social Media", "Snapchat destination maintained as a direct social link.", 6),
  directoryResource("YouTube channel", "Live Coverage / Channel Support", "Live, short-form, and previous Mobile Mardi Gras video coverage.", 1, YOUTUBE_CHANNEL_URL),
  directoryResource("Current livestream", "Live Coverage / Channel Support", "Public Mobile Mardi Gras YouTube channel used by the live coverage player when a livestream is active.", 2, YOUTUBE_CHANNEL_URL),
  directoryResource("Become a Channel Supporter", "Live Coverage / Channel Support", "YouTube channel membership link for viewers who want to support coverage.", 3, YOUTUBE_SUPPORTER_URL),
  directoryResource("Previous parade playlists", "Live Coverage / Channel Support", "Latest Mobile Mardi Gras parade playlist and channel archive resources.", 4, MARDI_GRAS_2026_PLAYLIST_URL),
  directoryResource("ParkWhiz Google Play link", "Downtown Transportation", "Parking app link for downtown transportation planning.", 1),
  directoryResource("ParkWhiz Apple App Store link", "Downtown Transportation", "Parking app link for downtown transportation planning.", 2),
  directoryResource("Downtown Parking Map", "Downtown Transportation", "Downtown parking map resource. Verify closures and towing rules before travel.", 3),
  directoryResource(
    "City of Mobile Parking and Transportation Guide",
    "Downtown Transportation",
    "Official City page should be verified before travel.",
    4,
    "https://www.cityofmobile.gov/mardi-gras-parade-parking/"
  ),
  directoryResource(
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
    "Bob's Downtown Restaurant"
  ].map((title, index) =>
    directoryResource(title, "Food and Drink", "Food or drink stop in the visitor directory. Confirm hours, reservations, and parade-day access with the venue.", index + 1)
  ),
  directoryResource("Port City Throws", "Mardi Gras Gear / Throws", "Mardi Gras throws and gear resource.", 1),
  directoryResource("Pop's Midtown", "Mardi Gras Gear / Throws", "Mardi Gras gear and shopping resource.", 2),
  directoryResource("Lemon T's", "Mardi Gras Gear / Throws", "Mardi Gras shirts, apparel, and gear resource.", 3),
  directoryResource("Toomey's Mardi Gras", "Mardi Gras Gear / Throws", "Mardi Gras gear, throws, costumes, and party supplies resource.", 4, "https://toomeysmardigras.com/"),
  directoryResource("Mardi Gras 2026 Playlist", "Previous Parade Seasons", "Previous parade season playlist from the Mobile Mardi Gras video archive.", 1, MARDI_GRAS_2026_PLAYLIST_URL),
  directoryResource("Mardi Gras 2025 Playlist", "Previous Parade Seasons", "Previous parade season playlist from the Mobile Mardi Gras video archive.", 2, MARDI_GRAS_2025_PLAYLIST_URL),
  directoryResource("Mardi Gras 2024 Playlist", "Previous Parade Seasons", "Previous parade season playlist from the Mobile Mardi Gras video archive.", 3, MARDI_GRAS_2024_PLAYLIST_URL),
  directoryResource("Mardi Gras 2023 Playlist", "Previous Parade Seasons", "Previous parade season playlist from the Mobile Mardi Gras video archive.", 4, MARDI_GRAS_2023_PLAYLIST_URL)
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
