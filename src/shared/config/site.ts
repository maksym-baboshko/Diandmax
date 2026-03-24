export const SITE_NAME = "Diandmax";
export const SITE_ALTERNATE_NAME = "Maksym & Diana Wedding";
export const PREVIEW_IMAGE = "/images/preview/og-image.jpg";

export function getMetadataBase(): URL {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    "http://localhost:3000";

  return new URL(base.replace(/\/$/, ""));
}

export function getSiteUrl(): string {
  return getMetadataBase().toString().replace(/\/$/, "");
}

export function getLocalePath(locale: string): string {
  return locale === "uk" ? "/" : `/${locale}`;
}

export function getOpenGraphLocale(locale: string): string {
  return locale === "uk" ? "uk_UA" : "en_US";
}
