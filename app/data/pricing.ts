export type PriceEntry = {
  id: string;
  name: string;
  displayPrice: string;
  amount?: number;
  cadence?: "one-time" | "annual" | "monthly" | "custom";
  note?: string;
};

export type PricingGroup = {
  id: string;
  title: string;
  description: string;
  entries: PriceEntry[];
};

export const pricingGroups: PricingGroup[] = [
  {
    id: "essential-business-services",
    title: "Essential Business Services",
    description: "Entry-level formation, compliance, guidance, and operational setup services.",
    entries: [
      { id: "business-structure-formation", name: "Business Structure & Formation", displayPrice: "$199", amount: 199, cadence: "one-time" },
      { id: "state-registration-compliance", name: "State Registration & Compliance", displayPrice: "$149 + state fees", amount: 149, cadence: "one-time", note: "Government filing fees are separate." },
      { id: "ein-assistance", name: "EIN Assistance", displayPrice: "$75", amount: 75, cadence: "one-time" },
      { id: "duns-assistance", name: "D-U-N-S Assistance", displayPrice: "$29", amount: 29, cadence: "one-time" },
      { id: "banking-guidance", name: "Banking Solution Guidance", displayPrice: "$99", amount: 99, cadence: "one-time" },
      { id: "marketing-strategy-session", name: "Promotion & Marketing Strategy Session", displayPrice: "$149", amount: 149, cadence: "one-time" },
      { id: "business-coaching", name: "Business Coaching Session", displayPrice: "$200", amount: 200, cadence: "one-time" },
      { id: "registered-agent", name: "Registered Agent Service", displayPrice: "$125/year", amount: 125, cadence: "annual" },
      { id: "annual-compliance", name: "Annual Compliance Package", displayPrice: "$149", amount: 149, cadence: "annual" },
    ],
  },
  {
    id: "build-your-business",
    title: "Build Your Business",
    description: "Standalone development services that can also be combined into custom bundles.",
    entries: [
      { id: "operating-agreement-bylaws", name: "Operating Agreement / Corporate Bylaws", displayPrice: "$129", amount: 129, cadence: "one-time" },
      { id: "website-five-page", name: "Five-Page Website Design & Development", displayPrice: "$650", amount: 650, cadence: "one-time" },
      { id: "logo-branding-kit", name: "Logo & Branding Kit", displayPrice: "$199", amount: 199, cadence: "one-time" },
      { id: "business-presence", name: "Establishing Business Presence", displayPrice: "$249", amount: 249, cadence: "one-time" },
      { id: "business-credit", name: "Business Credit Development", displayPrice: "$399", amount: 399, cadence: "one-time" },
      { id: "business-plan", name: "Comprehensive Business Plan", displayPrice: "$499", amount: 499, cadence: "one-time" },
    ],
  },
  {
    id: "bipolarized-blueprint",
    title: "The Bipolarized Blueprint™",
    description: "Founder-intelligence extraction, business architecture, and implementation planning.",
    entries: [
      { id: "blueprint-diagnostic", name: "Blueprint Diagnostic", displayPrice: "$495", amount: 495, cadence: "one-time" },
      { id: "blueprint-core", name: "Core Bipolarized Blueprint", displayPrice: "$1,500", amount: 1500, cadence: "one-time" },
      { id: "blueprint-roadmap", name: "Blueprint + Implementation Roadmap", displayPrice: "$3,500", amount: 3500, cadence: "one-time" },
      { id: "blueprint-enterprise-build", name: "Full Enterprise Architecture Build", displayPrice: "$6,500+", amount: 6500, cadence: "custom" },
    ],
  },
  {
    id: "lender-readiness",
    title: "BPEI Lender Readiness System™",
    description: "Capital-readiness engineering for funding, documentation, positioning, and institutional review.",
    entries: [
      { id: "lender-diagnostic", name: "Diagnostic", displayPrice: "$495", amount: 495, cadence: "one-time" },
      { id: "lender-foundation", name: "Foundation", displayPrice: "$1,500", amount: 1500, cadence: "one-time" },
      { id: "lender-executive-binder", name: "Executive Binder", displayPrice: "$3,500", amount: 3500, cadence: "one-time" },
      { id: "lender-capital-real-estate", name: "Capital / Real Estate", displayPrice: "$6,500", amount: 6500, cadence: "one-time" },
      { id: "lender-institutional", name: "Institutional", displayPrice: "$10,000+", amount: 10000, cadence: "custom" },
      { id: "lender-add-ons", name: "Add-ons", displayPrice: "$250–$2,500+", cadence: "custom" },
      { id: "lender-management", name: "Ongoing Management", displayPrice: "$500–$1,500/month", cadence: "monthly" },
    ],
  },
  {
    id: "enterprise-engagements",
    title: "Enterprise Engagements",
    description: "Institutional architecture, automation, multi-division implementation, and ongoing systems management.",
    entries: [
      { id: "enterprise-starting", name: "Enterprise Engagement", displayPrice: "Starting at $10,000", amount: 10000, cadence: "custom" },
    ],
  },
];

export const pricingPolicy = {
  currency: "USD",
  effectiveDate: "2026-08-06",
  publicPricingStatus: "approved",
  stateFeesSeparate: true,
  customScopesRequireQuote: true,
  promotionalDiscountsMayNotBeCombined: true,
};
