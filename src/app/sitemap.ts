import type { MetadataRoute } from "next";
import { getApprovedCommunityEvents } from "@/lib/community-events";
import { absoluteUrl } from "@/lib/seo";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
  { url: absoluteUrl("/links"), changeFrequency: "daily", priority: 0.95 },
  { url: absoluteUrl("/watch"), changeFrequency: "daily", priority: 0.95 },
  { url: absoluteUrl("/replays"), changeFrequency: "weekly", priority: 0.9 },
  { url: absoluteUrl("/events"), changeFrequency: "daily", priority: 0.9 },
  { url: absoluteUrl("/submit-event"), changeFrequency: "monthly", priority: 0.75 },
  { url: absoluteUrl("/food-drink"), changeFrequency: "weekly", priority: 0.85 },
  { url: absoluteUrl("/parking-access"), changeFrequency: "weekly", priority: 0.85 },
  { url: absoluteUrl("/weather"), changeFrequency: "daily", priority: 0.8 },
  { url: absoluteUrl("/mardi-gras-gear"), changeFrequency: "weekly", priority: 0.75 },
  { url: absoluteUrl("/resources"), changeFrequency: "weekly", priority: 0.8 },
  { url: absoluteUrl("/routes"), changeFrequency: "weekly", priority: 0.8 },
  { url: absoluteUrl("/schedule"), changeFrequency: "weekly", priority: 0.8 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const eventRoutes = getApprovedCommunityEvents().map((event) => ({
    url: absoluteUrl(`/events/${event.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.72
  }));

  return [...staticRoutes.map((route) => ({ ...route, lastModified: now })), ...eventRoutes];
}
