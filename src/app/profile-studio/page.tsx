import type { Metadata } from "next";
import ProfileStudio from "./studio";

export const metadata: Metadata = {
  title: "Profile Studio",
  description: "Make your photo ready for Mobile Mardi Gras with purple and gold frames.",
  alternates: { canonical: "/profile-studio" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } }
};

export default function Page() { return <ProfileStudio />; }
