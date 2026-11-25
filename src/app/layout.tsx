import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_TITLE, organizationJsonLd, jsonLdScript, SITE_NAME, SITE_URL, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_SITE_TITLE,
    template: `%s | ${SITE_NAME}`
  },
  description: DEFAULT_SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: SITE_URL
  },
  openGraph: {
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "MG251 — Mobile Mardi Gras 2027 visitor guide" }]
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    images: ["/opengraph-image"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript([websiteJsonLd(), organizationJsonLd()])} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-xl focus:bg-parade-goldBright focus:px-4 focus:py-3 focus:font-bold focus:text-parade-purpleDeep focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-parade-purpleDeep">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="scroll-mt-24">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
