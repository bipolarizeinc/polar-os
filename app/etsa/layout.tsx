import type { Metadata } from "next";
import { LegalFooter } from "../components/LegalFooter";

export const metadata: Metadata = {
  title: "ETSA™ | Enterprise Talent & Skills Alignment",
  description:
    "ETSA™ turns structured questions and applied challenges into a talent profile with strengths, evidence confidence, role-alignment hypotheses, and next development steps.",
  alternates: { canonical: "/etsa" },
  openGraph: {
    title: "ETSA™ | BI POLARIZE",
    description: "See your strengths, where to apply them, and what to develop next.",
    url: "/etsa",
  },
};

export default function EtsaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}<LegalFooter /></>;
}
