export type ServiceOffer = {
  slug: string; division: string; name: string; priceLabel: string; amount: number;
  description: string; kind: "flagship" | "service"; reviewRequired: boolean;
  taxCode: string; taxCategory: string;
};
export const CATALOG_VERSION = "2026-11-16-inclusive-v2";
export const serviceOffers: readonly ServiceOffer[] = [
  {
    "slug": "bipolarized-blueprint",
    "division": "blueprint",
    "name": "The Bipolarized Blueprint™",
    "priceLabel": "$499",
    "amount": 49900,
    "description": "Founder extraction, business architecture, positioning, operating model, and a sequenced execution roadmap. Buildout, filing fees, deployment, and funding applications are separately scoped.",
    "kind": "flagship",
    "reviewRequired": false,
    "taxCode": "txcd_20060048",
    "taxCategory": "Consulting Services"
  },
  {
    "slug": "business-formation",
    "division": "launchpad",
    "name": "Business Structure & Formation",
    "priceLabel": "$199",
    "amount": 19900,
    "description": "Build the legal and operational foundation around the concept.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_20030000",
    "taxCategory": "General - Services"
  },
  {
    "slug": "state-registration",
    "division": "launchpad",
    "name": "State Registration & Compliance",
    "priceLabel": "$149 + fees",
    "amount": 14900,
    "description": "Registration guidance and compliance setup for a cleaner launch.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_20030000",
    "taxCategory": "General - Services"
  },
  {
    "slug": "ein-assistance",
    "division": "launchpad",
    "name": "EIN Application Assistance",
    "priceLabel": "$75",
    "amount": 7500,
    "description": "Preparation and application support. The IRS issues EINs free; the listed amount is BPEI’s assistance fee.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_20030000",
    "taxCategory": "General - Services"
  },
  {
    "slug": "business-identity",
    "division": "launchpad",
    "name": "Business Identity / D-U-N-S & UEI Guidance",
    "priceLabel": "$29",
    "amount": 2900,
    "description": "Guidance for commercial D-U-N-S profiles and federal UEI/SAM identification. Identifier issuance remains with the applicable third party or government platform.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_20060048",
    "taxCategory": "Consulting Services"
  },
  {
    "slug": "operating-agreement",
    "division": "dr-docx",
    "name": "Operating Agreement / Bylaws",
    "priceLabel": "$129",
    "amount": 12900,
    "description": "Core governance documents aligned to the chosen entity.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_10503000",
    "taxCategory": "Digital documents — permanent download"
  },
  {
    "slug": "marketing-strategy",
    "division": "brandforge",
    "name": "Marketing Strategy Session",
    "priceLabel": "$149",
    "amount": 14900,
    "description": "A focused 60-minute positioning and promotion strategy session.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_20060048",
    "taxCategory": "Consulting Services"
  },
  {
    "slug": "five-page-website",
    "division": "nexus",
    "name": "5-Page Website",
    "priceLabel": "$650",
    "amount": 65000,
    "description": "A professional conversion-ready web presence built around the brand.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_10701200",
    "taxCategory": "Website Design"
  },
  {
    "slug": "logo-brand-kit",
    "division": "brandforge",
    "name": "Logo + Branding Kit",
    "priceLabel": "$199",
    "amount": 19900,
    "description": "Core identity, color, typography, and usable brand assets.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_10505001",
    "taxCategory": "Digital Finished Artwork — permanent download"
  },
  {
    "slug": "business-presence",
    "division": "brandforge",
    "name": "Business Presence",
    "priceLabel": "$249",
    "amount": 24900,
    "description": "Coordinated setup of the essential public-facing business footprint.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_20030000",
    "taxCategory": "General - Services"
  },
  {
    "slug": "business-credit",
    "division": "launchpad",
    "name": "Business Credit Development",
    "priceLabel": "$399",
    "amount": 39900,
    "description": "Structured guidance toward stronger commercial credit readiness.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_20060048",
    "taxCategory": "Consulting Services"
  },
  {
    "slug": "business-plan",
    "division": "blueprint",
    "name": "Comprehensive Business Plan",
    "priceLabel": "$499",
    "amount": 49900,
    "description": "Research-backed plan connecting vision, market, operations, and finance.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_20060048",
    "taxCategory": "Consulting Services"
  },
  {
    "slug": "banking-guidance",
    "division": "launchpad",
    "name": "Banking Solution Guidance",
    "priceLabel": "$99",
    "amount": 9900,
    "description": "Practical support selecting business banking solutions.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_20060048",
    "taxCategory": "Consulting Services"
  },
  {
    "slug": "registered-agent",
    "division": "launchpad",
    "name": "Registered Agent",
    "priceLabel": "$125 / year",
    "amount": 12500,
    "description": "Utah registered-agent coverage, subject to address, eligibility, and service-capacity confirmation before acceptance.",
    "kind": "service",
    "reviewRequired": true,
    "taxCode": "txcd_20030000",
    "taxCategory": "General - Services"
  },
  {
    "slug": "business-coaching",
    "division": "blueprint",
    "name": "Business Coaching",
    "priceLabel": "$200",
    "amount": 20000,
    "description": "A direct 60-minute session for decisions, obstacles, and execution.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_20060048",
    "taxCategory": "Consulting Services"
  },
  {
    "slug": "annual-compliance",
    "division": "launchpad",
    "name": "Annual Compliance Package",
    "priceLabel": "$149",
    "amount": 14900,
    "description": "Ongoing annual filing and compliance organization.",
    "kind": "service",
    "reviewRequired": false,
    "taxCode": "txcd_20030000",
    "taxCategory": "General - Services"
  }
];
export function getServiceOffer(slug: string) {
  return serviceOffers.find(offer => offer.slug === slug);
}
export function offerIntakeUrl(offer: ServiceOffer, mode: "full" | "quick" = "full") {
  const query = new URLSearchParams({ division: offer.division, service: offer.name, source: mode === "quick" ? "service-inquiry" : "service-order" });
  return `${mode === "quick" ? "/intake/start" : "/intake"}?${query}`;
}
