import { getStore } from "@netlify/blobs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STORE_NAME = "homepage-visitor-counter";
const COUNTER_KEY = "summary";
const STARTED_AT = "2026-08-11T00:00:00.000Z";

type VisitorCounterRecord = {
  total: number;
  startedAt: string;
  updatedAt: string;
};

function fallbackCounter(): VisitorCounterRecord {
  return {
    total: 0,
    startedAt: STARTED_AT,
    updatedAt: new Date().toISOString()
  };
}

function parseCounter(value: string | null): VisitorCounterRecord {
  if (!value) {
    return fallbackCounter();
  }

  try {
    const parsed = JSON.parse(value) as Partial<VisitorCounterRecord>;
    const total = typeof parsed.total === "number" && Number.isFinite(parsed.total) ? Math.max(0, Math.floor(parsed.total)) : 0;

    return {
      total,
      startedAt: typeof parsed.startedAt === "string" ? parsed.startedAt : STARTED_AT,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString()
    };
  } catch {
    return fallbackCounter();
  }
}

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}

async function readCounter() {
  const store = getStore(STORE_NAME);
  const current = await store.get(COUNTER_KEY, { type: "text" });
  return parseCounter(current);
}

export async function GET() {
  try {
    const counter = await readCounter();

    return jsonResponse({
      ok: true,
      total: counter.total,
      startedAt: counter.startedAt,
      updatedAt: counter.updatedAt
    });
  } catch {
    return jsonResponse({
      ok: false,
      total: null
    });
  }
}

export async function POST() {
  try {
    const store = getStore(STORE_NAME);
    const current = parseCounter(await store.get(COUNTER_KEY, { type: "text" }));
    const next: VisitorCounterRecord = {
      total: current.total + 1,
      startedAt: current.startedAt,
      updatedAt: new Date().toISOString()
    };

    await store.set(COUNTER_KEY, JSON.stringify(next));

    return jsonResponse({
      ok: true,
      total: next.total,
      startedAt: next.startedAt,
      updatedAt: next.updatedAt
    });
  } catch {
    return jsonResponse({
      ok: false,
      total: null
    });
  }
}
