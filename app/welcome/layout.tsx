import type { Metadata } from "next";
import { LegalFooter } from "../components/LegalFooter";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function WelcomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}<LegalFooter /></>;
}
