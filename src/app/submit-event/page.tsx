import Link from "next/link";
import { ArrowRight, ExternalLink, FileText, ShieldCheck } from "lucide-react";
import { COMMUNITY_EVENT_SUBMISSION_FORM_URL } from "@/lib/community-events";

export const dynamic = "force-dynamic";

export default function SubmitEventPage() {
  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Community Mardi Gras Events</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">
            Submit a Community Mardi Gras Event
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-parade-muted sm:text-lg">
            Organizations may submit Mardi Gras-related events for review. Approved events may be added to the Community Mardi Gras Events calendar on mg251.xyz.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={COMMUNITY_EVENT_SUBMISSION_FORM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-purple px-5 py-3 text-sm font-black text-white hover:bg-parade-purpleDark">
              Open Jotform <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/events" className="inline-flex items-center justify-center gap-2 rounded-full border border-parade-line bg-white px-5 py-3 text-sm font-black text-parade-purple hover:bg-parade-purpleSoft">
              View Events Calendar <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[1.5rem] border border-amber-200 bg-parade-goldSoft p-5 shadow-civic">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-amber-950">
              <span className="font-black">Submission review required.</span>{" "}
              Submitting an event does not guarantee publication. Event details may be edited for clarity. This calendar is not the official parade schedule.
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-[1.5rem] border border-parade-line bg-white shadow-card">
          <div className="border-b border-parade-line bg-parade-purpleMist p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-goldSoft text-parade-purple ring-1 ring-parade-gold/40">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-parade-purpleDark">Event intake form</h2>
                <p className="mt-1 text-sm leading-6 text-parade-muted">
                  Use the embedded form below or open the form in a new tab if your browser blocks embedded forms.
                </p>
              </div>
            </div>
          </div>
          <iframe
            src={COMMUNITY_EVENT_SUBMISSION_FORM_URL}
            title="Community Mardi Gras Event Submission"
            className="h-[900px] w-full border-0"
            loading="lazy"
          />
        </section>
      </div>
    </div>
  );
}
