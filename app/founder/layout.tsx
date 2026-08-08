import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "P.O.L.A.R. Founder Control",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function FounderLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
