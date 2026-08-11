import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Submit a Mobile Mardi Gras Event",
  description: "Submit a Mardi Gras-related event for review so it can be considered for the Mobile Mardi Gras community events calendar.",
  path: "/submit-event"
});

export default function SubmitEventLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Submit Event", path: "/submit-event" }]))} />
      {children}
    </>
  );
}
