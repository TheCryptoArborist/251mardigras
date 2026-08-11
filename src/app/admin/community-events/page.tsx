import Link from "next/link";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { CommunityEventPublisherForm } from "@/components/CommunityEventPublisherForm";

export const dynamic = "force-dynamic";

export default function CommunityEventsAdminPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/15">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Admin
          </Link>
          <div className="mt-7 flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow">
              <CalendarPlus className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Community events publisher</p>
              <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Publish approved events to the website calendar
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-purple-100 sm:text-lg">
                Use this page after reviewing a Jotform submission. Approved public event details are written to the website event data and can trigger a deploy when the build hook is configured.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <CommunityEventPublisherForm />
      </main>
    </div>
  );
}
