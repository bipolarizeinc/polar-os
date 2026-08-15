import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact BI POLARIZE ENTERPRISES, INC. in Ogden, Utah or start the P.O.L.A.R. intake to tell us about your thing.",
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
