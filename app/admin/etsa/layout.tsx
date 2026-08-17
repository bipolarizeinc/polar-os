import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FOUNDER_COOKIE, validateFounderSession } from "@/app/lib/polar-founder-auth";

export const metadata: Metadata = {
  title: "ETSA™ Pilot Review",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  alternates: { canonical: null },
};

export default async function EtsaAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies();
  const founder = await validateFounderSession(store.get(FOUNDER_COOKIE)?.value);
  if (!founder) redirect("/founder");
  return children;
}
