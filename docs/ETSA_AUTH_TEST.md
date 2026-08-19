# ETSA Auth Smoke Test

1. Open `/etsa` in a private browser.
2. Select Start Assessment.
3. Confirm `CREATE NEW ACCOUNT` is the primary path.
4. Register a fresh email/password and verify redirect to `/etsa/notice`.
5. Complete logout/session expiry as applicable, then return to Sign In.
6. Verify the same credentials sign in successfully.
7. Enter an incorrect password and verify the UI clearly offers account creation without claiming the email itself is invalid.
