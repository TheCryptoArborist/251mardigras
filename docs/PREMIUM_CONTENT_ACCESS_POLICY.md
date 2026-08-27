# MG251 Premium Content Access Policy — Draft

## MVP objective

Premium media remains in secure conventional storage. The MG251 server grants short-lived access only after checking the user’s authenticated account and current authoritative entitlement.

The blockchain records entitlement status and content-policy references; it does not store unencrypted premium media or private member data.

## Candidate content categories

- Parade replay archives.
- Early-access video.
- Member livestreams.
- Extended interviews.
- Premium route, parking, weather, and access guides.
- Historical material.
- Member newsletters.
- Sponsor offers.
- Downloadable guides.
- Authorized advance event information.

Every item must have a rights record, owner/licensor, allowed audience, release date, withdrawal rule, retention rule, and responsible editor.

## Content status model

```text
Draft
Scheduled
Public
Entry Member
VIP Member
Partner Only
Archived
Withdrawn
```

A content item may require one or more entitlement rules rather than relying solely on the label displayed in the interface.

## Access evaluation

Before returning a signed URL, stream token, or protected response, the server checks:

1. authenticated MG251 session;
2. current account status;
3. linked entitlement/credential;
4. authoritative Sui record status;
5. tier or permission requirement;
6. current time against pass and content windows;
7. suspension/revocation overrides;
8. content status and rights availability;
9. per-user or per-content rate limits;
10. audit requirements.

Client-side hiding is not access control. Protected files must not be exposed through predictable public URLs.

## Access token behavior

- Short expiration.
- Bound to the intended file/action where practical.
- Generated server-side after authorization.
- Not stored in public page source.
- Revocation/cache invalidation strategy documented.
- Download/stream behavior aligned with content license.

## User expectations

Terms must explain that access control limits initial access but cannot guarantee that an authorized viewer will not capture, record, copy, or redistribute content. Technical controls do not replace copyright, license, and community terms.

## Withdrawal and revocation

MG251 may withdraw content for rights, safety, correction, legal, or operational reasons under the applicable terms. A user who previously accessed content may retain a copy or recording outside MG251’s control. The platform must avoid promises of complete post-access revocation.

## Sponsor offers and partner content

Sponsor offers require clear eligibility, expiration, sponsor identity, restrictions, and redemption process. A Season Pass does not make MG251 responsible for a partner’s separate product unless the agreement states otherwise.

## Later Walrus and Seal phase

A later phase may encrypt content client-side or before upload, store encrypted blobs on Walrus, and use Seal with a Move-based access policy. This is not required for the MVP. Any production design must account for public storage references/metadata, key-server trust, session expiry, policy versioning, authorized-user copying, rate limits, and backup/recovery.

## Logging and privacy

Record the minimum access metadata needed for security, support, licensing, and analytics. Do not create indefinite detailed viewing histories by default. Retention, analytics, and sponsor reporting must be disclosed and separated from private member identity where practical.

## Prototype boundary

The prototype uses fictional content cards and locked-state illustrations. It does not upload, encrypt, stream, or protect actual media.
