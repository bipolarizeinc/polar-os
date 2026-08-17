import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Formation, Branding, AI Automation & Operations Services",
  description:
    "Business formation, business plans, branding, websites, AI automation, SOPs, analytics, cybersecurity, and startup infrastructure services from BI POLARIZE in Ogden, Utah.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Business Formation, Branding & AI Automation | BI POLARIZE",
    description:
      "Nine specialized divisions connected through one BPEI operating system, from formation and branding to AI, analytics, documentation, media, security, and business architecture.",
    url: "/services",
  },
};

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
