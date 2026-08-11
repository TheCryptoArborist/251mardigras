import type { Metadata } from "next";
import "./globals.css";
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
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION
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
        <SiteHeader />
        <main>{children}</main>
        <footer className="border-t border-parade-line bg-gradient-to-r from-white via-parade-cream to-parade-purpleMist">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-parade-muted sm:px-6 lg:px-8">
            <p className="font-black text-parade-ink">Mardi Gras - Mobile, AL</p>
            <p>
              Unofficial public-source monitor and visitor hub. Verify parade, route, traffic, public safety, emergency, and weather decisions with official agencies.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
