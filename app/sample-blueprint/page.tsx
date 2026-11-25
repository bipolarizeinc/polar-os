import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Sample Bipolarized Blueprint™",
  description: "See a fictional Ogden-area mobile repair business turned into a clear offer, operating model, and implementation roadmap.",
  alternates: { canonical: "/sample-blueprint" },
};

export default function SampleBlueprint() {
  return <PageShell>
    <section className="page-hero services-hero">
      <p className="eyebrow">ILLUSTRATIVE SAMPLE // NOT A CLIENT CASE STUDY</p>
      <h1>FROM MISSED CALLS<br />TO <em>BOOKED JOBS.</em></h1>
      <p>See what a Bipolarized Blueprint looks like for a fictional mobile repair business in the Ogden area. This is an excerpt, not a claim of actual client results.</p>
    </section>
    <section className="section-shell catalog" aria-labelledby="sample-extraction">
      <div className="catalog-intro"><div><p className="eyebrow">01 // EXTRACTION</p><h2 id="sample-extraction">THE MESSY START</h2></div><p>The owner takes jobs through calls, texts, and DMs. Details get lost, customers ask whether a mechanic is on the way, and the owner is the only person who knows what was promised.</p></div>
      <div className="catalog-intro"><div><p className="eyebrow">02 // BUSINESS ARCHITECTURE</p><h2>WHAT BPEI CLARIFIES</h2></div><p>The immediate problem isn’t a lack of leads. It’s getting a qualified request from first contact to a confirmed appointment without the owner carrying every detail.</p></div>
      <div className="service-grid">
        <article><h3>Offer and audience</h3><p>On-site diagnostics and eligible basic repairs for drivers in a defined service area. State the diagnostic fee and what can be handled on-site before promising a repair.</p></article>
        <article><h3>Operating model</h3><p>Every request lands in one queue. Capture vehicle, issue, location and contact details. Confirm fit and availability, then send the appointment window and record the job outcome.</p></article>
        <article><h3>Early measures</h3><p>Count qualified requests, confirmed appointments and jobs lost because the owner couldn’t follow up. Use one week of real results before adding automation.</p></article>
      </div>
      <div className="catalog-intro"><div><p className="eyebrow">03 // EXECUTION ROADMAP</p><h2>THE FIRST THREE MOVES</h2></div><p>Sequence the work before buying software or sending more traffic to a process that drops leads.</p></div>
      <ol className="commerce-steps">
        <li>Write the service-area and job-fit rules, plus the message that confirms the diagnostic fee and arrival window.</li>
        <li>Route phone, text, and website inquiries through one form and one shared job queue; pilot the flow manually.</li>
        <li>Review the first week of requests, fix the biggest drop-off, then automate only the repetitive handoff.</li>
      </ol>
      <div className="blueprint-offer"><div><h2>BRING US YOUR THING.</h2><p>The $499 Blueprint starts with an Idea Extraction Session and covers the plan. Building the systems is separately scoped.</p></div><Link className="primary-action" href="/flagships/extraction">START WITH EXTRACTION ↗</Link></div>
    </section>
  </PageShell>;
}
