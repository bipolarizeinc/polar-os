# P.O.L.A.R. Provider Enrollment v1

## Scope
Founder-authenticated OAuth enrollment for Google Business Profile, LinkedIn, and TikTok.

## Security contract
- enrollment starts only from an active founder HttpOnly session
- OAuth state is random, single-use, tied to the founder session, and expires after 10 minutes
- provider client secrets remain server-side environment secrets
- refresh/access credentials are encrypted in the connector credential vault and never stored in institutional memory
- read-first scopes are used where practical
- consequential mutation/publishing authority remains separately approval-gated by P.O.L.A.R. policy

## Provider configuration
### Google Business Profile
- `GOOGLE_BUSINESS_CLIENT_ID`
- `GOOGLE_BUSINESS_CLIENT_SECRET`
- `GOOGLE_BUSINESS_REDIRECT_URI`
- initial scope: `https://www.googleapis.com/auth/business.manage`
- Google requires Business Profile API project access/approval before production API use

### LinkedIn
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`
- `LINKEDIN_REDIRECT_URI`
- initial scopes: `openid profile email r_organization_social`
- organization access depends on LinkedIn product approval and the authenticated member's Page role
- publishing scope is intentionally not requested in this enrollment version

### TikTok
- `TIKTOK_CLIENT_KEY`
- `TIKTOK_CLIENT_SECRET`
- `TIKTOK_REDIRECT_URI`
- initial scopes: `user.info.basic,video.list`
- publishing scopes are intentionally not requested in this enrollment version

## Redirect routes
- `/api/founder/connections/google-business/callback`
- `/api/founder/connections/linkedin/callback`
- `/api/founder/connections/tiktok/callback`

## Deferred
Facebook and Instagram enrollment remain deferred until their current Meta permission/app-review requirements are re-verified against official provider documentation. Existing provider policy entries remain code-ready but no founder enrollment button should be exposed until that verification is complete.
