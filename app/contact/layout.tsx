import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact BI POLARIZE | Ogden, Utah Business Services",
  description:
    "Contact BI POLARIZE ENTERPRISES, INC. for business architecture, startup services, AI systems, branding, documentation, and automation in Ogden, Utah.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | BI POLARIZE",
    description: "Connect with BI POLARIZE or start your intake through P.O.L.A.R.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
