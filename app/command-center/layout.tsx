import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "P.O.L.A.R. Command Center",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};

export default function CommandCenterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
