# ETSA™ v1 Build Status

Branch: `agent/etsa-v1`

Implemented:
- 70-item approved ETSA question bank
- scoring-engine foundation and nine department Talent Signatures
- participant authentication endpoints
- participant profile retention
- consent capture
- one active assessment session per ETSA version
- resume and autosave APIs
- incomplete-submission protection
- ETSA landing page
- login/create-account screen
- data notice screen
- full 70-question assessment runner
- completion/review status screen
- production Supabase ETSA schema with RLS
- ETSA trigger search-path hardening

Current pilot behavior:
- Questions 66–70 require human scoring under ETSA v1.0 calibration rules.
- Completed assessments therefore enter `REVIEW_REQUIRED` rather than fabricating an automated final result.
- Final candidate and internal report generation remains the next implementation stage.

Production website integration remains intentionally unmerged until preview/CI validation completes.
