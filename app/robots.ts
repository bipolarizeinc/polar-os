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
          "/etsa/dashboard/",
          "/etsa/report/",
        ],
      },
    ],
    sitemap: "https://polarpaw.online/sitemap.xml",
    host: "https://polarpaw.online",
  };
}
