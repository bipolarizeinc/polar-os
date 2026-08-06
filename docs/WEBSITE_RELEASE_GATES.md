# Website Release Gates

Status: Draft implementation branch
Branch: `feature/website-experience-enhancements`
Pull request: `#14`

The website must not be merged to production until every hard release gate below is satisfied.

## 1. Approved media assets

Required repository paths:

- `public/brand/audio/YA.wav`
- `public/brand/official/09_corporate_flag.png`
- `public/brand/polar/pounce-landing.png`

Controls:

- Assets must come from the approved BI_POLARIZE_HD_ASSET_LIBRARY_v1.0 source.
- Rejected, legacy, approximate, or third-party substitute media is prohibited.
- Confirm image dimensions, file integrity, and accessible fallback behavior.

## 2. Pricing integrity

Completed:

- Approved pricing centralized in `app/data/pricing.ts`.
- Services page reads from the centralized registry.
- Public pricing categories include Essential Business Services, Build Your Business, The Bipolarized Blueprint™, BPEI Lender Readiness System™, and Enterprise Engagements.

Pre-launch verification:

- Confirm all public prices match the approved registry.
- Confirm government and state filing fees are disclosed as separate.
- Confirm custom scopes require a written quote.
- Confirm promotional discounts cannot be combined unless explicitly authorized.

## 3. Newsletter and reward system

The current browser implementation is a demonstration layer only.

Required before production activation:

- Verified email signup through the selected email platform.
- Server-side one-spin eligibility enforcement.
- Server-side prize inventory and active/inactive controls.
- Unique redemption code generation.
- Timestamp, participant identifier, awarded prize, expiration, redemption status, and audit logging.
- Terms, consent record, privacy notice, eligibility limits, and non-combination rules.
- The visual wheel landing segment must match the awarded prize.
- No visible prize may have zero probability of being awarded.

## 4. Press and attribution

Completed:

- Press page architecture created.
- Approved excerpts from Article 01 added without presenting them as BPEI-authored copy.

Required:

- Exact title, publication attribution, placement details, source URL, and approved excerpts for Article 02.
- Confirm Article 01 publication attribution and source URL before public release.
- Keep full articles as separate press assets.

## 5. ETAS pathway

Completed:

- ETAS opportunity pathway and non-guarantee language added.

Required:

- Connect the ETAS call to action to the approved intake or assessment workflow.
- Publish assessment privacy and consent language.
- Confirm retention, access, and deletion rules for applicant information.

## 6. Accessibility and interaction QA

Required:

- Keyboard-only navigation test.
- Visible focus-state test.
- Screen-reader labeling review.
- Contrast review.
- Reduced-motion test.
- Audio controls must remain optional and user initiated.
- Verify mobile navigation closes after selection.
- Verify page behavior at common phone, tablet, laptop, and wide-screen sizes.
- Captions or transcripts required for spoken video content.

## 7. Technical validation

Required:

- `npm run lint`
- `npm run build`
- Vercel preview deployment succeeds.
- No broken internal links.
- No missing media requests.
- No browser console errors during primary user flows.
- Confirm production environment variables and domains.
- Confirm analytics and consent behavior.

## 8. Final approval

Before merge:

- Founder review of homepage, About, Services, Press, Join, Contact, and intake pathways.
- Confirm only approved corporate and P.O.L.A.R. assets are used.
- Confirm pricing registry effective date and public status.
- Confirm legal and promotional terms are published.
- Mark PR ready for review only after hard release gates are cleared.
