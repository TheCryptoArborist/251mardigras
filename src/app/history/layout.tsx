import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mobile Mardi Gras History",
  description: "Explore a brief history of Mobile Mardi Gras, its Carnival traditions, and the Mobile Carnival Museum.",
  path: "/history"
});

export default function HistoryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "History", path: "/history" }]))} />
      {children}
    </>
  );
}
