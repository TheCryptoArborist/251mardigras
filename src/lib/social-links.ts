export const MG251_SOCIAL_LINKS = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@MobileMardiGras?sub_confirmation=1",
    action: "Subscribe",
    featured: true
  },
  {
    label: "Facebook",
    href: "https://m.facebook.com/mardigrasmobileal/",
    action: "Follow",
    featured: true
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mardi_gras_mobile_alabama",
    action: "Follow",
    featured: false
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@mobilemardigras",
    action: "Follow",
    featured: false
  },
  {
    label: "X",
    href: "https://x.com/MobMardiGras",
    action: "Follow",
    featured: false
  }
] as const;

export type SocialPlatform = (typeof MG251_SOCIAL_LINKS)[number]["label"];
