# BPEI Collaboration Sync Manifest

Status: ACTIVE OPERATING STANDARD
Owner: BI POLARIZE ENTERPRISES, INC.
Primary public domain: polarpaw.online
Primary application repository: bipolarizeinc/polar-os

## Purpose

This manifest defines which platform is authoritative for each class of BPEI data and how the public website/P.O.L.A.R. OS consumes or mirrors that data. The goal is to prevent conflicting copies, stale assets, duplicate integrations, and platform-specific versions of the business.

## Canonical ownership

| Platform | Canonical responsibility | Website relationship |
|---|---|---|
| Google Drive | Approved master documents, approved master media, archival business assets | Website/GitHub receives deployment copies of approved public assets only |
| GitHub `bipolarizeinc/polar-os` | Application source code, deployment-ready public assets, integration registry, infrastructure documentation | Authoritative source for every production deployment |
| Vercel `polar-os` | Build/runtime environment and public deployment | Deploys from GitHub `main`; must not become a separate source of content |
| Supabase `P.O.L.A.R. os` | Application persistence, ETSA records, P.O.L.A.R. memory, protected connection metadata | Runtime database for the website/app; schema changes are versioned in GitHub migrations |
| Make.com | Approved automation bridge/orchestration | Invoked through protected `/api/integrations/make`; never treated as source of record |
| Gmail / Google Calendar | Communication and scheduling | Operational connectors; website may initiate authorized workflows but does not duplicate entire mailbox/calendar datasets |
| Zoho Mail | Corporate mail connector where configured | Protected server-side connector only |
| HyperFrames | Approved video production/render pipeline | Render outputs become approved media only after Drive approval, then deployment copies may be promoted to GitHub |
| Instagram / Facebook / TikTok / LinkedIn | Public distribution channels | Website is canonical destination; social platforms distribute approved public content and point back to canonical site |
| Stripe | Payment processing | Checkout/payment URLs and verified payment state may be consumed by the application; Stripe remains payment source of truth |
| Skip / external AI agents | Remote acquisition/operations channels | May refer traffic/leads to the website; must not own BPEI IP, agent identity, customer records, or canonical business content |
| Trustpilot / review platforms | Public reputation/review channel | Review links may be surfaced on-site; reviews remain platform-hosted and are not treated as editable BPEI content |

## Media synchronization standard

1. Google Drive `IMAGES`, `MP4`, `MP3`, and `WAV` folders are the approved-master media library.
2. `04_ARCHIVE_NOT_APPROVED` is explicitly excluded from production synchronization.
3. Only files approved for public deployment are copied into GitHub `public/`.
4. GitHub deployment filenames are stable, web-safe names; Drive filenames remain the archival/master identifiers.
5. Website code must reference local deployment assets or a deliberately configured CDN/object store, never ad-hoc Drive share links.
6. A production deployment is not considered synchronized until GitHub `main`, Vercel production, and the public domain all resolve the same asset manifest.

## Document synchronization standard

Google Drive remains authoritative for business documents. Public website pages should render curated public facts/copy, not mirror confidential Drive folders. Where a document must be downloadable publicly, a deployment-safe copy is explicitly promoted and registered.

## Data synchronization standard

- Supabase is canonical for ETSA, P.O.L.A.R. application state, protected credentials metadata, and operational records stored by the app.
- GitHub migrations are canonical for database schema history.
- No secret, OAuth token, service-role key, payment credential, or private customer record is committed to GitHub or served from `public/`.

## Deployment synchronization standard

`GitHub main -> Vercel production -> polarpaw.online / www.polarpaw.online`

No production hotfix should exist only in Vercel. Every production change must trace to a Git commit.

## Current approved Drive media roots

- IMAGES: `1TJZ_aEq_dlFrajnM6ACJLJpftBPLo-9b`
- MP4: `16LLWYyp-DgmnPy3kNB2qQ2e2BmLUM-Yg`
- MP3: `1OEs5qx8Kb6-rU1s10ZPllJ7OvyAe7Cmh`
- WAV: `1sz0X-Ff6cmLMQz1slanI6w47KHtTNmbb`
- NOT APPROVED archive: `1VXjCDLtRpRzkXPo0_U5IGY4qoAl41ygA`

## Verified platform identifiers

- Vercel team: `bpei` (`team_oOWH8wGhc4Amft3trhQCqNiL`)
- Vercel project: `polar-os` (`prj_b9NyQEQlDQYahrfawecSlpnKD0DO`)
- Supabase project: `P.O.L.A.R. os` (`ymdcypufespbrmvrfunt`)

## Required sync checks

Before declaring a synchronization complete:

1. Audit Drive approved media against GitHub deployed media.
2. Remove or replace website references to files absent from the approved deployment manifest.
3. Verify mobile navigation closes after route selection.
4. Verify ambient audio source and user-gesture behavior.
5. Verify every video/transmission source returns successfully.
6. Verify public routes and canonical domains on Vercel production.
7. Verify Supabase-backed flows and auth from the canonical domain.
8. Verify payment/review/social/external-agent links resolve to approved destinations.
9. Record the resulting Git commit and Vercel deployment in the sync log.

## Rule

**Drive approves. GitHub defines. Vercel serves. Supabase remembers. External platforms distribute or transact. The website remains the canonical public operating surface.**
