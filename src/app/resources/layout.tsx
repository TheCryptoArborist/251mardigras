import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mobile Mardi Gras Visitor Guide",
  description: "Plan your Mobile Mardi Gras visit with schedules, route maps, events, live coverage, parking, food, weather, and local history in the MG251 Visitor Guide.",
  path: "/resources"
});

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Visitor Guide", path: "/resources" }]))} />
      {children}
    </>
  );
}
