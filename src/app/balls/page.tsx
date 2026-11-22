import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { formatCommunityEventDate, getApprovedBalls } from "@/lib/community-events";
import BallDirectory from "./BallDirectory";

export const metadata: Metadata = {
  title: "2027 Mardi Gras Balls and Celebrations",
  description: "Browse Mobile-area 2027 Mardi Gras balls or submit your society’s dates and venue for MG251 review.",
  alternates: { canonical: "/balls" },
  openGraph: { images: ["/images/parade-share-banner.jpg"] }
};

export default function BallsPage() {
  const balls = getApprovedBalls(2027);

  return (
    <main className="bg-parade-cream">
      <header className="border-b-4 border-parade-gold bg-parade-purpleDeep text-white">
        <div className="mx-auto grid max-w-6xl gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <p className="font-bold text-parade-goldBright">Mobile &amp; Baldwin Counties</p>
            <h1 className="mt-3 font-serif text-5xl font-bold leading-none sm:text-6xl">2027 Mardi Gras <span className="block text-parade-goldBright">Ball Schedule</span></h1>
            <p className="mt-5 max-w-md leading-relaxed text-purple-100">See published ball dates or help build the schedule by submitting your society’s details.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#ball-schedule" className="rounded-full bg-parade-gold px-5 py-3 font-bold text-parade-purpleDeep hover:bg-parade-goldBright">View ball schedule</a>
              <a href="#ball-directory" className="rounded-full border border-parade-gold/70 px-5 py-3 font-bold hover:bg-white/10">Submit ball details</a>
            </div>
          </div>
          <Image src="/images/parade-share-banner.jpg" alt="Mobile Mardi Gras artwork with costumed revelers and the Mobile skyline" width={1200} height={500} priority className="w-full rounded-xl border border-parade-gold/50 shadow-2xl" />
        </div>
      </header>
      <section id="ball-schedule" className="mx-auto max-w-6xl scroll-mt-28 px-4 pt-11 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl font-bold text-parade-purpleDark">Published 2027 balls</h2>
        {balls.length === 0 && <p className="mt-3 text-parade-muted">Approved listings will appear here as societies confirm their plans.</p>}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {balls.map((ball) => {
            if (ball.ballVisibility === "date-only") {
              const date = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" })
                .format(new Date(ball.startDateTime.slice(0, 10) + "T12:00:00Z"));
              return (
                <article key={ball.id} className="rounded-2xl border border-parade-line bg-white p-5 shadow-card">
                  <h3 className="text-xl font-black text-parade-purpleDark">{ball.organization}</h3>
                  <p className="mt-3 flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4" aria-hidden="true" />{date}</p>
                </article>
              );
            }
            const src = ball.eventArtworkUrl ?? ball.organizationLogoUrl;
            return (
              <article key={ball.id} className="flex flex-col gap-4 rounded-2xl border border-parade-line bg-white p-5 shadow-card sm:flex-row">
                {src && <Image src={src} alt="" width={112} height={112} className="h-24 w-24 shrink-0 rounded-xl bg-parade-goldSoft object-contain" />}
                <div>
                  <p className="text-sm font-semibold text-parade-muted">{ball.organization}</p>
                  <h3 className="mt-1 text-xl font-black text-parade-purpleDark">{ball.title}</h3>
                  <p className="mt-3 flex items-start gap-2 text-sm"><CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />{formatCommunityEventDate(ball)}</p>
                  {ball.venueName && <p className="mt-2 flex items-start gap-2 text-sm"><MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />{ball.venueName}</p>}
                  {ball.ballVisibility === "schedule-only"
                    ? <p className="mt-3 text-sm font-bold text-parade-purple">Invitation only</p>
                    : <Link href={`/events/${ball.slug}`} className="mt-3 inline-block text-sm font-bold text-parade-purple underline">View ball details</Link>}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <BallDirectory />
    </main>
  );
}
