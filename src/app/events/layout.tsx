import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mobile Mardi Gras Community Events Calendar",
  description: "Find Mardi Gras balls, fundraisers, parties, socials, watch parties, and community events around Mobile, Alabama.",
  path: "/events"
});

export default function EventsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }]))} />
      {children}
    </>
  );
}
