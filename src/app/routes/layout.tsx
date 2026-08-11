import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mobile Mardi Gras Parade Routes",
  description: "View Mobile Mardi Gras parade route maps and route resources for downtown Mobile, Alabama.",
  path: "/routes"
});

export default function RoutesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Routes", path: "/routes" }]))} />
      {children}
    </>
  );
}
