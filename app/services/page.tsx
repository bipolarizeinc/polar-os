import { PageShell } from "../components/SiteChrome";
import { IntakeLink } from "../components/IntakeLink";
import { pricingGroups, pricingPolicy } from "../data/pricing";

export default function ServicesPage() {
  return (
    <PageShell>
      <section className="page-hero services-hero">
        <div className="section-index">CAPABILITIES // APPROVED SERVICE CATALOG</div>
        <p className="eyebrow">ALL THE BUSINESS FOR YOUR BUSINESS</p>
        <h1>
          STRUCTURE.<br />SYSTEMS. <em>MOMENTUM.</em>
        </h1>
        <p>
          Clear entry services, flagship systems, and enterprise engagements for
          founders who need working infrastructure instead of recycled templates
          and fog-machine strategy.
        </p>
      </section>

      <section className="section-shell catalog">
        {pricingGroups.map((group, groupIndex) => (
          <section key={group.id} id={group.id} className="pricing-group">
            <div className="catalog-intro">
              <div>
                <p className="eyebrow">
                  {String(groupIndex + 1).padStart(2, "0")} // PRICING LEVEL
                </p>
                <h2>{group.title}</h2>
              </div>
              <p>{group.description}</p>
            </div>

            <div className="service-grid">
              {group.entries.map((entry, entryIndex) => (
                <article key={entry.id}>
                  <div className="service-number">
                    {String(entryIndex + 1).padStart(2, "0")}
                  </div>
                  <h3>{entry.name}</h3>
                  {entry.note && <p>{entry.note}</p>}
                  <div className="service-price">
                    <span>
                      {entry.cadence === "custom" ? "CUSTOM SCOPE" : "PUBLIC PRICE"}
                    </span>
                    <b>{entry.displayPrice}</b>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="blueprint-offer">
          <div>
            <p className="eyebrow">PRICING POLICY // {pricingPolicy.currency}</p>
            <h2>BUILD THE RIGHT LEVEL OF INFRASTRUCTURE.</h2>
            <p>
              Public pricing is effective {pricingPolicy.effectiveDate}. State and
              government filing fees are billed separately. Custom scopes require
              a written quote, and promotional discounts may not be combined.
            </p>
          </div>
          <IntakeLink />
        </div>
      </section>
    </PageShell>
  );
}
