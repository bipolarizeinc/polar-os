import type { MetadataRoute } from "next";

const siteUrl = "https://www.polarpaw.online";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/founder/",
          "/command-center/",
          "/api/",
          "/etsa/login/",
          "/etsa/notice/",
          "/etsa/assessment/",
          "/etsa/results/",
          "/etsa/unlock/",
          "/etsa/dashboard/",
          "/etsa/report/",
          "/etsa/review/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
