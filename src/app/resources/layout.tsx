import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mobile Mardi Gras Resource Guide",
  description: "Find direct Mobile Mardi Gras visitor links for live coverage, social channels, parking, food and drink, gear, throws, routes, weather, and previous parade seasons.",
  path: "/resources"
});

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }]))} />
      {children}
    </>
  );
}
