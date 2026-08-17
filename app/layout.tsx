import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AmbientAudio } from "./components/AmbientAudio";
import { PolarExperience } from "./components/PolarExperience";
import "./globals.css";
import "./brand-enhancements.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://PolarPaw.Online"),
  title: {
    default: "BI POLARIZE ENTERPRISES, INC. | All the Business for Your Business",
    template: "%s | BI POLARIZE",
  },
  description:
    "BI POLARIZE ENTERPRISES, INC. turns unconventional ideas into functioning enterprises through business architecture, AI systems, documentation, branding, automation, media, and the Bipolarized Blueprint™.",
  applicationName: "POLAR OS",
  authors: [{ name: "BI POLARIZE ENTERPRISES, INC." }],
  creator: "BI POLARIZE ENTERPRISES, INC.",
  publisher: "BI POLARIZE ENTERPRISES, INC.",
  category: "business services",
  keywords: [
    "business infrastructure",
    "innovation infrastructure",
    "business architecture",
    "AI business systems",
    "Bipolarized Blueprint",
    "P.O.L.A.R.",
    "business automation",
    "Ogden Utah business services",
  ],
  openGraph: {
    title: "BI POLARIZE ENTERPRISES, INC. | All the Business for Your Business",
    description:
      "Bring us the thing in your head. P.O.L.A.R. helps extract it, pressure-test it, architect what it needs, and turn it into operating reality.",
    url: "https://PolarPaw.Online",
    siteName: "BI POLARIZE ENTERPRISES, INC.",
    locale: "en_US",
    type: "website",
    images: [{
      url: "/brand/launch-888/polar-corridor.png",
      alt: "P.O.L.A.R. inside the BI POLARIZE enterprise environment",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BI POLARIZE ENTERPRISES, INC.",
    description: "All the Business for Your Business. Tell Us About Your Thing.",
    images: ["/brand/launch-888/polar-corridor.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BI POLARIZE ENTERPRISES, INC.",
  url: "https://polarpaw.online",
  logo: "https://polarpaw.online/brand/official/01_primary_corporate_logo.png",
  email: "YourThing@PolarPaw.Online",
  telephone: "+1-801-686-8143",
  slogan: "All the Business for Your Business",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ogden",
    addressRegion: "UT",
    addressCountry: "US",
  },
  sameAs: ["https://www.instagram.com/bipolarizeinc/"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BI POLARIZE ENTERPRISES, INC.",
  url: "https://polarpaw.online",
  description: "Innovation infrastructure, business architecture, AI systems, documentation, branding, automation, media, and the Bipolarized Blueprint™.",
  potentialAction: {
    "@type": "CommunicateAction",
    target: "https://polarpaw.online/intake",
    name: "Tell Us About Your Thing",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <PolarExperience />
        {children}
        <AmbientAudio />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
