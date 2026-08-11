import { NextRequest, NextResponse } from "next/server";
import type { CommunityEvent } from "@/lib/community-events";

export const runtime = "nodejs";

type PublishInput = {
  title?: string;
  organization?: string;
  eventType?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  timeZoneOffset?: string;
  venueName?: string;
  venueAddress?: string;
  cityStateZip?: string;
  description?: string;
  ticketUrl?: string;
  cost?: string;
  audience?: string;
  publicContact?: string;
  accessibilityNotes?: string;
  parkingNotes?: string;
  flyerUrl?: string;
  organizationLogoUrl?: string;
};

type GitHubContentResponse = {
  sha: string;
  content: string;
};

type GitHubUpdateResponse = {
  commit?: {
    sha?: string;
    html_url?: string;
  };
};

const EVENT_DATA_PATH = "data/community-events.json";

export async function POST(request: NextRequest) {
  const adminSecret = process.env.ADMIN_EVENTS_SECRET;

  if (!adminSecret) {
    return jsonError("ADMIN_EVENTS_SECRET is not configured on the server.", 500);
  }

  const providedSecret = request.headers.get("x-admin-events-secret") ?? "";

  if (providedSecret !== adminSecret) {
    return jsonError("Unauthorized event publisher request.", 401);
  }

  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return jsonError("GITHUB_TOKEN is not configured on the server.", 500);
  }

  let body: Partial<PublishInput>;

  try {
    body = (await request.json()) as Partial<PublishInput>;
  } catch {
    return jsonError("Invalid JSON payload.", 400);
  }

  const normalized = normalizeInput(body);
  const validationError = validateInput(normalized);

  if (validationError) {
    return jsonError(validationError, 400);
  }

  const owner = process.env.GITHUB_OWNER || "TheCryptoArborist";
  const repo = process.env.GITHUB_REPO || "251mardigras";
  const branch = process.env.GITHUB_BRANCH || "main";
  const repository = `${owner}/${repo}`;

  try {
    const existingFile = await readEventDataFile(repository, branch, githubToken);
    const existingEvents = parseEvents(existingFile.content);
    const event = buildCommunityEvent(normalized, existingEvents);
    const updatedEvents = [...existingEvents, event].sort(
      (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    );

    const updateResult = await writeEventDataFile({
      repository,
      branch,
      token: githubToken,
      sha: existingFile.sha,
      events: updatedEvents,
      eventTitle: event.title
    });

    const buildHookTriggered = await triggerBuildHook();

    return NextResponse.json({
      ok: true,
      event,
      commitSha: updateResult.commit?.sha ?? null,
      commitUrl: updateResult.commit?.html_url ?? null,
      buildHookTriggered
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to publish event.", 500);
  }
}

function normalizeInput(input: Partial<PublishInput>): Required<PublishInput> {
  return {
    title: clean(input.title),
    organization: clean(input.organization),
    eventType: clean(input.eventType),
    eventDate: clean(input.eventDate),
    startTime: clean(input.startTime),
    endTime: clean(input.endTime),
    timeZoneOffset: clean(input.timeZoneOffset) || "-05:00",
    venueName: clean(input.venueName),
    venueAddress: clean(input.venueAddress),
    cityStateZip: clean(input.cityStateZip),
    description: clean(input.description),
    ticketUrl: clean(input.ticketUrl),
    cost: clean(input.cost),
    audience: clean(input.audience),
    publicContact: clean(input.publicContact),
    accessibilityNotes: clean(input.accessibilityNotes),
    parkingNotes: clean(input.parkingNotes),
    flyerUrl: clean(input.flyerUrl),
    organizationLogoUrl: clean(input.organizationLogoUrl)
  };
}

function validateInput(input: Required<PublishInput>) {
  const requiredFields: Array<keyof PublishInput> = [
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

  const missing = requiredFields.filter((field) => !input[field]);

  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.eventDate)) {
    return "Event date must be in YYYY-MM-DD format.";
  }

  if (!/^\d{2}:\d{2}$/.test(input.startTime) || !/^\d{2}:\d{2}$/.test(input.endTime)) {
    return "Start and end times must be in HH:MM 24-hour format.";
  }

  if (!/^-0[56]:00$/.test(input.timeZoneOffset)) {
    return "Time zone offset must be -05:00 for daylight time or -06:00 for standard time.";
  }

  return null;
}

function buildCommunityEvent(input: Required<PublishInput>, existingEvents: CommunityEvent[]): CommunityEvent {
  const year = input.eventDate.slice(0, 4);
  const baseSlug = slugify(`${input.title}-${year}`);
  const slug = uniqueSlug(baseSlug, existingEvents);
  const event: CommunityEvent = {
    id: slug,
    slug,
    status: "approved",
    title: input.title,
    organization: input.organization,
    eventType: input.eventType,
    startDateTime: `${input.eventDate}T${input.startTime}:00${input.timeZoneOffset}`,
    endDateTime: `${input.eventDate}T${input.endTime}:00${input.timeZoneOffset}`,
    venueName: input.venueName,
    venueAddress: input.venueAddress,
    cityStateZip: input.cityStateZip,
    description: input.description
  };

  addOptional(event, "ticketUrl", input.ticketUrl);
  addOptional(event, "cost", input.cost);
  addOptional(event, "audience", input.audience);
  addOptional(event, "publicContact", input.publicContact);
  addOptional(event, "accessibilityNotes", input.accessibilityNotes);
  addOptional(event, "parkingNotes", input.parkingNotes);
  addOptional(event, "flyerUrl", input.flyerUrl);
  addOptional(event, "organizationLogoUrl", input.organizationLogoUrl);

  return event;
}

function addOptional<Key extends keyof CommunityEvent>(event: CommunityEvent, key: Key, value: string) {
  if (value) {
    event[key] = value as CommunityEvent[Key];
  }
}

async function readEventDataFile(repository: string, branch: string, token: string) {
  const response = await fetch(
    `https://api.github.com/repos/${repository}/contents/${EVENT_DATA_PATH}?ref=${encodeURIComponent(branch)}`,
    {
      headers: githubHeaders(token),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(`Unable to read ${EVENT_DATA_PATH} from GitHub: ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as GitHubContentResponse;
  return {
    sha: data.sha,
    content: decodeBase64(data.content)
  };
}

async function writeEventDataFile({
  repository,
  branch,
  token,
  sha,
  events,
  eventTitle
}: {
  repository: string;
  branch: string;
  token: string;
  sha: string;
  events: CommunityEvent[];
  eventTitle: string;
}) {
  const response = await fetch(`https://api.github.com/repos/${repository}/contents/${EVENT_DATA_PATH}`, {
    method: "PUT",
    headers: githubHeaders(token),
    body: JSON.stringify({
      message: `Publish community event: ${eventTitle}`,
      content: encodeBase64(`${JSON.stringify(events, null, 2)}\n`),
      sha,
      branch
    })
  });

  if (!response.ok) {
    throw new Error(`Unable to update ${EVENT_DATA_PATH} on GitHub: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as GitHubUpdateResponse;
}

async function triggerBuildHook() {
  const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;

  if (!buildHookUrl) {
    return false;
  }

  const response = await fetch(buildHookUrl, { method: "POST" });

  if (!response.ok) {
    throw new Error(`GitHub update succeeded, but Netlify build hook failed: ${response.status} ${await response.text()}`);
  }

  return true;
}

function parseEvents(content: string) {
  try {
    const events = JSON.parse(content) as CommunityEvent[];

    if (!Array.isArray(events)) {
      throw new Error("Event data file must contain an array.");
    }

    return events;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unable to parse event data JSON.");
  }
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "community-event";
}

function uniqueSlug(baseSlug: string, existingEvents: CommunityEvent[]) {
  const used = new Set(existingEvents.map((event) => event.slug));

  if (!used.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  let candidate = `${baseSlug}-${suffix}`;

  while (used.has(candidate)) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }

  return candidate;
}

function decodeBase64(content: string) {
  return Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf-8");
}

function encodeBase64(content: string) {
  return Buffer.from(content, "utf-8").toString("base64");
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}
