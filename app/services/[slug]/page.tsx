import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IntakeLink } from "../../components/IntakeLink";
import { PageShell } from "../../components/SiteChrome";
import { getServicePage, servicePages } from "../service-pages";

const siteUrl = "https://www.polarpaw.online";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const url = `/services/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${page.metaTitle} | BI POLARIZE`,
      description: page.metaDescription,
      url,
      siteName: "BI POLARIZE ENTERPRISES, INC.",
      locale: "en_US",
      type: "website",
      images: [{
        url: "/brand/launch-888/polar-corridor.png",
        width: 1536,
        height: 1536,
        alt: "P.O.L.A.R. inside the BI POLARIZE enterprise environment",
      }],
    },
  };
}

export default async function ServiceLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const pageUrl = `${siteUrl}/services/${page.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: page.service,
        serviceType: page.title,
        description: page.metaDescription,
        url: pageUrl,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: [
          { "@type": "City", name: "Ogden" },
          { "@type": "State", name: "Utah" },
          { "@type": "Country", name: "United States" },
        ],
        offers: {
          "@type": "Offer",
          url: `${siteUrl}/intake?division=${page.division}&service=${encodeURIComponent(page.service)}&source=seo-service-page`,
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "USD",
            description: page.startingAt === "Scoped" ? "Custom scope and pricing" : `Starting at ${page.startingAt}`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
          { "@type": "ListItem", position: 3, name: page.label, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="page-hero services-hero">
        <nav aria-label="Breadcrumb" className="section-index">
          <Link href="/">HOME</Link> // <Link href="/services">SERVICES</Link> // {page.label.toUpperCase()}
        </nav>
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
        <IntakeLink division={page.division} service={page.service} source="seo-service-hero" />
      </section>

      <section className="section-shell catalog">
        <div className="catalog-intro">
          <div><p className="eyebrow">WHAT THIS BUILDS</p><h2>FROM NEED.<br />TO OPERATING VALUE.</h2></div>
          <p>Every engagement begins with the actual business problem and ends with a defined deliverable, decision path, or working system.</p>
        </div>
        <div className="service-grid">
          {page.outcomes.map((outcome, index) => (
            <article key={outcome.title}>
              <div className="service-number">{String(index + 1).padStart(2, "0")}</div>
              <h3>{outcome.title}</h3>
              <p>{outcome.description}</p>
            </article>
          ))}
        </div>

        <div className="blueprint-offer">
          <div>
            <p className="eyebrow">STARTING INVESTMENT</p>
            <h2>{page.startingAt}</h2>
            <p>Final scope, third-party fees, dependencies, and exclusions are confirmed before work begins.</p>
          </div>
          <IntakeLink division={page.division} service={page.service} source="seo-service-offer" />
        </div>

        <div className="catalog-intro">
          <div><p className="eyebrow">THE BUILD SEQUENCE</p><h2>HOW THE WORK<br />MOVES FORWARD.</h2></div>
          <p>P.O.L.A.R. keeps discovery, decisions, production, and handoffs connected so the result is usable after delivery.</p>
        </div>
        <div className="division-catalog">
          {page.process.map((step, index) => (
            <section className="division-service-block" key={step.title}>
              <div className="section-index">STEP {String(index + 1).padStart(2, "0")}</div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </section>
          ))}
        </div>

        <div className="catalog-intro">
          <div><p className="eyebrow">BEST FIT</p><h2>BUILT FOR FOUNDERS<br />WHO NEED CLARITY.</h2></div>
          <ul>{page.bestFor.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>

        <div className="catalog-intro">
          <div><p className="eyebrow">COMMON QUESTIONS</p><h2>STRAIGHT ANSWERS.<br />NO FOG MACHINE.</h2></div>
          <p>Scope matters. These answers establish the baseline before the intake gets specific.</p>
        </div>
        <div className="service-grid">
          {page.faq.map(({ question, answer }) => (
            <article key={question}><h3>{question}</h3><p>{answer}</p></article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
