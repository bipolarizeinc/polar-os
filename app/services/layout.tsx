import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Divisions",
  description:
    "Explore BI POLARIZE ENTERPRISES, INC. services across Sav.VidzGen™, Dr.Docx™, Blueprint™, BrandForge™, LaunchPad™, Nexus™, Pulse™, Vault™, and Cipher™.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Divisions | BI POLARIZE",
    description:
      "Nine specialized divisions connected through one BPEI operating system, from formation and branding to AI, analytics, documentation, media, security, and business architecture.",
    url: "/services",
  },
};

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
