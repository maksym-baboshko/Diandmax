import type { Locale } from "@/shared/i18n/routing";

const DEFAULT_SITE_URL = "http://localhost:3000";

export const SITE_NAME = "Diandmax";
export const SITE_ALTERNATE_NAME = "Maksym & Diana Wedding";
export const PREVIEW_IMAGE = "/images/preview/og-image.jpg";
export const PREVIEW_IMAGE_WIDTH = 1200;
export const PREVIEW_IMAGE_HEIGHT = 630;

export function getMetadataBase(): URL {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (!configured) return new URL(DEFAULT_SITE_URL);

  const normalized = configured.startsWith("http") ? configured : `https://${configured}`;

  try {
    return new URL(normalized);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export function getSiteUrl(): string {
  return getMetadataBase().toString().replace(/\/$/, "");
}

export function getLocalePath(locale: Locale): string {
  return locale === "uk" ? "/" : `/${locale}`;
}

export function getOpenGraphLocale(locale: Locale): string {
  return locale === "uk" ? "uk_UA" : "en_US";
}
