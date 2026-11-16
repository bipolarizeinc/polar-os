/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert/strict");
const loader = require("./support/load-ts.cjs");
const catalog = loader()("app/lib/service-catalog.ts");
const offer = catalog.getServiceOffer("business-plan");
const serviceModule = () => loader()("app/lib/commerce.ts");
function checkoutRequest(values = {}, origin = "https://www.polarpaw.online") {
  return new Request("https://www.polarpaw.online/api/checkout", {
    method: "POST", headers: { origin },
    body: new URLSearchParams({ offer: offer.slug, terms: "accepted", ...values }),
  });
}
function checkoutRoute({ activeTax = true, registrations = [{}], storageFails = false, enabled = true } = {}) {
  let createParams;
  const POST = loader({
    "@/app/lib/commerce": {
      commerceCheckoutConfigured: () => enabled,
      commerceCheckoutParams: selected => ({ authoritativeAmount: selected.amount }),
    },
    "@/app/lib/polar-memory": {
      getSupabaseConfig: () => ({}),
      supabaseRequest: async () => { if (storageFails) throw new Error("storage offline"); return []; },
    },
    "@/app/lib/stripe": { getStripe: () => ({
      tax: {
        settings: { retrieve: async () => ({ status: activeTax ? "active" : "pending" }) },
        registrations: { list: async () => ({ data: registrations }) },
      },
      checkout: { sessions: { create: async params => { createParams = params; return { url: "https://checkout.stripe.com/c/pay/test" }; } } },
    }) },
  })("app/api/checkout/route.ts").POST;
  return { POST, created: () => createParams };
}
function paidSession(overrides = {}) {
  return { id: "cs_live_paid", payment_status: "paid", payment_intent: "pi_paid", amount_subtotal: offer.amount, amount_total: offer.amount, currency: "usd", total_details: { amount_tax: 100, amount_discount: 0, amount_shipping: 0 },
    metadata: { product_key: "bpei_service_order", offer_slug: offer.slug, catalog_version: catalog.CATALOG_VERSION, base_amount: String(offer.amount), tax_behavior: "inclusive", tax_code: offer.taxCode }, ...overrides };
}
test("unknown and prototype names cannot become offers", () => {
  assert.equal(catalog.getServiceOffer("__proto__"), undefined);
  assert.equal(catalog.getServiceOffer("constructor"), undefined);
});
test("checkout activation defaults off", () => {
  const previous = process.env.COMMERCE_CHECKOUT_ENABLED;
  delete process.env.COMMERCE_CHECKOUT_ENABLED;
  try { assert.equal(serviceModule().commerceCheckoutConfigured(), false); }
  finally { if (previous === undefined) delete process.env.COMMERCE_CHECKOUT_ENABLED; else process.env.COMMERCE_CHECKOUT_ENABLED = previous; }
});
test("cross-origin checkout is rejected without creating payment", async () => {
  const route = checkoutRoute();
  assert.equal((await route.POST(checkoutRequest({}, "https://untrusted.example"))).status, 403);
  assert.equal(route.created(), undefined);
});
test("terms acceptance is enforced on the server", async () => {
  const route = checkoutRoute();
  assert.equal((await route.POST(checkoutRequest({ terms: "" }))).status, 400);
  assert.equal(route.created(), undefined);
});
test("disabled checkout cannot charge a customer", async () => {
  const route = checkoutRoute({ enabled: false });
  const response = await route.POST(checkoutRequest());
  assert.match(response.headers.get("location"), /checkout=unavailable/);
  assert.equal(route.created(), undefined);
});
test("registered-agent review cannot be bypassed with a direct POST", async () => {
  const route = checkoutRoute();
  assert.match((await route.POST(checkoutRequest({ offer: "registered-agent" }))).headers.get("location"), /checkout=unavailable/);
  assert.equal(route.created(), undefined);
});
test("tampered client prices do not affect the charged base fee", async () => {
  const route = checkoutRoute();
  const response = await route.POST(checkoutRequest({ amount: "1", currency: "eur", quantity: "20", return_url: "https://untrusted.example" }));
  assert.equal(response.status, 303);
  assert.equal(route.created().authoritativeAmount, 49900);
  assert.equal(new URL(response.headers.get("location")).hostname, "checkout.stripe.com");
});
test("missing tax registration prevents checkout creation", async () => {
  const route = checkoutRoute({ registrations: [] });
  assert.match((await route.POST(checkoutRequest())).headers.get("location"), /checkout=unavailable/);
  assert.equal(route.created(), undefined);
});
test("pending Tax Settings prevent checkout creation", async () => {
  const route = checkoutRoute({ activeTax: false });
  assert.match((await route.POST(checkoutRequest())).headers.get("location"), /checkout=unavailable/);
  assert.equal(route.created(), undefined);
});
test("unavailable order storage prevents checkout creation", async () => {
  const route = checkoutRoute({ storageFails: true });
  assert.match((await route.POST(checkoutRequest())).headers.get("location"), /checkout=error/);
  assert.equal(route.created(), undefined);
});
test("checkout parameters use tax, canonical return URLs, and authoritative quantity", () => {
  const previous = process.env.STRIPE_COMMERCE_TAX_CODE;
  process.env.STRIPE_COMMERCE_TAX_CODE = "confirmed_test_classification";
  try {
    const params = serviceModule().commerceCheckoutParams(offer);
    assert.equal(params.automatic_tax.enabled, true);
    assert.equal(params.line_items[0].quantity, 1);
    assert.equal(params.line_items[0].price_data.unit_amount, 49900);
    assert.equal(params.line_items[0].price_data.tax_behavior, "inclusive");
    assert.equal(params.line_items[0].price_data.product_data.tax_code, offer.taxCode);
    assert.equal(params.payment_method_types, undefined);
    assert.match(params.integration_identifier, /^bpei_services_[a-z]{8}$/);
    assert.equal(new URL(params.success_url).origin, "https://www.polarpaw.online");
  } finally { if (previous === undefined) delete process.env.STRIPE_COMMERCE_TAX_CODE; else process.env.STRIPE_COMMERCE_TAX_CODE = previous; }
});
test("unpaid sessions never fulfill and mismatched paid totals are rejected", () => {
  const commerce = serviceModule();
  assert.equal(commerce.paidServiceOffer(paidSession({ payment_status: "unpaid" })), null);
  assert.throws(() => commerce.paidServiceOffer(paidSession({ amount_subtotal: 1 })), /catalog/);
  assert.throws(() => commerce.paidServiceOffer(paidSession({ currency: "eur" })), /catalog/);
  assert.equal(commerce.paidServiceOffer(paidSession()).slug, offer.slug);
});
test("fulfillment retries use insert-only conflict handling and record the charged total", async () => {
  const writes = [];
  const commerce = loader({
    "./polar-memory": {
      getSupabaseConfig: () => ({}),
      supabaseRequest: async (config, path, init) => writes.push({ path, init }),
    },
  })("app/lib/commerce.ts");
  await commerce.fulfillServiceCheckout(paidSession());
  await commerce.fulfillServiceCheckout(paidSession());
  assert.equal(writes.length, 2);
  for (const write of writes) {
    assert.match(write.path, /on_conflict=checkout_session_id/);
    assert.match(write.init.headers.Prefer, /resolution=ignore-duplicates/);
    assert.equal(JSON.parse(write.init.body).amount_total, offer.amount);
  }
});
test("refund facts are recorded independently of checkout event ordering", async () => {
  let write;
  const commerce = loader({
    "./polar-memory": {
      getSupabaseConfig: () => ({}),
      supabaseRequest: async (config, path, init) => { write = { path, init }; },
    },
  })("app/lib/commerce.ts");
  await commerce.recordServicePaymentAdjustment("evt_refund", "charge.refunded", "pi_paid", 1);
  assert.match(write.path, /commerce_payment_adjustments/);
  assert.match(write.init.headers.Prefer, /resolution=ignore-duplicates/);
  assert.equal(JSON.parse(write.init.body).payment_intent_id, "pi_paid");
});

test("tax-inclusive orders reject added tax or surcharges above the advertised amount", () => {
  const commerce = serviceModule();
  assert.throws(() => commerce.paidServiceOffer(paidSession({ amount_total: offer.amount + 100 })), /catalog/);
  assert.throws(() => commerce.paidServiceOffer(paidSession({ total_details: { amount_tax: 100, amount_discount: 1, amount_shipping: 0 } })), /catalog/);
  assert.equal(commerce.paidServiceOffer(paidSession({ amount_subtotal: offer.amount - 100 })).slug, offer.slug);
});
test("an environment override cannot replace an offer's classification", () => {
  const previous = process.env.STRIPE_COMMERCE_TAX_CODE;
  process.env.STRIPE_COMMERCE_TAX_CODE = "incorrect-global-code";
  try {
    const commerce = serviceModule();
    const site = catalog.getServiceOffer("five-page-website");
    const artwork = catalog.getServiceOffer("logo-brand-kit");
    const documents = catalog.getServiceOffer("operating-agreement");
    assert.equal(commerce.commerceCheckoutParams(site).line_items[0].price_data.product_data.tax_code, "txcd_10701200");
    assert.equal(commerce.commerceCheckoutParams(artwork).line_items[0].price_data.product_data.tax_code, "txcd_10505001");
    assert.equal(commerce.commerceCheckoutParams(documents).line_items[0].price_data.product_data.tax_code, "txcd_10503000");
    assert.throws(() => commerce.paidServiceOffer(paidSession({ metadata: { ...paidSession().metadata, tax_code: artwork.taxCode } })), /catalog/);
  } finally { if (previous === undefined) delete process.env.STRIPE_COMMERCE_TAX_CODE; else process.env.STRIPE_COMMERCE_TAX_CODE = previous; }
});
