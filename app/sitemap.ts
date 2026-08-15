import type { MetadataRoute } from "next";

const baseUrl = "https://polarpaw.online";

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

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
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
}
