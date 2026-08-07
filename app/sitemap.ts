import type { MetadataRoute } from "next";

const baseUrl = "https://PolarPaw.Online";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/about",
    "/contact",
    "/intake",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === "" ? 1 : route === "/intake" ? 0.9 : ["/privacy", "/terms"].includes(route) ? 0.4 : 0.8,
  }));
}
