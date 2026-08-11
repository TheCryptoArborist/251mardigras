import type { Metadata } from "next";
import { SITE_LOGO_PATH } from "@/lib/brand";

export const SITE_URL = "https://mg251.xyz";
export const SITE_NAME = "Mardi Gras - Mobile, Alabama";
export const SITE_SHORT_NAME = "Mardi Gras - Mobile, AL";

export const DEFAULT_SITE_TITLE = "Mobile Mardi Gras 2027 | Parade Coverage, Events, Routes & Visitor Guide";
export const DEFAULT_SITE_DESCRIPTION =
  "Watch Mobile Mardi Gras coverage, find community events, parade replays, food and drink stops, parking access, weather, routes, and visitor resources.";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

export function createPageMetadata({ title, description, path, image = SITE_LOGO_PATH, noIndex = false }: PageMetadataInput): Metadata {
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: `${SITE_NAME} logo`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false
          }
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
          }
        }
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    url: SITE_URL,
    inLanguage: "en-US"
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(SITE_LOGO_PATH),
    sameAs: [
      "https://www.youtube.com/@MobileMardiGras",
      "https://www.facebook.com/mardigrasmobileal",
      "https://www.instagram.com/mardi_gras_mobile_alabama",
      "https://www.tiktok.com/@mobilemardigras",
      "https://x.com/MobMardiGras"
    ]
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c")
  };
}
