import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "../../components/SiteChrome";
import { ServiceCheckoutForm } from "../../components/ServiceCheckoutForm";
import { commerceCheckoutConfigured } from "../../lib/commerce";
import { getServiceOffer, offerIntakeUrl } from "../../lib/service-catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Review Your Service", robots: { index: false, follow: true } };

export default async function CheckoutPage({ params, searchParams }: {
  params: Promise<{ slug: string }>; searchParams: Promise<{ checkout?: string }>;
}) {
  const offer = getServiceOffer((await params).slug);
  if (!offer) notFound();
  const status = (await searchParams).checkout;
  const ready = !offer.reviewRequired && commerceCheckoutConfigured();
  return <PageShell><section className="commerce-review">
    <Link className="text-action" href="/shop">← ALL SERVICES</Link>
    <p className="eyebrow">{offer.kind === "flagship" ? "FLAGSHIP ENGAGEMENT" : "INDIVIDUAL SERVICE"}</p>
    <h1>{offer.name}</h1>
    {offer.kind === "flagship" && <p><Link href="/etsa">Explore ETSA™</Link> to map the strengths you can bring to the Blueprint. ETSA is optional and not part of this purchase.</p>}
    <p>{offer.description}</p>
    <div className="commerce-summary"><span>{offer.reviewRequired ? "PUBLISHED ANNUAL FEE" : "SERVICE PRICE"}</span><strong>{offer.priceLabel}</strong><p>USD. This service price includes applicable tax; checkout shows the tax breakdown without adding it to the listed service price. Government filing fees and third-party charges are separate. Additional scope requires a separate agreement.</p></div>
    <h2>What happens next</h2>
    {ready ? <ol className="commerce-steps"><li>Review the listed service and terms.</li><li>Continue to Stripe to pay securely. No account is required.</li><li>Complete your service brief using the same email used at checkout. BPEI confirms the delivery scope, dependencies, and schedule before work begins.</li></ol> : <ol className="commerce-steps"><li>Review the listed service and request {offer.reviewRequired ? "an eligibility review" : "the service"} below.</li><li>BPEI confirms scope, availability, and any next steps before payment.</li></ol>}
    {status === "cancelled" && <p role="status" className="commerce-notice">You left checkout. You can review this service and try again.</p>}
    {(status === "error" || status === "unavailable") && <p role="alert" className="commerce-notice">Checkout is unavailable right now. Please request this service below; do not submit another payment.</p>}
    {ready ? <ServiceCheckoutForm slug={offer.slug} /> : <p className="commerce-notice">{offer.reviewRequired ? "Eligibility, address, and service capacity must be confirmed before payment. The published fee is annual; no automatic renewal is started here." : "Online purchasing for this service is being prepared. You can request the service now and receive payment instructions after availability is confirmed."}</p>}
    <div className="commerce-actions"><Link className="primary-action" href={offerIntakeUrl(offer, "quick")}>{ready ? "ASK ABOUT THIS SERVICE" : offer.reviewRequired ? "REQUEST ELIGIBILITY REVIEW" : "REQUEST THIS SERVICE"} ↗</Link><Link className="text-action" href="/contact">ASK A QUESTION →</Link></div>
  </section></PageShell>;
}
