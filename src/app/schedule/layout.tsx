import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mobile Mardi Gras Parade Schedule",
  description: "View Mobile Mardi Gras parade schedule information and verify official parade details before making plans.",
  path: "/schedule"
});

export default function ScheduleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Schedule", path: "/schedule" }]))} />
      {children}
    </>
  );
}
