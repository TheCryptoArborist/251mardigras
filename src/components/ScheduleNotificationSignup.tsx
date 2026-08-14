"use client";

import { CheckCircle2, Loader2, Mail } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

type SignupSource = "homepage" | "schedule";

type SignupResponse = {
  ok: boolean;
  alreadySubscribed?: boolean;
  error?: string;
};

type ScheduleNotificationSignupProps = {
  source?: SignupSource;
  compact?: boolean;
};

export function ScheduleNotificationSignup({ source = "schedule", compact = false }: ScheduleNotificationSignupProps) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/schedule-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, website, source })
      });
      const data = (await response.json()) as SignupResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to save your email right now.");
      }

      setStatus("success");
      setMessage(
        data.alreadySubscribed
          ? "You are already signed up. We will email you when the verified 2027 schedule is posted."
          : "You are on the list. We will email you when the verified 2027 schedule is posted."
      );
      setEmail("");
      setWebsite("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to save your email right now.");
    }
  }

  const form = (
    <form onSubmit={handleSubmit}>
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setWebsite(event.target.value)}
          />
        </label>
      </div>

      <label htmlFor={`schedule-alert-email-${source}`} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`schedule-alert-email-${source}`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
          placeholder="Email address"
          className="min-w-0 flex-1 rounded-full border border-parade-line bg-white px-4 py-3 text-sm font-semibold text-parade-ink outline-none transition placeholder:text-parade-muted focus:border-parade-gold focus:ring-2 focus:ring-parade-gold/35"
          aria-describedby={`schedule-alert-note-${source}`}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-sm transition hover:-translate-y-0.5 hover:bg-parade-goldBright disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving
            </>
          ) : (
            "Notify Me"
          )}
        </button>
      </div>
      <p
        id={`schedule-alert-note-${source}`}
        className={`mt-2 text-xs font-semibold leading-5 ${compact ? "text-purple-100" : "text-parade-muted"}`}
      >
        Optional. Your email will be used only for this schedule-release notification.
      </p>
      {status === "error" ? (
        <p className="mt-2 rounded-lg bg-parade-goldSoft px-3 py-2 text-sm font-semibold text-parade-purpleDark" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );

  if (compact) {
    return status === "success" ? (
      <div className="flex items-start gap-2 rounded-xl border border-parade-gold/45 bg-white/95 p-3 text-sm font-semibold leading-5 text-parade-purpleDark" role="status">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </div>
    ) : (
      form
    );
  }

  return (
    <section className="rounded-[1.25rem] border border-parade-gold/50 bg-white p-4 text-parade-ink shadow-civic sm:p-5" aria-labelledby="schedule-alert-heading">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-parade-goldSoft text-parade-purpleDark">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 id="schedule-alert-heading" className="text-lg font-black text-parade-purpleDark">
            Get the schedule release alert
          </h3>
          <p className="mt-1 text-sm font-semibold leading-5 text-parade-muted">
            Receive one email when the verified 2027 parade schedule is published.
          </p>
        </div>
      </div>

      {status === "success" ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-parade-gold/45 bg-parade-goldSoft p-3 text-sm font-semibold leading-5 text-parade-purpleDark" role="status">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </div>
      ) : (
        <div className="mt-4">{form}</div>
      )}
    </section>
  );
}
