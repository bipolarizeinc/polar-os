# ETSA Customer Authentication Flow

## First-time participant
ETSA landing → Create New Account → name/email/password → server registration → immediate authenticated session → ETSA notice → consent → assessment.

## Returning participant
ETSA landing → Sign In → email/password → authenticated session → ETSA notice or current assessment state.

## Guardrails
- First-time registration is visually primary.
- Login failure explicitly directs first-time visitors to account creation.
- Existing-account registration errors switch the interface to Sign In.
- Public ETSA registration does not depend on transactional email delivery.
