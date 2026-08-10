# Community Mardi Gras Events Approval Workflow

The **Community Mardi Gras Events** calendar is for organization-submitted Mardi Gras and Carnival-related events. It is separate from the official parade schedule, official route information, road closures, parking rules, public-safety instructions, and weather-impact decisions.

## Public rule

Only reviewed and approved events should appear publicly on `mg251.xyz/events`.

Submissions from Jotform should not auto-publish directly to the website.

## Submission source

Public intake form:

```text
https://form.jotform.com/262217749749067
```

The form should tell submitters that submissions are reviewed before publication and are not guaranteed to appear on the website.

## Review statuses

Use these statuses when reviewing submissions:

### Pending Review

The event has been submitted through Jotform and has not been reviewed yet.

### Needs Info

The event may qualify, but required details are missing or unclear. Examples:

- Missing date or start time
- Missing venue or address
- Unclear host organization
- Missing ticket, RSVP, or public contact information
- Event relationship to Mardi Gras / Carnival is unclear

### Approved for Website

The event is acceptable for publication but has not yet been added to the website data or deployed.

### Published

The event has been added to the approved public event data and is visible on the website.

### Rejected

The event should not appear on the public calendar. Common reasons:

- Not Mardi Gras / Carnival related
- Incomplete and no response from submitter
- Promotional content unrelated to the calendar purpose
- Questionable, inappropriate, or unverifiable submission
- Submitter does not appear authorized to submit the event

### Archived

The event was previously reviewed or published but is no longer active, relevant, or current.

## Review checklist

Before approving an event, confirm:

- The event is Mardi Gras / Carnival related.
- The host organization is clear.
- The event name is public-facing and understandable.
- The date is complete.
- The start time is complete.
- The end time is provided or the event has a reasonable time note.
- The venue name is included.
- The address or public location is usable.
- A public event link, ticket link, RSVP link, or host contact is provided.
- The description is appropriate for publication.
- Cost/free/ticketed status is clear.
- Age/family-friendly status is clear when applicable.
- Accessibility or parking notes are included when provided.
- The submitter confirmed they are authorized to submit the event.
- The submitter acknowledged the listing is not the official parade schedule.

## Public fields

These fields may appear publicly after approval:

- Event name
- Host organization
- Event type
- Date
- Start time
- End time
- Venue name
- Venue address
- Public description
- Ticket / RSVP / event link
- Cost information
- Age or family-friendly information
- Accessibility notes, if provided
- Parking notes, if provided
- Public host contact, if provided
- Event flyer, if approved
- Organization logo, if approved

## Private fields

Do not publish these fields:

- Private submitter name
- Private submitter email
- Internal review notes
- Review status history
- Any private follow-up correspondence

## Website publishing process, MVP

For the first version:

1. Organization submits an event through Jotform.
2. Submission is reviewed manually.
3. Event is marked Approved for Website, Needs Info, Rejected, or Archived.
4. Approved events are manually added to the curated approved-events data.
5. The website displays only approved/published events.
6. Event detail pages and add-to-calendar links are generated from approved public data.

## Future automation

A later production version may add:

- Jotform webhook ingestion
- Admin review queue
- Persistent event database
- One-click approve/publish workflow
- Automated event archive after event date
- Public calendar subscription feed for all approved events

## Required public disclaimer

Use this or equivalent wording on event pages:

```text
Community-submitted Mardi Gras-related event. Verify details with the host organization before attending. This is not the official parade schedule.
```

Use this or equivalent wording on the calendar page:

```text
Community Mardi Gras Events are submitted by organizations and reviewed before publication. These listings do not replace official parade schedules, routes, traffic, public-safety, parking, or weather guidance.
```
