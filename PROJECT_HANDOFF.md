# Mobile Mardi Gras Tracker - Project Handoff

## Why This File Exists

A previous Codex chat for this project disappeared from the project thread list, but the work product is still present in this folder:

`C:\Users\peter\OneDrive\Documents\Mardi Gras`

Use this handoff as the recovered project context for continuing the Mobile Mardi Gras website.

## Project Summary

This is an unofficial public-source tracker for Mobile, Alabama Mardi Gras updates.

The current app is named `mobile-mardi-gras-tracker`. It is a Next.js App Router project that monitors public official sources, stores source snapshots, detects meaningful changes, shows weather risk for downtown Mobile, embeds the Mobile Mardi Gras YouTube livestream, and presents curated Mardi Gras resources.

The app should stay clearly unofficial. It should not imply that it is operated by the City of Mobile, Mobile Police Department, Mobile Fire-Rescue, NWS, or any official parade organization.

## Current Product Scope

Included now:

- Homepage dashboard
- Public unofficial disclaimer
- NWS weather preview and risk scoring
- High-priority public alert area
- Official-source status cards
- Routes and traffic page
- Weather page
- Resources page
- Schedule page with honest empty state until official parsing is added
- Admin source status page
- Manual admin recheck endpoint/button
- SQLite development database through Prisma
- Source snapshot and change detection service
- Weather checking service
- Seeded official sources and Mardi Gras resource categories
- Mobile Mardi Gras YouTube livestream embed
- Design concept images and QA screenshots

Not included yet:

- Full ArcGIS StoryMap schedule and route parsing
- Automated Linktree extraction
- Email alerts
- SMS alerts
- Map layers
- Full route visualization
- Searchable archive of videos and prior updates
- Production deployment hardening

## Important Guardrails

- Do not invent parade times, routes, cancellations, or public-safety information.
- Parade schedules should remain empty or clearly unverified until parsed from official public sources.
- Weather risk does not mean a parade is canceled unless an official source says so.
- Treat City, police, weather, route, traffic, towing, and public-safety changes as high priority.
- Do not overload official websites; source checks are seeded at conservative intervals.
- Keep all wording calm, public-facing, and non-official.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local development
- Cheerio for source normalization
- National Weather Service API
- lucide-react icons

## Key Commands

Install dependencies:

```bash
npm install
```

Create local environment file:

```bash
copy .env.example .env
```

Then set `NWS_USER_AGENT` to a real contact email.

Create and seed the local database:

```bash
npm run db:migrate
npm run db:seed
```

Start local development:

```bash
npm run dev
```

Run source checks:

```bash
npm run check:sources
```

Run weather checks:

```bash
npm run check:weather
```

Run lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

## Main Files

- `README.md` - setup notes and Phase 1 scope
- `package.json` - scripts and dependencies
- `prisma/schema.prisma` - database models
- `prisma/seed.ts` - seed runner
- `src/lib/seed-data.ts` - official source and resource seed data
- `src/lib/data-access.ts` - public/admin data queries
- `src/services/source-checker.ts` - source fetch, normalize, compare, and change creation
- `src/services/content-normalizer.ts` - HTML/content normalization
- `src/services/change-classifier.ts` - classifies meaningful changes
- `src/services/weather.ts` - NWS weather preview and risk logic
- `src/jobs/check-sources.ts` - source check job
- `src/jobs/check-weather.ts` - weather check job
- `src/app/page.tsx` - homepage dashboard
- `src/app/weather/page.tsx` - weather page
- `src/app/routes/page.tsx` - routes and traffic page
- `src/app/resources/page.tsx` - resources page
- `src/app/schedule/page.tsx` - parade schedule page
- `src/app/admin/page.tsx` - admin source status page
- `src/app/api/admin/recheck/route.ts` - manual recheck API
- `src/components/*` - UI components
- `design/*` - concept images
- `qa/*` - QA screenshots

## Seeded Official Sources

The current source seeds include:

- City of Mobile Mardi Gras dashboard
- Parade schedule and routes ArcGIS StoryMap
- Mardi Gras general information
- Mardi Gras parking and transportation
- Mardi Gras rules and safety tips
- Mardi Gras vendor information
- Horse use policy
- Keep Mardi Gras litter-free
- City Updates
- Mobile Police Mardi Gras page

## Seeded Resource Direction

Resources are currently seeded from the public Mobile Mardi Gras Linktree concept and categories:

- Social media
- Live coverage / channel support
- Downtown transportation
- Mobility-friendly access
- Food and drink
- Mardi Gras gear / throws
- Previous parade seasons

Future work should replace placeholder Linktree items with actual extracted URLs where possible.

## Design Notes

The UI is currently a civic dashboard style, not a marketing landing page. It should remain practical, scannable, and public-service oriented.

Current visual language:

- Mardi Gras purple/gold accents
- White dashboard panels
- Compact cards
- Clear status pills
- Simple admin/source monitoring views
- Strong disclaimers

Avoid making it look like an official City site unless the wording and ownership are changed by the user.

## Current Recovery Status

The missing chat could not be found in the Codex thread search, but the app files are intact. The project root currently has empty `.codex`, `.agents`, and `.git` directories, so the chat history was not stored directly inside this folder.

Continue from the files and this handoff rather than relying on the missing thread.

## Recommended Next Steps

1. Run the app locally and visually inspect the homepage, weather, routes, resources, schedule, and admin pages.
2. Run `npm run lint` and `npm run build`.
3. Confirm `.env` has a valid `DATABASE_URL` and `NWS_USER_AGENT`.
4. Run database migration and seed if the local SQLite database is empty.
5. Run source and weather checks.
6. Add ArcGIS StoryMap parsing for official parade schedule and route details.
7. Add automated Linktree extraction so resource URLs are real rather than placeholders.
8. Add geospatial route/map work only after official route data is parsed.
9. Consider deploying after the official-source disclaimer and data-refresh behavior are reviewed.

## Suggested Prompt For Continuing In Codex

Continue work in `C:\Users\peter\OneDrive\Documents\Mardi Gras`.

Read `PROJECT_HANDOFF.md` and `README.md` first. This is an unofficial Mobile Mardi Gras public-source tracker built with Next.js, Prisma, SQLite, Tailwind, and NWS/public-source monitoring. Preserve the unofficial disclaimer, do not invent parade details, and keep the site practical and civic-dashboard oriented.

Start by checking the current app state, then help me continue with the next highest-value improvement.
