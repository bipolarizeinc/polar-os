import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getEtsaUser } from "@/app/lib/etsa/auth";
import { etsaRest } from "@/app/lib/etsa/data";
import { getPaidEtsaEntitlement } from "@/app/lib/etsa/entitlements";
import { getStripe } from "@/app/lib/stripe";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const token = (await cookies()).get("etsa_access")?.value;
  if (!token) return NextResponse.redirect(`${origin}/etsa/login?mode=login&next=/etsa/unlock`, 303);

  try {
    const user = await getEtsaUser(token);
    const sessions = await etsaRest<Array<{ id: string; status: string }>>(
      `etsa_assessment_sessions?user_id=eq.${user.id}&assessment_version=eq.ETSA-1.0&order=started_at.asc&select=id,status`,
      token
    );
    const reassessment = sessions[1];
    if (!reassessment || reassessment.status !== "COMPLETE") {
      return NextResponse.redirect(`${origin}/etsa/results`, 303);
    }
    if (await getPaidEtsaEntitlement(user.id, reassessment.id)) {
      return NextResponse.redirect(`${origin}/etsa/results`, 303);
    }

    const price = process.env.STRIPE_ETSA_REASSESSMENT_PRICE_ID?.trim();
    if (!price) return NextResponse.redirect(`${origin}/etsa/unlock?checkout=unavailable`, 303);
    const checkout = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price, quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email,
      integration_identifier: "polareta",
      metadata: {
        product_key: "etsa_reassessment_unlock",
        user_id: user.id,
        assessment_id: reassessment.id
      },
      success_url: `${origin}/etsa/unlock?checkout=success`,
      cancel_url: `${origin}/etsa/unlock?checkout=cancelled`
    });
    if (!checkout.url) throw new Error("Stripe Checkout did not return a destination.");
    return NextResponse.redirect(checkout.url, 303);
  } catch (error) {
    console.error("ETSA Checkout creation failed", error);
    return NextResponse.redirect(`${origin}/etsa/unlock?checkout=error`, 303);
  }
}
