import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/SiteChrome";
import { serviceOffers } from "../lib/service-catalog";
import { flagships } from "../brand-data";

export const metadata: Metadata = { title: "Flagship & Individual Services", alternates: { canonical: "/shop" } };

export default function ShopPage() {
  return <PageShell>
    <section className="page-hero services-hero">
      <p className="eyebrow">CHOOSE YOUR NEXT MOVE</p>
      <h1>ONE SERVICE.<br />OR THE <em>BLUEPRINT.</em></h1>
      <p>Choose a focused service or start with our flagship architecture engagement. Review the scope, service fee, and next steps before checkout.</p>
      <div className="commerce-actions"><Link className="primary-action" href="#flagship">FLAGSHIP ENGAGEMENT</Link><Link className="text-action" href="#individual">INDIVIDUAL SERVICES →</Link></div>
    </section>
    <section className="section-shell catalog">
      <div id="flagship" className="catalog-intro"><div><p className="eyebrow">THE CONNECTED BUILD PATH</p><h2>START WITH<br />THE BLUEPRINT.</h2></div><p>The $499 Blueprint includes the Idea Extraction Session as its first step. There’s no separate Extraction purchase. Buildout, funding readiness, and deployment are separately scoped to the actual work your enterprise needs.</p></div>
      <div className="service-grid">{serviceOffers.filter(o => o.kind === "flagship").map(offer => <article key={offer.slug}><h3>{offer.name}</h3><p>{offer.description}</p><div className="service-price"><span>SERVICE FEE</span><b>{offer.priceLabel}</b></div><Link className="text-action" href={`/checkout/${offer.slug}`}>REVIEW FLAGSHIP & CHECKOUT →</Link></article>)}</div>
      <div className="commerce-actions"><Link className="text-action" href="/sample-blueprint">SEE A SAMPLE BLUEPRINT →</Link><Link className="text-action" href="/etsa">DISCOVER ETSA™ →</Link>{flagships.filter(f => f.slug !== "blueprint").map(f => <Link className="text-action" key={f.slug} href={`/flagships/${f.slug}`}>{f.shortName}: VIEW SCOPE →</Link>)}</div>
      <div id="individual" className="catalog-intro"><div><p className="eyebrow">A FOCUSED PIECE OF THE SYSTEM</p><h2>GET THE SERVICE<br />YOU NEED.</h2></div><p>Published fees cover the listed base service. Published service prices include applicable tax; checkout shows the breakdown. Government fees, third-party charges, and expanded work are separate and require agreement.</p></div>
      <div className="service-grid">{serviceOffers.filter(o => o.kind === "service").map(offer => <article key={offer.slug}><h3>{offer.name}</h3><p>{offer.description}</p><div className="service-price"><span>SERVICE PRICE</span><b>{offer.priceLabel}</b></div><Link className="text-action" href={`/checkout/${offer.slug}`}>{offer.reviewRequired ? "CHECK ELIGIBILITY" : "REVIEW SERVICE & CHECKOUT"} →</Link></article>)}</div>
      <div className="blueprint-offer"><div><h2>NEED A CUSTOM BUILD?</h2><p>Request the scope and proposal for automation, video, analytics, security, or a combination of services.</p></div><Link className="primary-action" href="/intake/start?source=shop">TELL US ABOUT YOUR THING™ ↗</Link></div>
    </section>
  </PageShell>;
}
