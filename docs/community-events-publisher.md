# Community Events Website Publisher

This is the lightweight publishing workflow for the `Community Mardi Gras Events` calendar.

## Goal

Let the site owner review a Jotform submission and publish an approved event to the website calendar without hand-editing TypeScript files.

The publisher is intentionally simpler than a full database-backed admin workflow.

## Admin route

```text
/admin/community-events
```

The page contains a form for approved public event details and a preview panel.

## API route

```text
/api/admin/community-events/publish
```

The API route:

1. Verifies `ADMIN_EVENTS_SECRET` from the request header.
2. Validates required event fields.
3. Reads `data/community-events.json` from GitHub.
4. Appends the approved event with `status: "approved"`.
5. Commits the updated JSON file to the configured branch.
6. Optionally triggers `NETLIFY_BUILD_HOOK_URL`.

## Event source file

```text
data/community-events.json
```

The public calendar reads approved events from this JSON file through `src/lib/community-events.ts`.

## Required environment variables

Set these in Netlify for production and in `.env` for local testing:

```text
ADMIN_EVENTS_SECRET=<private password used on the admin publisher page>
GITHUB_TOKEN=<fine-grained GitHub token with contents read/write access to this repo>
GITHUB_OWNER=TheCryptoArborist
GITHUB_REPO=251mardigras
GITHUB_BRANCH=main
NETLIFY_BUILD_HOOK_URL=<optional Netlify build hook URL>
```

`NETLIFY_BUILD_HOOK_URL` is optional. Without it, the GitHub commit can still update the event data, but the site will need a normal deploy before the event appears live.

## Recommended workflow

1. A Mardi Gras organization submits an event through Jotform.
2. Review the submission in Jotform.
3. Open `/admin/community-events`.
4. Enter the approved public event details.
5. Do not copy private submitter fields into the public event.
6. Click `Publish Approved Event`.
7. Confirm the commit/build message.
8. Check `/events` after the build completes.

## Public versus private fields

Publish:

- Event name
- Organization
- Event type
- Date and time
- Venue/location
- Public description
- Ticket/RSVP link
- Cost
- Audience
- Public contact
- Accessibility notes
- Parking notes
- Flyer URL
- Organization logo URL

Do not publish:

- Private submitter name
- Private submitter email
- Internal review notes
- Private correspondence

## Time zone notes

Use:

```text
-05:00 for Central Daylight Time
-06:00 for Central Standard Time
```

Most August events use `-05:00`. Most January events use `-06:00`.
