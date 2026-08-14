import { createHash } from "node:crypto";
import { getDeployStore, getStore } from "@netlify/blobs";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STORE_NAME = "schedule-notification-signups";
const CAMPAIGN = "2027-parade-schedule";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type SignupRequest = {
  email?: unknown;
  website?: unknown;
  source?: unknown;
};

type SignupRecord = {
  email: string;
  campaign: typeof CAMPAIGN;
  source: "homepage" | "schedule";
  createdAt: string;
  consent: string;
};

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || "0");

  if (Number.isFinite(contentLength) && contentLength > 4096) {
    return jsonResponse({ ok: false, error: "Request is too large." }, 413);
  }

  let body: SignupRequest;

  try {
    body = (await request.json()) as SignupRequest;
  } catch {
    return jsonResponse({ ok: false, error: "Invalid request." }, 400);
  }

  const honeypot = typeof body.website === "string" ? body.website.trim() : "";

  if (honeypot) {
    return jsonResponse({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return jsonResponse({ ok: false, error: "Enter a valid email address." }, 400);
  }

  const source = body.source === "homepage" ? "homepage" : "schedule";
  const key = `${CAMPAIGN}/${createHash("sha256").update(email).digest("hex")}`;

  try {
    const store = getSignupStore();
    const existing = await store.get(key, { type: "text" });

    if (existing) {
      return jsonResponse({ ok: true, alreadySubscribed: true });
    }

    const record: SignupRecord = {
      email,
      campaign: CAMPAIGN,
      source,
      createdAt: new Date().toISOString(),
      consent: "One email when the verified 2027 Mobile Mardi Gras parade schedule is published."
    };

    await store.set(key, JSON.stringify(record));

    return jsonResponse({ ok: true, alreadySubscribed: false });
  } catch {
    return jsonResponse({ ok: false, error: "Unable to save your email right now. Please try again." }, 503);
  }
}

function getSignupStore() {
  return process.env.CONTEXT === "production" ? getStore(STORE_NAME) : getDeployStore(STORE_NAME);
}

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
