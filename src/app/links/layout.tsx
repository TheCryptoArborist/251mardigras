import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mobile Mardi Gras Quick Links",
  description: "Open Mobile Mardi Gras live coverage, social channels, event calendar, replays, resources, food, parking, weather, and gear from one mobile-first links page.",
  path: "/links"
});

export default function LinksLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Links", path: "/links" }]))} />
      {children}
    </>
  );
}
