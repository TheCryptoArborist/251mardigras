import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getCommunityEventBySlug, fullEventLocation } from "@/lib/community-events";
import { absoluteUrl, breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

type EventLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = getCommunityEventBySlug(slug);

  if (!event) {
    return createPageMetadata({
      title: "Community Event",
      description: "Mobile Mardi Gras community event details.",
      path: `/events/${slug}`,
      noIndex: true
    });
  }

  return createPageMetadata({
    title: event.title,
    description: `${event.title} hosted by ${event.organization}. ${event.description}`.slice(0, 155),
    path: `/events/${event.slug}`,
    image: event.flyerUrl
  });
}

export default async function EventLayout({ children, params }: EventLayoutProps) {
  const { slug } = await params;
  const event = getCommunityEventBySlug(slug);

  if (!event) {
    return children;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript([
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
            { name: event.title, path: `/events/${event.slug}` }
          ]),
          communityEventJsonLd(event)
        ])}
      />
      {children}
    </>
  );
}

type ApprovedEvent = NonNullable<ReturnType<typeof getCommunityEventBySlug>>;

function communityEventJsonLd(event: ApprovedEvent) {
  const cityStateZip = parseCityStateZip(event.cityStateZip);
  const image = event.flyerUrl ? [absoluteUrl(event.flyerUrl)] : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    url: absoluteUrl(`/events/${event.slug}`),
    startDate: event.startDateTime,
    endDate: event.endDateTime,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image,
    location: {
      "@type": "Place",
      name: event.venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.venueAddress,
        addressLocality: cityStateZip.city,
        addressRegion: cityStateZip.region,
        postalCode: cityStateZip.postalCode,
        addressCountry: "US"
      }
    },
    organizer: {
      "@type": "Organization",
      name: event.organization
    },
    offers: event.ticketUrl
      ? {
          "@type": "Offer",
          url: event.ticketUrl,
          availability: "https://schema.org/InStock",
          validFrom: event.startDateTime
        }
      : undefined,
    about: "Mobile Mardi Gras community event",
    inLanguage: "en-US",
    locationName: fullEventLocation(event)
  };
}

function parseCityStateZip(value: string) {
  const normalized = value.trim();
  const match = normalized.match(/^(.+?),\s*([A-Z]{2})\s+(\d{5})(?:-\d{4})?$/);

  return {
    city: match?.[1] ?? "Mobile",
    region: match?.[2] ?? "AL",
    postalCode: match?.[3]
  };
}
