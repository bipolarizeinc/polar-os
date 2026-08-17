import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Douglas Arnold Long Jr. | Founder of BI POLARIZE",
  description:
    "Meet Douglas Arnold Long Jr., Founder and Director of Operations of BI POLARIZE ENTERPRISES, INC. and architect of the Bipolarization Method in Ogden, Utah.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Douglas Arnold Long Jr. | Founder of BI POLARIZE",
    description:
      "Founder profile, company mission, credentials, and the architecture behind BI POLARIZE ENTERPRISES, INC.",
    url: "/about",
  },
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
