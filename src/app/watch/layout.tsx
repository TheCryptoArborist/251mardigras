import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Watch Mobile Mardi Gras Live",
  description: "Watch live Mobile Mardi Gras parade coverage and access previous parade season replays.",
  path: "/watch"
});

export default function WatchLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Watch", path: "/watch" }]))} />
      {children}
    </>
  );
}
