import type { MetadataRoute } from "next";
import { PREVIEW_IMAGE, getMetadataBase, getSiteUrl } from "@/shared/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const metadataBase = getMetadataBase();
  const lastModified = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          uk: `${siteUrl}/`,
          en: `${siteUrl}/en`,
        },
      },
      images: [new URL(PREVIEW_IMAGE, metadataBase).toString()],
    },
    {
      url: `${siteUrl}/games`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
      alternates: {
        languages: {
          uk: `${siteUrl}/games`,
          en: `${siteUrl}/en/games`,
        },
      },
      images: [new URL(PREVIEW_IMAGE, metadataBase).toString()],
    },
    {
      url: `${siteUrl}/en/games`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          uk: `${siteUrl}/games`,
          en: `${siteUrl}/en/games`,
        },
      },
      images: [new URL(PREVIEW_IMAGE, metadataBase).toString()],
    },
    {
      url: `${siteUrl}/games/wheel-of-fortune`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: {
        languages: {
          uk: `${siteUrl}/games/wheel-of-fortune`,
          en: `${siteUrl}/en/games/wheel-of-fortune`,
        },
      },
      images: [new URL(PREVIEW_IMAGE, metadataBase).toString()],
    },
    {
      url: `${siteUrl}/en/games/wheel-of-fortune`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          uk: `${siteUrl}/games/wheel-of-fortune`,
          en: `${siteUrl}/en/games/wheel-of-fortune`,
        },
      },
      images: [new URL(PREVIEW_IMAGE, metadataBase).toString()],
    },
    {
      url: `${siteUrl}/en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          uk: `${siteUrl}/`,
          en: `${siteUrl}/en`,
        },
      },
      images: [new URL(PREVIEW_IMAGE, metadataBase).toString()],
    },
  ];
}
