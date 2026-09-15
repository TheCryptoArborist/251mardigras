import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PrototypeNav, PrototypeNotice } from "@/components/mg251-mvp/PrototypeUi";

export const metadata: Metadata = {
  title: "MG251 Phase 0 Prototype",
  description: "Fictional mobile-first planning prototype for MG251 membership, sponsor, organization, and administrative workflows.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default function Mg251PrototypeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-parade-purpleMist">
      <PrototypeNotice />
      <PrototypeNav />
      {children}
    </div>
  );
}
