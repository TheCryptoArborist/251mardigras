"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Loader2, Send, XCircle } from "lucide-react";

type FormState = {
  adminSecret: string;
  title: string;
  organization: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  timeZoneOffset: string;
  venueName: string;
  venueAddress: string;
  cityStateZip: string;
  mapUrl: string;
  description: string;
  ticketUrl: string;
  cost: string;
  audience: string;
  publicContact: string;
  accessibilityNotes: string;
  parkingNotes: string;
  flyerUrl: string;
  organizationLogoUrl: string;
};

type PublishResult = {
  ok: boolean;
  event?: {
    title: string;
    slug: string;
  };
  commitUrl?: string | null;
  buildHookTriggered?: boolean;
  error?: string;
};

const eventTypeOptions = [
  "Fundraiser",
  "Ball",
  "Party",
  "Watch Party",
  "Organization Event",
  "Community Event",
  "Family-Friendly Event",
  "Food & Drink Event",
  "Mardi Gras Gear / Vendor Event",
  "Meeting",
  "Other"
];

const audienceOptions = [
  "",
  "Family-friendly",
  "All ages",
  "Adults only",
  "21+",
  "Adults only, 21+",
  "Other / see event details"
];

const initialFormState: FormState = {
  adminSecret: "",
  title: "",
  organization: "",
  eventType: "Fundraiser",
  eventDate: "",
  startTime: "",
  endTime: "",
  timeZoneOffset: "-05:00",
  venueName: "",
  venueAddress: "",
  cityStateZip: "Mobile, AL ",
  mapUrl: "",
  description: "",
  ticketUrl: "",
  cost: "",
  audience: "",
  publicContact: "",
  accessibilityNotes: "",
  parkingNotes: "",
  flyerUrl: "",
  organizationLogoUrl: ""
};

const requiredFields: Array<keyof FormState> = [
  "adminSecret",
  "title",
  "organization",
  "eventType",
  "eventDate",
  "startTime",
  "endTime",
  "venueName",
  "venueAddress",
  "cityStateZip",
  "description"
];

export function CommunityEventPublisherForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isPublishing, setIsPublishing] = useState(false);
  const [result, setResult] = useState<PublishResult | null>(null);
  const [error, setError] = useState("");

  const missingRequiredFields = useMemo(
    () => requiredFields.filter((field) => !form[field].trim()),
    [form]
  );
  const slugPreview = useMemo(() => makeSlug(`${form.title || "event-name"}-${form.eventDate.slice(0, 4) || "year"}`), [form.title, form.eventDate]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setResult(null);
  }

  async function publishEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (missingRequiredFields.length > 0) {
      setError(`Missing required fields: ${missingRequiredFields.join(", ")}`);
      return;
    }

    setIsPublishing(true);

    try {
      const { adminSecret, ...payload } = form;
      const response = await fetch("/api/admin/community-events/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-events-secret": adminSecret
        },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as PublishResult;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to publish event.");
      }

      setResult(data);
      setForm((current) => ({ ...initialFormState, adminSecret: current.adminSecret }));
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Unable to publish event.");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <form onSubmit={publishEvent} className="rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist p-5 shadow-card">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Website calendar publisher</p>
          <h2 className="mt-2 text-2xl font-black text-parade-purpleDark">Publish an approved community event</h2>
          <p className="mt-2 text-sm leading-6 text-parade-muted">
            Review the Jotform submission first, then enter the approved public details here. Private submitter fields should not be copied into this publisher.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <Field label="Admin publish password" required>
            <input
              type="password"
              value={form.adminSecret}
              onChange={(event) => updateField("adminSecret", event.target.value)}
              className={inputClassName}
              autoComplete="current-password"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Event name" required>
              <input value={form.title} onChange={(event) => updateField("title", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="Organization" required>
              <input value={form.organization} onChange={(event) => updateField("organization", event.target.value)} className={inputClassName} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Event type" required>
              <select value={form.eventType} onChange={(event) => updateField("eventType", event.target.value)} className={inputClassName}>
                {eventTypeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Family-Friendly / All-Ages / Adults-Only">
              <select value={form.audience} onChange={(event) => updateField("audience", event.target.value)} className={inputClassName}>
                {audienceOptions.map((option) => (
                  <option key={option || "blank"} value={option}>{option || "Select audience, if provided"}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Event date" required>
              <input type="date" value={form.eventDate} onChange={(event) => updateField("eventDate", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="Start time" required>
              <input type="time" value={form.startTime} onChange={(event) => updateField("startTime", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="End time" required>
              <input type="time" value={form.endTime} onChange={(event) => updateField("endTime", event.target.value)} className={inputClassName} />
            </Field>
            <Field label="Central offset" required>
              <select value={form.timeZoneOffset} onChange={(event) => updateField("timeZoneOffset", event.target.value)} className={inputClassName}>
                <option value="-05:00">-05:00 daylight time</option>
                <option value="-06:00">-06:00 standard time</option>
              </select>
            </Field>
          </div>

          <section className="rounded-[1.25rem] border border-parade-gold/30 bg-white/70 p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Location fields from Jotform</p>
            <div className="mt-4 grid gap-4">
              <Field label="Venue name" required>
                <input value={form.venueName} onChange={(event) => updateField("venueName", event.target.value)} className={inputClassName} />
              </Field>
              <Field label="Venue street address" required>
                <input value={form.venueAddress} onChange={(event) => updateField("venueAddress", event.target.value)} className={inputClassName} placeholder="Street address or location notes from the submission" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City, State, ZIP" required>
                  <input value={form.cityStateZip} onChange={(event) => updateField("cityStateZip", event.target.value)} className={inputClassName} />
                </Field>
                <Field label="Google or Apple Maps Link">
                  <input value={form.mapUrl} onChange={(event) => updateField("mapUrl", event.target.value)} className={inputClassName} placeholder="https://maps.app.goo.gl/..." />
                </Field>
              </div>
            </div>
          </section>

          <Field label="Public event description" required>
            <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} className={`${inputClassName} min-h-32 resize-y`} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ticket, RSVP, or Event Link">
              <input value={form.ticketUrl} onChange={(event) => updateField("ticketUrl", event.target.value)} className={inputClassName} placeholder="https://" />
            </Field>
            <Field label="Cost / Free or Paid">
              <input value={form.cost} onChange={(event) => updateField("cost", event.target.value)} className={inputClassName} placeholder="Free, $20 entry, Ticketed, etc." />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Public contact email or phone">
              <input value={form.publicContact} onChange={(event) => updateField("publicContact", event.target.value)} className={inputClassName} placeholder="Name/email/phone intended for public display" />
            </Field>
            <Field label="Event flyer URL">
              <input value={form.flyerUrl} onChange={(event) => updateField("flyerUrl", event.target.value)} className={inputClassName} placeholder="https://www.jotform.com/uploads/..." />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Organization logo URL">
              <input value={form.organizationLogoUrl} onChange={(event) => updateField("organizationLogoUrl", event.target.value)} className={inputClassName} placeholder="https://www.jotform.com/uploads/..." />
            </Field>
            <Field label="Parking notes">
              <input value={form.parkingNotes} onChange={(event) => updateField("parkingNotes", event.target.value)} className={inputClassName} />
            </Field>
          </div>

          <Field label="Accessibility notes">
            <input value={form.accessibilityNotes} onChange={(event) => updateField("accessibilityNotes", event.target.value)} className={inputClassName} />
          </Field>
        </div>

        {error ? (
          <div className="mt-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-800">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        ) : null}

        {result?.ok ? (
          <div className="mt-5 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>
              Published {result.event?.title}. {result.buildHookTriggered ? "A Netlify build hook was triggered." : "No Netlify build hook is configured yet."}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isPublishing}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
            Publish Approved Event
          </button>
          <p className="text-xs font-semibold leading-5 text-parade-muted">
            This commits to GitHub and can trigger a rebuild when the Netlify build hook is configured.
          </p>
        </div>
      </form>

      <aside className="space-y-4">
        <section className="rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 shadow-card">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Preview</p>
          <h2 className="mt-2 text-2xl font-black text-parade-purpleDark">{form.title || "Event name"}</h2>
          <p className="mt-1 text-sm font-bold text-parade-muted">Hosted by {form.organization || "Organization"}</p>
          <div className="mt-4 space-y-2 text-sm leading-6 text-parade-muted">
            <p><span className="font-black uppercase text-parade-purple">Type:</span> {form.eventType || "Event type"}</p>
            <p><span className="font-black uppercase text-parade-purple">When:</span> {formatPreviewDate(form)}</p>
            <p><span className="font-black uppercase text-parade-purple">Where:</span> {[form.venueName, form.venueAddress, form.cityStateZip].filter(Boolean).join(", ") || "Venue"}</p>
            {form.mapUrl ? <p><span className="font-black uppercase text-parade-purple">Map:</span> directions link included</p> : null}
          </div>
          <p className="mt-4 text-sm leading-6 text-parade-muted">{form.description || "Event description will appear here."}</p>
          <p className="mt-4 rounded-full border border-parade-gold/35 bg-white/80 px-3 py-2 text-xs font-black uppercase text-parade-purple">
            Slug preview: {slugPreview}
          </p>
        </section>

        <section className="rounded-[1.5rem] border border-amber-200 bg-parade-goldSoft p-5 shadow-civic">
          <h2 className="text-lg font-black text-amber-950">Approval checklist</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
            <li>Confirm the event is Mardi Gras or Carnival related.</li>
            <li>Confirm the submitter appears authorized.</li>
            <li>Do not publish private submitter name or private submitter email.</li>
            <li>Only paste public contact information if it was intended for public display.</li>
            <li>Copy venue street address, city/state/ZIP, and map links from the Jotform submission when provided.</li>
            <li>Use -05:00 during daylight time and -06:00 during standard time.</li>
          </ul>
        </section>
      </aside>
    </div>
  );
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-parade-purple">
        {label} {required ? <span className="text-parade-gold">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function formatPreviewDate(form: FormState) {
  if (!form.eventDate && !form.startTime && !form.endTime) {
    return "Date and time";
  }

  return `${form.eventDate || "date"} • ${form.startTime || "start"}–${form.endTime || "end"} CT`;
}

function makeSlug(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "community-event";
}

const inputClassName =
  "w-full rounded-2xl border border-parade-gold/30 bg-white px-3 py-3 text-sm font-semibold text-parade-ink outline-none transition placeholder:text-parade-muted focus:border-parade-purple focus:ring-2 focus:ring-parade-purpleSoft";