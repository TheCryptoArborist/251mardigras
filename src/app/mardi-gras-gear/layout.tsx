import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mobile Mardi Gras Gear and Throws",
  description: "Find Mobile Mardi Gras throws, shirts, apparel, gear, and shopping resources for parade season.",
  path: "/mardi-gras-gear"
});

export default function MardiGrasGearLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Mardi Gras Gear", path: "/mardi-gras-gear" }]))} />
      {children}
    </>
  );
}
