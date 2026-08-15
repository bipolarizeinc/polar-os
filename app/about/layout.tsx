import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how BI POLARIZE ENTERPRISES, INC. turns unconventional ideas into functioning enterprises through the Bipolarization Method, P.O.L.A.R., and connected business infrastructure.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | BI POLARIZE",
    description:
      "Innovation infrastructure for unconventional founders, powered by business architecture, operational systems, and P.O.L.A.R.",
    url: "/about",
  },
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
