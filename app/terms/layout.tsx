import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Review the terms governing use of PolarPaw.Online, public P.O.L.A.R. experiences, service inquiries, AI-assisted outputs, and BI POLARIZE intellectual property.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | BI POLARIZE",
    description: "Website terms for PolarPaw.Online and public P.O.L.A.R. experiences.",
    url: "/terms",
  },
};

export default function TermsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
