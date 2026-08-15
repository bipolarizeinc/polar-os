import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tell Us About Your Thing",
  description:
    "Start the BI POLARIZE P.O.L.A.R. intake. Tell us what you are building, fixing, launching, or trying to make functional, and we will route it to the right BPEI division.",
  alternates: { canonical: "/intake" },
  openGraph: {
    title: "Tell Us About Your Thing | BI POLARIZE",
    description: "Start with the thing. P.O.L.A.R. will help route the need into the right BPEI operating lane.",
    url: "/intake",
  },
};

export default function IntakeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
