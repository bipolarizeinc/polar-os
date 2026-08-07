import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AmbientAudio } from "./components/AmbientAudio";
import { PolarExperience } from "./components/PolarExperience";
import { PolarIntroAutoRelease } from "./components/PolarIntroAutoRelease";
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
  alternates: {
    canonical: "/",
  },
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
    images: [
      {
        url: "/brand/official/17_branded_environment.png",
        alt: "BI POLARIZE ENTERPRISES, INC. branded environment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BI POLARIZE ENTERPRISES, INC.",
    description: "All the Business for Your Business. Tell Us About Your Thing.",
    images: ["/brand/official/17_branded_environment.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PolarExperience />
        <PolarIntroAutoRelease />
        {children}
        <AmbientAudio />
        <Analytics />
      </body>
    </html>
  );
}
