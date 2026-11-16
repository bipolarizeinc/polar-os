import "server-only";
import { randomBytes } from "node:crypto";
import type Stripe from "stripe";
import { CATALOG_VERSION, type ServiceOffer, getServiceOffer, serviceOffers } from "./service-catalog";
import { getSupabaseConfig, supabaseRequest } from "./polar-memory";

export function commerceCheckoutConfigured() {
  return process.env.COMMERCE_CHECKOUT_ENABLED === "true"
    && process.env.COMMERCE_TAX_READY === "true"
    && process.env.COMMERCE_ORDER_STORAGE_READY === "true"
    && serviceOffers.every(offer => offer.reviewRequired || /^txcd_[0-9]+$/.test(offer.taxCode))
    && ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]
      .every(name => Boolean(process.env[name]?.trim()));
}

export function commerceCheckoutParams(offer: ServiceOffer): Stripe.Checkout.SessionCreateParams {
  const taxCode = offer.taxCode;
  if (!taxCode || offer.reviewRequired) throw new Error("Offer requires configuration or review.");
  const metadata = {
    product_key: "bpei_service_order", offer_slug: offer.slug,
    catalog_version: CATALOG_VERSION, base_amount: String(offer.amount),
    tax_behavior: "inclusive", tax_code: taxCode,
  };
  return {
    mode: "payment",
    integration_identifier: `bpei_services_${Array.from(randomBytes(8), byte => String.fromCharCode(97 + byte % 26)).join("")}`,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd", unit_amount: offer.amount, tax_behavior: "inclusive",
        product_data: { name: offer.name, description: offer.description, tax_code: taxCode },
      },
    }],
    automatic_tax: { enabled: true },
    metadata,
    payment_intent_data: { metadata },
    success_url: `https://www.polarpaw.online/checkout/complete?offer=${offer.slug}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://www.polarpaw.online/checkout/${offer.slug}?checkout=cancelled`,
  };
}

export function paidServiceOffer(session: Stripe.Checkout.Session) {
  if (session.metadata?.product_key !== "bpei_service_order" || session.payment_status !== "paid") return null;
  const offer = getServiceOffer(session.metadata.offer_slug);
  const tax = session.total_details?.amount_tax ?? 0;
  const subtotal = session.amount_subtotal;
  const hasExpectedSubtotal = Boolean(offer && (subtotal === offer.amount || subtotal === offer.amount - tax));
  if (!offer || offer.reviewRequired || session.metadata.catalog_version !== CATALOG_VERSION
    || session.metadata.base_amount !== String(offer.amount)
    || session.metadata.tax_behavior !== "inclusive" || session.metadata.tax_code !== offer.taxCode
    || session.currency !== "usd" || !hasExpectedSubtotal
    || !Number.isSafeInteger(tax) || tax < 0 || tax > offer.amount
    || (session.total_details?.amount_discount ?? 0) !== 0
    || (session.total_details?.amount_shipping ?? 0) !== 0
    || session.amount_total !== offer.amount) {
    throw new Error("Service order does not match the server catalog.");
  }
  return offer;
}

export async function fulfillServiceCheckout(session: Stripe.Checkout.Session) {
  const offer = paidServiceOffer(session);
  if (!offer) return;
  const config = getSupabaseConfig();
  if (!config) throw new Error("Service order storage unavailable.");
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  if (!paymentIntentId) throw new Error("Service order is missing its payment record.");
  await supabaseRequest(config, "commerce_orders?on_conflict=checkout_session_id", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({
      checkout_session_id: session.id, payment_intent_id: paymentIntentId,
      offer_slug: offer.slug, offer_name: offer.name, catalog_version: CATALOG_VERSION,
      customer_email: session.customer_details?.email ?? session.customer_email,
      amount_subtotal: session.amount_subtotal, amount_total: session.amount_total,
      amount_tax: session.total_details?.amount_tax ?? 0, currency: session.currency,
    }),
  });
}

export async function recordServicePaymentAdjustment(eventId: string, eventType: string, paymentIntentId: string, eventCreated: number) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Service order storage unavailable.");
  // Separate immutable facts preserve refunds/disputes even when they arrive before checkout completion.
  await supabaseRequest(config, "commerce_payment_adjustments?on_conflict=event_id", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({ event_id: eventId, event_type: eventType, payment_intent_id: paymentIntentId, stripe_created_at: eventCreated }),
  });
}
