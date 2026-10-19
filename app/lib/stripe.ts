import "server-only";
import Stripe from "stripe";

export function etsaCheckoutConfigured() {
  return ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_ETSA_REASSESSMENT_PRICE_ID", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]
    .every(name => Boolean(process.env[name]?.trim()));
}

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) throw new Error("Stripe is not configured.");
  return new Stripe(secretKey, { apiVersion: "2026-08-26.dahlia" });
}
