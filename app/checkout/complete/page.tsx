import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/SiteChrome";
import { commerceCheckoutConfigured, paidServiceOffer } from "../../lib/commerce";
import { getServiceOffer, offerIntakeUrl } from "../../lib/service-catalog";
import { getStripe } from "../../lib/stripe";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Payment Status", robots: { index: false, follow: false } };

export default async function PaymentComplete({ searchParams }: { searchParams: Promise<{ offer?: string; session_id?: string }> }) {
  const query = await searchParams;
  const offer = getServiceOffer(query.offer ?? "");
  let paid = false;
  if (offer && commerceCheckoutConfigured() && /^cs_(live|test)_[a-zA-Z0-9]+$/.test(query.session_id ?? "")) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(query.session_id!);
      paid = paidServiceOffer(session)?.slug === offer.slug;
    } catch { /* A return URL alone never proves payment. */ }
  }
  return <PageShell><section className="commerce-review">
    <p className="eyebrow">YOUR NEXT STEP</p><h1>{paid ? "Payment confirmed." : "Check your payment status."}</h1>
    <p>{paid ? "Thank you. Your service order is queued for payment reconciliation and BPEI scope review. Complete your brief using the same email you used at checkout." : "We have not confirmed a payment on this page. Check your Stripe receipt or contact BPEI before paying again. A return link does not confirm a successful charge."}</p>
    {offer && <div className="commerce-summary"><h2>{offer.name}</h2><Link className="primary-action" href={offerIntakeUrl(offer)}>COMPLETE YOUR SERVICE BRIEF ↗</Link></div>}
    <div className="commerce-actions"><Link href="/shop" className="text-action">BROWSE SERVICES →</Link><Link href="/contact" className="text-action">CONTACT BPEI →</Link><Link href="/portal" className="text-action">CLIENT LOGIN →</Link></div>
  </section></PageShell>;
}
