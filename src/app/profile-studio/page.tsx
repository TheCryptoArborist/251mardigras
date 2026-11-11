import type { Metadata } from "next";
import ProfileStudio from "./studio";

export const metadata: Metadata = {
  title: "Mardi Gras Profile Studio",
  description: "Create your Mardi Gras profile picture with purple and gold frames, your society’s logo, and a badge that’s yours. Free from MG251.xyz.",
  openGraph: {
    title: "Mardi Gras Profile Studio | MG251.xyz",
    description: "Frame your photo. Represent your society. Create and download your own Mardi Gras profile picture with 59 society logos and purple-and-gold frames.",
    url: "/profile-studio",
    siteName: "MG251.xyz",
    type: "website",
    images: [{ url: "/profile-studio/opengraph-image", width: 1200, height: 630, alt: "Mardi Gras Profile Studio — custom frames and 59 society logos at MG251.xyz" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mardi Gras Profile Studio | MG251.xyz",
    description: "Create your Mardi Gras profile picture with custom frames and your society’s logo. Free at MG251.xyz.",
    images: ["/profile-studio/opengraph-image"]
  },
  alternates: { canonical: "/profile-studio" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } }
};

export default function Page() { return <ProfileStudio />; }
