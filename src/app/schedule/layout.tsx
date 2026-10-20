import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "2027 Mobile Mardi Gras Parade Schedule & Route Maps",
  description: "Plan Mobile Mardi Gras from January 22 to February 9, 2027. Browse parade times and Routes A–I, with listings checked against the City of Mobile on October 20, 2026.",
  path: "/schedule",
  image: "/schedule/opengraph-image",
  imageAlt: "2027 Mobile Mardi Gras Parade Schedule on MG251.xyz"
});

export default function ScheduleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Schedule", path: "/schedule" }]))} />
      {children}
    </>
  );
}
