import type { MetadataRoute } from "next";
import { CRITTERS } from "@/lib/critters";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/critters`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/qr`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const critterRoutes: MetadataRoute.Sitemap = CRITTERS.map((critter) => ({
    url: `${SITE_URL}/critter/${critter.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...critterRoutes];
}
