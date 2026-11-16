import { NextResponse } from "next/server";
import { commerceCheckoutConfigured, commerceCheckoutParams } from "@/app/lib/commerce";
import { getServiceOffer } from "@/app/lib/service-catalog";
import { getStripe } from "@/app/lib/stripe";
import { getSupabaseConfig, supabaseRequest } from "@/app/lib/polar-memory";

const siteOrigin = "https://www.polarpaw.online";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  let offer;
  try {
    const form = await request.formData();
    offer = getServiceOffer(String(form.get("offer") ?? ""));
    if (!offer) return NextResponse.json({ error: "Unknown service." }, { status: 400 });
    if (form.get("terms") !== "accepted") return NextResponse.json({ error: "Please accept the service terms." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }
  const returnUrl = `${siteOrigin}/checkout/${offer.slug}`;
  if (offer.reviewRequired || !commerceCheckoutConfigured()) {
    return NextResponse.redirect(`${returnUrl}?checkout=unavailable`, 303);
  }
  try {
    const stripe = getStripe();
    const [settings, registrations] = await Promise.all([
      stripe.tax.settings.retrieve(), stripe.tax.registrations.list({ status: "active", limit: 1 }),
      supabaseRequest(getSupabaseConfig()!, "commerce_orders?select=checkout_session_id&limit=0"),
    ]);
    if (settings.status !== "active" || !registrations.data.length) {
      return NextResponse.redirect(`${returnUrl}?checkout=unavailable`, 303);
    }
    const session = await stripe.checkout.sessions.create(commerceCheckoutParams(offer));
    if (!session.url || new URL(session.url).hostname !== "checkout.stripe.com") throw new Error("Invalid checkout destination.");
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Service checkout failed", error instanceof Error ? error.message : "unknown failure");
    return NextResponse.redirect(`${returnUrl}?checkout=error`, 303);
  }
}
