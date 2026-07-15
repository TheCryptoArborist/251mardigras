# Mobile Mardi Gras Tracker

Unofficial Phase 1 public-source tracker for Mobile, Alabama Mardi Gras updates.

This app monitors official public pages, stores normalized source snapshots, detects meaningful changes, shows NWS weather risk for downtown Mobile, embeds the Mobile Mardi Gras YouTube livestream, and presents curated resources from the Mobile Mardi Gras Linktree categories.

## Important Disclaimer

This is an unofficial tracker using public sources. Official parade schedule, route, traffic, public safety, weather, and emergency decisions must be verified through the City of Mobile, Mobile Police Department, Mobile Fire-Rescue, National Weather Service, and official parade organizations.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- SQLite for development
- Prisma ORM
- Cheerio for static HTML normalization
- National Weather Service API

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Update `NWS_USER_AGENT` in `.env` with a real contact email.

4. Create and seed the SQLite database:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` starts the local Next.js server.
- `npm run build` builds the production app.
- `npm run lint` runs ESLint.
- `npm run db:migrate` creates/updates the SQLite schema.
- `npm run db:seed` seeds official sources and initial resources.
- `npm run check:sources` fetches monitored official pages, normalizes content, stores snapshots, and records changes.
- `npm run check:weather` fetches NWS data, stores a weather snapshot, stores active alerts, and records a current risk score.

## Phase 1 Scope

Included:

- Homepage dashboard
- Weather page using NWS API
- Resources page seeded from Linktree categories
- Routes and traffic page
- Parade schedule page with truthful empty state until official parsing is added
- Admin source status dashboard
- SQLite database schema
- Source checking service
- Weather checking service
- YouTube livestream embed
- Clear unofficial-source disclaimers

Not included yet:

- Advanced ArcGIS StoryMap parsing
- Automated Linktree extraction
- Email alerts
- SMS alerts
- Map layers
- Full parade route visualization
- Searchable archive of past videos and updates

## Future Hooks

- Add ArcGIS schedule and route extraction in `src/services/source-checker.ts` or a dedicated `src/services/arcgis.ts` service after Phase 1.
- Add email alert sending after human review where the source checker currently creates `changes` records.
- Add SMS alert queueing only after high-severity alerts have official confirmation and review.
- Add automated Linktree extraction in a dedicated resource service; keep storing only title, URL, description, category, source, and source URL.

## Source Monitoring Notes

- Default source interval is seeded at 6 hours.
- Active Mardi Gras season can be lowered to 30-60 minutes.
- Parade days can be lowered to 15-30 minutes only if it remains safe and reasonable.
- Do not overload official websites.
- Every detected change stores the source URL and timestamp.
- Public pages should not treat weather risk as cancellation unless an official source says so.

