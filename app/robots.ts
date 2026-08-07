import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/command-center", "/api/"],
      },
    ],
    sitemap: "https://PolarPaw.Online/sitemap.xml",
    host: "https://PolarPaw.Online",
  };
}
