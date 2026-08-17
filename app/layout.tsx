import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AmbientAudio } from "./components/AmbientAudio";
import { PolarExperience } from "./components/PolarExperience";
import "./globals.css";
import "./brand-enhancements.css";

const siteUrl = "https://www.polarpaw.online";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Business Architecture, AI Systems & Startup Services | BI POLARIZE",
    template: "%s | BI POLARIZE",
  },
  description:
    "Ogden, Utah business architecture, startup services, AI systems, documentation, branding, automation, media, and the Bipolarized Blueprint™ from BI POLARIZE ENTERPRISES, INC.",
  applicationName: "POLAR OS",
  authors: [
    { name: "BI POLARIZE ENTERPRISES, INC.", url: siteUrl },
    { name: "Douglas Arnold Long Jr.", url: `${siteUrl}/about` },
  ],
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
    "Douglas Arnold Long Jr.",
    "startup services Utah",
  ],
  openGraph: {
    title: "BI POLARIZE ENTERPRISES, INC. | All the Business for Your Business",
    description:
      "Bring us the thing in your head. P.O.L.A.R. helps extract it, pressure-test it, architect what it needs, and turn it into operating reality.",
    url: siteUrl,
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
  "@id": `${siteUrl}/#organization`,
  name: "BI POLARIZE ENTERPRISES, INC.",
  legalName: "BI POLARIZE ENTERPRISES, INC.",
  alternateName: ["BI POLARIZE", "BPEI"],
  foundingDate: "2024-12-27",
  url: siteUrl,
  logo: `${siteUrl}/brand/official/01_primary_corporate_logo.png`,
  email: "YourThing@PolarPaw.Online",
  telephone: "+1-801-686-8143",
  slogan: "All the Business for Your Business",
  founder: { "@id": `${siteUrl}/about#douglas-arnold-long-jr` },
  areaServed: ["Ogden, Utah", "Utah", "United States"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ogden",
    addressRegion: "UT",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.instagram.com/bipolarizeinc/",
    "https://www.facebook.com/61590119837823",
    "https://helloskip.com/b/bi-polarize-enterprises-inc",
    "https://www.bbb.org/us/ut/spanish-fork/profile/business-consultant/bi-polarize-enterprises-inc-1166-90050092",
  ],
};

const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/about#douglas-arnold-long-jr`,
  name: "Douglas Arnold Long Jr.",
  alternateName: ["Douglas Long", "DAL.J"],
  jobTitle: "Founder and Director of Operations",
  description: "Founder of BI POLARIZE ENTERPRISES, INC. and architect of the Bipolarization Method.",
  url: `${siteUrl}/about`,
  image: `${siteUrl}/founder.jpg`,
  worksFor: { "@id": `${siteUrl}/#organization` },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BI POLARIZE ENTERPRISES, INC.",
  url: siteUrl,
  description: "Innovation infrastructure, business architecture, AI systems, documentation, branding, automation, media, and the Bipolarized Blueprint™.",
  potentialAction: {
    "@type": "CommunicateAction",
    target: `${siteUrl}/intake`,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
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
