import type { MetadataRoute } from "next";

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
    sitemap: "https://polarpaw.online/sitemap.xml",
    host: "https://polarpaw.online",
  };
}
