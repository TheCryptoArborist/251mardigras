import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { ScheduleNotificationSignup } from "@/components/ScheduleNotificationSignup";

type ScheduleComingSoonProps = {
  showScheduleLink?: boolean;
  className?: string;
};

export function ScheduleComingSoon({ showScheduleLink = false, className = "" }: ScheduleComingSoonProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.65rem] border border-parade-gold/50 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-5 text-white shadow-card md:p-6 ${className}`}
      aria-labelledby="schedule-coming-soon-heading"
    >
      <span className="pointer-events-none absolute left-[-4rem] top-[-5rem] h-36 w-36 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-48 w-48 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.78fr)] lg:items-center">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow ring-1 ring-white/20">
            <CalendarDays className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Official schedule update</p>
            <h2 id="schedule-coming-soon-heading" className="mt-2 text-2xl font-black leading-tight text-white md:text-3xl">
              2027 Parade Schedule Coming Soon
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-purple-100 md:text-base md:leading-7">
              MG251 is preparing the 2027 Mobile Mardi Gras parade schedule. Verified dates, start times, routes, and official-source links will appear here after the schedule is released.
            </p>
            {showScheduleLink ? (
              <Link
                href="/schedule"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-parade-gold/55 bg-white/10 px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Open schedule page <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>

        <ScheduleNotificationSignup source={showScheduleLink ? "homepage" : "schedule"} />
      </div>
    </section>
  );
}
