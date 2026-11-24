/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert/strict");
const loader = require("./support/load-ts.cjs");

test("owner-supplied protected Stripe alias is used without exposing a key", () => {
  const before = { canonical: process.env.STRIPE_SECRET_KEY, alias: process.env.payment, verifiedAlias: process.env.sqsq };
  delete process.env.STRIPE_SECRET_KEY;
  process.env.payment = "sk_live_fake_for_unit_test";
  delete process.env.sqsq;
  let received;
  const stripe = loader({ stripe: { default: class { constructor(value) { received = value; } } } })("app/lib/stripe.ts");
  try {
    assert.equal(stripe.hasStripeCredentials(), true);
    stripe.getStripe();
    assert.equal(received, process.env.payment);
    process.env.sqsq = "sk_live_verified_alias_unit_test";
    stripe.getStripe();
    assert.equal(received, process.env.sqsq);
    process.env.STRIPE_SECRET_KEY = "rk_live_canonical_unit_test";
    stripe.getStripe();
    assert.equal(received, process.env.STRIPE_SECRET_KEY);
  } finally {
    for (const [name, value] of [["STRIPE_SECRET_KEY", before.canonical], ["payment", before.alias], ["sqsq", before.verifiedAlias]]) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  }
});
test("modern Supabase server key uses apikey without pretending to be a JWT", async () => {
  let headers;
  const memory = loader({ fetch: async (_url, init) => {
    headers = init.headers; return { ok: true, status: 204 };
  } })("app/lib/polar-memory.ts");
  await memory.supabaseRequest({ url: "https://example.supabase.co", serviceRoleKey: "sb_secret_unit_test" }, "commerce_orders");
  assert.equal(headers.apikey, "sb_secret_unit_test");
  assert.equal(headers.Authorization, undefined);
});
test("legacy Supabase server JWT continues using Bearer authorization", async () => {
  let headers;
  const memory = loader({ fetch: async (_url, init) => {
    headers = init.headers; return { ok: true, status: 204 };
  } })("app/lib/polar-memory.ts");
  await memory.supabaseRequest({ url: "https://example.supabase.co", serviceRoleKey: "legacy.jwt.unit-test" }, "commerce_orders");
  assert.equal(headers.Authorization, "Bearer legacy.jwt.unit-test");
});
