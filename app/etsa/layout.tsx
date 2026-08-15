import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ETSA™ | Enterprise Talent & Skills Alignment",
  description:
    "ETSA™ identifies where capabilities can create the greatest value across BI POLARIZE ENTERPRISES, INC. and maps development toward stronger role alignment.",
  alternates: { canonical: "/etsa" },
  openGraph: {
    title: "ETSA™ | BI POLARIZE",
    description: "Enterprise Talent & Skills Alignment across nine BPEI divisions.",
    url: "/etsa",
  },
};

export default function EtsaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
