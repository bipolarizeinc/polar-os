import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEtsaUser } from "@/app/lib/etsa/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
};

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const store=await cookies();
  const token=store.get("etsa_access")?.value;
  if(!token) redirect("/etsa/login?mode=login");
  try { await getEtsaUser(token); } catch { redirect("/etsa/login?mode=login"); }
  return children;
}
