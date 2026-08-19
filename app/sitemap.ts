import type { MetadataRoute } from "next";
import { servicePages } from "./services/service-pages";

const baseUrl = "https://www.polarpaw.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/about",
    "/contact",
    "/intake",
    "/etsa",
    "/privacy",
    "/terms",
  ];

  const coreRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-08-18"),
    changeFrequency: route === "" ? "weekly" : route === "/services" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/intake"
          ? 0.95
          : route === "/services"
            ? 0.9
            : route === "/etsa"
              ? 0.85
              : ["/privacy", "/terms"].includes(route)
                ? 0.4
                : 0.8,
  }));

  const serviceRoutes = servicePages.map(({ slug }) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date("2026-08-18"),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...coreRoutes, ...serviceRoutes];
}
