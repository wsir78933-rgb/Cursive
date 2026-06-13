import type { MetadataRoute } from "next";

import { canonicalUrls } from "@/lib/site-url";

const sitemapLastModified = new Date("2026-06-11T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: canonicalUrls.en,
      lastModified: sitemapLastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: canonicalUrls.zh,
      lastModified: sitemapLastModified,
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
