import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mobile Mardi Gras Weather Planning",
  description: "Check Mobile Mardi Gras weather planning information and reminders before parade activity in Mobile, Alabama.",
  path: "/weather"
});

export default function WeatherLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Weather", path: "/weather" }]))} />
      {children}
    </>
  );
}
