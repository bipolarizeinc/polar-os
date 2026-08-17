import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how BI POLARIZE ENTERPRISES, INC. collects, uses, protects, and retains information submitted through PolarPaw.Online and P.O.L.A.R.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | BI POLARIZE",
    description: "Privacy practices for PolarPaw.Online and public P.O.L.A.R. intake systems.",
    url: "/privacy",
  },
};

export default function PrivacyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
