/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const test = require("node:test");
const loadTs = require("./support/load-ts.cjs");

const quick = { intakeMode: "quick", thing: "Mobile repair service", blocker: "Calls are missed on jobs", email: "qa@example.test" };
const expanded = { thing: quick.thing, blocker: quick.blocker, audience: "Drivers", problem: "Missed customer calls", desiredOutcome: "A dependable booking flow" };

async function submit(payload, config = { mock: true }) {
  let stored;
  const POST = loadTs({
    "next/server": { NextResponse: { json: (body, opts) => ({ body, status: opts.status }) } },
    "next/headers": { cookies: async () => ({ get: () => undefined }) },
    "../../lib/etsa/auth": {},
    "../../lib/polar-memory": {
      createRecoveryToken: () => ({ token: "test-token", hash: "test-hash" }),
      getSupabaseConfig: () => config,
      normalizeEmail: email => email?.toLowerCase() ?? null,
      supabaseRequest: async (_config, table, options) => { assert.equal(table, "polar_intake_sessions"); stored = JSON.parse(options.body); },
    },
  })("app/api/intake/route.ts").POST;
  const response = await POST({ json: async () => payload });
  return { ...response, stored };
}

test("short intake only requires idea, blocker and valid contact email, without inventing details", async () => {
  const { status, stored, body } = await submit({ ...quick, requestedService: "Blueprint", referralSource: "extraction-page" });
  assert.equal(status, 201);
  assert.equal(body.intakeMode, "quick");
  assert.equal(body.persisted, true);
  assert.equal(stored.email, "qa@example.test");
  assert.equal(stored.audience, "");
  assert.equal(stored.problem, "");
  assert.equal(stored.desired_outcome, "");
  assert.equal(stored.memory_state.intakeMode, "quick");
  assert.equal(stored.memory_state.routingContext.service, "Blueprint");
  assert.equal(stored.memory_state.routingContext.source, "extraction-page");
});

test("short intake accepts optional detail, validates contact and rejects blank answers", async () => {
  const detailed = await submit({ ...quick, audience: "Drivers", desiredOutcome: "Schedule reliably" });
  assert.equal(detailed.stored.audience, "Drivers");
  assert.equal(detailed.stored.desired_outcome, "Schedule reliably");
  for (const [field, value] of [["email", ""], ["email", "not-an-email"], ["thing", "  "], ["blocker", ""]]) {
    const rejected = await submit({ ...quick, [field]: value });
    assert.equal(rejected.status, 400);
    assert.ok(rejected.body.fields.includes(field));
    assert.equal(rejected.stored, undefined);
  }
});

test("existing full-intake clients retain their original validation and optional contact", async () => {
  const legacy = await submit(expanded);
  assert.equal(legacy.status, 201);
  assert.equal(legacy.stored.email, null);
  assert.equal(legacy.stored.audience, expanded.audience);
  assert.equal(legacy.body.intakeMode, "full");
  const incomplete = await submit({ thing: quick.thing, blocker: quick.blocker });
  assert.equal(incomplete.status, 400);
});

test("configuration mode never reports a short intake as saved", async () => {
  const { status, body, stored } = await submit(quick, null);
  assert.equal(status, 202);
  assert.equal(body.persisted, false);
  assert.equal(body.intakeMode, "quick");
  assert.equal(stored, undefined);
});
