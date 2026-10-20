import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mobile Mardi Gras Parking Guide",
  description: "Find parking, access, transportation, and visitor planning resources for Mobile Mardi Gras in downtown Mobile, Alabama.",
  path: "/parking-access"
});

export default function ParkingAccessLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Parking", path: "/parking-access" }]))} />
      {children}
    </>
  );
}
