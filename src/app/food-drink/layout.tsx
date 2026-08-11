import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Food and Drink Near Mobile Mardi Gras",
  description: "Find downtown Mobile restaurants, coffee shops, bakeries, sweets, breweries, barbecue, and visitor-friendly stops near Mardi Gras parade activity.",
  path: "/food-drink"
});

export default function FoodDrinkLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Food and Drink", path: "/food-drink" }]))} />
      {children}
    </>
  );
}
