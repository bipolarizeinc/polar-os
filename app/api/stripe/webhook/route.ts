import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSupabaseConfig, supabaseRequest } from "@/app/lib/polar-memory";
import { grantEtsaEntitlement, revokeEtsaEntitlement } from "@/app/lib/etsa/entitlements";
import { getStripe } from "@/app/lib/stripe";

async function assessmentBelongsToCustomer(userId: string, assessmentId: string) {
  const config = getSupabaseConfig();
  if (!config) return false;
  const query = new URLSearchParams({
    id: `eq.${assessmentId}`,
    user_id: `eq.${userId}`,
    status: "eq.COMPLETE",
    select: "id",
    limit: "1"
  });
  const rows = await supabaseRequest<Array<{ id: string }>>(config, `etsa_assessment_sessions?${query}`);
  return rows.length === 1;
}

async function fulfillCheckout(session: Stripe.Checkout.Session) {
  if (session.metadata?.product_key !== "etsa_reassessment_unlock") return;
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") return;
  const userId = session.metadata.user_id;
  const assessmentId = session.metadata.assessment_id;
  if (!userId || !assessmentId || !(await assessmentBelongsToCustomer(userId, assessmentId))) {
    throw new Error("Checkout metadata did not match a completed customer reassessment.");
  }
  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id ?? null;
  await grantEtsaEntitlement({
    userId,
    assessmentId,
    checkoutSessionId: session.id,
    paymentIntentId,
    amountTotal: session.amount_total,
    currency: session.currency
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!signature || !secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch (error) {
    console.error("Stripe webhook signature rejected", error instanceof Error ? error.message : "invalid signature");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      await fulfillCheckout(event.data.object);
    } else if (event.type === "charge.refunded" || event.type === "charge.dispute.created") {
      const charge = event.data.object;
      const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      if (paymentIntentId) await revokeEtsaEntitlement(paymentIntentId, event.type === "charge.refunded" ? "refunded" : "disputed");
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
