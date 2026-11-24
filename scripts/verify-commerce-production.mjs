import Stripe from "stripe";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";

const mode = process.env.COMMERCE_ACTIVATION_VERIFY;
const expectedAccount = "acct_1U9GciB1NPv2er2w";
const expectedDbHost = "ymdcypufespbrmvrfunt.supabase.co";
const site = "https://www.polarpaw.online";
const marker = "[commerce-preflight]";
const report = [];
let step = "configuration";
function requireCheck(ok, label) {
  if (!ok) throw new Error(label);
}
function note(label, result) {
  report.push({ check: label, ...result });
  console.log(marker, JSON.stringify(report.at(-1)));
}
function fail(error) {
  // Never log the SDK's error message, response body, headers, or credential values.
  const code = typeof error?.code === "string" && /^[a-z_]+$/i.test(error.code) ? error.code : undefined;
  const label = error instanceof Error && /^[A-Z0-9_]+$/.test(error.message) ? error.message : "CHECK_FAILED";
  console.error(marker, JSON.stringify({ failed: step, reason: label, code, status: error?.statusCode }));
  process.exitCode = 1;
}

async function main() {
  if (mode !== "read" && mode !== "delivery") return;
  requireCheck(process.env.VERCEL_ENV === "production", "PRODUCTION_ONLY");
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim() || process.env.sqsq?.trim() || process.env.payment?.trim();
  const dbKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  requireCheck(/^([sr]k)_live_/.test(stripeKey ?? ""), "STRIPE_LIVE_SERVER_KEY_REQUIRED");
  requireCheck(Boolean(dbKey && signingSecret), "MISSING_SERVER_CREDENTIAL");
  const dbUrl = new URL(process.env.SUPABASE_URL ?? "");
  requireCheck(dbUrl.protocol === "https:" && dbUrl.hostname === expectedDbHost, "UNEXPECTED_DATABASE");
  requireCheck(dbKey.startsWith("sb_secret_") || dbKey.split(".").length === 3, "SUPABASE_SERVER_KEY_REQUIRED");
  const headers = {
    apikey: dbKey,
    ...(dbKey.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${dbKey}` }),
    "Content-Type": "application/json",
  };
  async function database(path, init = {}) {
    const response = await fetch(`${dbUrl.origin}/rest/v1/${path}`, {
      ...init, headers: { ...headers, ...(init.headers ?? {}) }, signal: AbortSignal.timeout(15000),
    });
    requireCheck(response.ok, `DATABASE_HTTP_${response.status}`);
    const body = await response.text();
    return body ? JSON.parse(body) : null;
  }
  const stripe = new Stripe(stripeKey, { apiVersion: "2026-08-26.dahlia", timeout: 15000, maxNetworkRetries: 0 });
  step = "stripe-account";
  const account = await stripe.accounts.retrieve();
  requireCheck(account.id === expectedAccount && account.charges_enabled && account.payouts_enabled, "STRIPE_ACCOUNT_NOT_READY");
  note(step, { passed: true, account: account.id });
  step = "private-order-storage";
  await database("commerce_orders?select=checkout_session_id&limit=0");
  await database("commerce_payment_adjustments?select=event_id&limit=0");
  note(step, { passed: true, keyType: dbKey.startsWith("sb_secret_") ? "modern-secret" : "legacy-server" });

  const source = await readFile("app/lib/service-catalog.ts", "utf8");
  const catalogVersion = source.match(/CATALOG_VERSION = "([^"]+)"/)?.[1];
  const match = source.match(/serviceOffers: readonly ServiceOffer\[\] = (\[[\s\S]*?\n\]);/);
  requireCheck(Boolean(catalogVersion && match), "CATALOG_PARSE_FAILED");
  const offers = JSON.parse(match[1]);

  if (mode === "read") {
    step = "stripe-tax-registration";
    const [settings, registrations] = await Promise.all([
      stripe.tax.settings.retrieve(), stripe.tax.registrations.list({ status: "active", limit: 100 }),
    ]);
    requireCheck(settings.status === "active", "TAX_SETTINGS_NOT_ACTIVE");
    requireCheck(registrations.data.some(r => r.country === "US" && r.country_options?.us?.state === "UT"), "UTAH_REGISTRATION_MISSING");
    note(step, { passed: true, behavior: settings.defaults.tax_behavior });
    step = "tax-classifications";
    for (const code of new Set(offers.filter(o => !o.reviewRequired).map(o => o.taxCode))) {
      const category = await stripe.taxCodes.retrieve(code);
      requireCheck(category.id === code, "TAX_CLASSIFICATION_MISMATCH");
    }
    note(step, { passed: true });
    step = "tax-preview";
    const price = await stripe.prices.retrieve("price_1UVFXvB1NPv2er2wBpQoQFu5", { expand: ["product"] });
    const blueprint = offers.find(o => o.slug === "bipolarized-blueprint");
    requireCheck(price.unit_amount === blueprint.amount, "BLUEPRINT_PRICE_MISMATCH");
    const preview = await stripe.invoices.createPreview({
      automatic_tax: { enabled: true },
      customer_details: { address: { line1: "574 Monroe Boulevard", city: "Ogden", state: "UT", postal_code: "84404", country: "US" } },
      invoice_items: [{ price_data: { product: typeof price.product === "string" ? price.product : price.product.id,
        currency: "usd", unit_amount: blueprint.amount, tax_behavior: "inclusive" }, quantity: 1 }],
    });
    const reasons = preview.lines.data.flatMap(line => (line.taxes ?? []).map(tax => tax.taxability_reason));
    requireCheck(preview.automatic_tax.status === "complete" && preview.total === blueprint.amount, "TAX_PREVIEW_TOTAL_MISMATCH");
    requireCheck(reasons.length > 0 && !reasons.includes("not_collecting"), "TAXABILITY_UNVERIFIED");
    note(step, { passed: true, total: preview.total, taxabilityReasons: reasons });
    note("read-preflight-complete", { passed: true, noChargeCreated: true });
    return;
  }

  step = "signed-webhook-delivery";
  const offer = offers.find(o => o.slug === "bipolarized-blueprint");
  const nonce = randomBytes(10).toString("hex");
  const checkoutId = `cs_activation_${nonce}`;
  const paymentIntentId = `pi_activation_${nonce}`;
  const session = {
    id: checkoutId, object: "checkout.session", mode: "payment", livemode: true,
    payment_status: "paid", payment_intent: paymentIntentId, currency: "usd",
    amount_subtotal: offer.amount, amount_total: offer.amount,
    total_details: { amount_tax: 0, amount_discount: 0, amount_shipping: 0 },
    customer_details: { email: null },
    metadata: { product_key: "bpei_service_order", offer_slug: offer.slug,
      catalog_version: catalogVersion, base_amount: String(offer.amount), tax_behavior: "inclusive", tax_code: offer.taxCode },
  };
  async function send(type, object, valid = true) {
    const payload = JSON.stringify({ id: `evt_activation_${nonce}_${type.replaceAll(".", "_")}`,
      object: "event", api_version: "2026-08-26.dahlia", livemode: true,
      created: Math.floor(Date.now() / 1000), type, data: { object } });
    const signature = stripe.webhooks.generateTestHeaderString({ payload, secret: valid ? signingSecret : "invalid-test-secret" });
    return fetch(`${site}/api/stripe/webhook`, { method: "POST",
      headers: { "Content-Type": "application/json", "stripe-signature": signature },
      body: payload, signal: AbortSignal.timeout(15000) });
  }
  try {
    requireCheck((await send("checkout.session.completed", session, false)).status === 400, "INVALID_SIGNATURE_ACCEPTED");
    requireCheck((await send("checkout.session.completed", { ...session, payment_status: "unpaid" })).status === 200, "UNPAID_EVENT_REJECTED");
    const query = `commerce_orders?checkout_session_id=eq.${checkoutId}&select=checkout_session_id,amount_total`;
    requireCheck((await database(query)).length === 0, "UNPAID_EVENT_FULFILLED");
    requireCheck((await send("checkout.session.completed", session)).status === 200, "COMPLETED_WEBHOOK_FAILED");
    requireCheck((await send("checkout.session.async_payment_succeeded", session)).status === 200, "ASYNC_WEBHOOK_FAILED");
    const rows = await database(query);
    requireCheck(rows.length === 1 && rows[0].amount_total === offer.amount, "ORDER_RECORD_OR_REPLAY_FAILED");
    note(step, { passed: true, invalidSignatureRejected: true, unpaidNotFulfilled: true, paidAndAsyncPersistedOnce: true, syntheticVerificationOnly: true });
  } finally {
    step = "verification-record-cleanup";
    await database(`commerce_orders?checkout_session_id=eq.${checkoutId}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
    note(step, { passed: true });
  }
  note("delivery-preflight-complete", { passed: true, noChargeCreated: true });
}

await main().catch(fail);
