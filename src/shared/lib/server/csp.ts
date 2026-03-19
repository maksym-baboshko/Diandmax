import type { Locale } from "@/shared/i18n/routing";

const isVercelPreview = process.env.VERCEL_ENV === "preview";
const vercelToolbarScriptSources = "https://vercel.live";
const vercelToolbarConnectSources = "https://vercel.live wss://ws-us3.pusher.com";
const vercelToolbarImgSources = "https://vercel.live https://vercel.com";
const vercelToolbarStyleSources = "https://vercel.live";
const vercelToolbarFrameSources = "https://vercel.live";
const vercelToolbarFontSources = "https://vercel.live https://assets.vercel.com";

export async function buildContentSecurityPolicy(_locale: Locale) {
  const previewScriptSources = isVercelPreview
    ? ` ${vercelToolbarScriptSources}`
    : "";
  const previewConnectSources = isVercelPreview
    ? ` ${vercelToolbarConnectSources}`
    : "";
  const previewImgSources = isVercelPreview ? ` ${vercelToolbarImgSources}` : "";
  const previewStyleSources = isVercelPreview
    ? ` ${vercelToolbarStyleSources}`
    : "";
  const previewFrameSources = isVercelPreview
    ? ` ${vercelToolbarFrameSources}`
    : "";
  const previewFontSources = isVercelPreview
    ? ` ${vercelToolbarFontSources}`
    : "";

  if (process.env.NODE_ENV === "development") {
    const devScriptSources = `'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vitals.vercel-insights.com${previewScriptSources}`;

    return [
      "default-src 'self'",
      `script-src ${devScriptSources}`,
      `script-src-elem ${devScriptSources}`,
      `style-src 'self' 'unsafe-inline' fonts.googleapis.com${previewStyleSources}`,
      `img-src 'self' data: blob: maps.googleapis.com maps.gstatic.com *.gstatic.com${previewImgSources}`,
      `frame-src https://maps.google.com https://www.google.com${previewFrameSources}`,
      `connect-src 'self' https://*.googleapis.com https://*.gstatic.com https://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com ws://localhost:* wss://localhost:* wss://*.supabase.co${previewConnectSources}`,
      `font-src 'self' fonts.gstatic.com data:${previewFontSources}`,
      "worker-src 'self' blob:",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; ");
  }
  const scriptSources = `'self' 'unsafe-inline' https://va.vercel-scripts.com https://vitals.vercel-insights.com${previewScriptSources}`;

  return [
    "default-src 'self'",
    // Static App Router pages emit multiple inline hydration scripts at build time.
    // Do not mix hashes with 'unsafe-inline' here: browsers ignore 'unsafe-inline'
    // when a hash or nonce is present in the same source list.
    `script-src ${scriptSources}`,
    `script-src-elem ${scriptSources}`,
    `style-src 'self' 'unsafe-inline' fonts.googleapis.com${previewStyleSources}`,
    `img-src 'self' data: blob: maps.googleapis.com maps.gstatic.com *.gstatic.com${previewImgSources}`,
    `frame-src https://maps.google.com https://www.google.com${previewFrameSources}`,
    `connect-src 'self' https://*.googleapis.com https://*.gstatic.com https://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com wss://*.supabase.co${previewConnectSources}`,
    `font-src 'self' fonts.gstatic.com data:${previewFontSources}`,
    "worker-src 'self' blob:",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");
}
