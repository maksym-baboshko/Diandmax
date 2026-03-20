const isVercelPreview = process.env.VERCEL_ENV === "preview";
const BASE_SCRIPT_SOURCES = [
  "'self'",
  "'unsafe-inline'",
  "https://va.vercel-scripts.com",
  "https://vitals.vercel-insights.com",
] as const;
const DEV_ONLY_SCRIPT_SOURCES = ["'unsafe-eval'"] as const;
const BASE_STYLE_SOURCES = ["'self'", "'unsafe-inline'", "fonts.googleapis.com"] as const;
const BASE_IMG_SOURCES = [
  "'self'",
  "data:",
  "blob:",
  "maps.googleapis.com",
  "maps.gstatic.com",
  "*.gstatic.com",
] as const;
const BASE_FRAME_SOURCES = [
  "https://maps.google.com",
  "https://www.google.com",
] as const;
const BASE_CONNECT_SOURCES = [
  "'self'",
  "https://*.googleapis.com",
  "https://*.gstatic.com",
  "https://*.supabase.co",
  "https://va.vercel-scripts.com",
  "https://vitals.vercel-insights.com",
] as const;
const DEV_ONLY_CONNECT_SOURCES = [
  "ws://localhost:*",
  "wss://localhost:*",
] as const;
const BASE_FONT_SOURCES = ["'self'", "fonts.gstatic.com", "data:"] as const;
const PREVIEW_SCRIPT_SOURCES = ["https://vercel.live"] as const;
const PREVIEW_CONNECT_SOURCES = [
  "https://vercel.live",
  "wss://ws-us3.pusher.com",
] as const;
const PREVIEW_IMG_SOURCES = ["https://vercel.live", "https://vercel.com"] as const;
const PREVIEW_STYLE_SOURCES = ["https://vercel.live"] as const;
const PREVIEW_FRAME_SOURCES = ["https://vercel.live"] as const;
const PREVIEW_FONT_SOURCES = [
  "https://vercel.live",
  "https://assets.vercel.com",
] as const;

// Static App Router pages emit inline hydration scripts in prerendered HTML.
// Keep script directives on plain 'unsafe-inline' source lists here:
// if a hash or nonce appears in the same directive, browsers ignore 'unsafe-inline'
// and hydration breaks again.
function withPreviewSources(
  baseSources: readonly string[],
  previewSources: readonly string[],
) {
  return isVercelPreview
    ? [...baseSources, ...previewSources]
    : [...baseSources];
}

function buildSourceDirective(name: string, sources: readonly string[]) {
  return `${name} ${sources.join(" ")}`;
}

export function buildContentSecurityPolicy() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const scriptSources = withPreviewSources(
    isDevelopment
      ? [...BASE_SCRIPT_SOURCES, ...DEV_ONLY_SCRIPT_SOURCES]
      : BASE_SCRIPT_SOURCES,
    PREVIEW_SCRIPT_SOURCES,
  );
  const styleSources = withPreviewSources(
    BASE_STYLE_SOURCES,
    PREVIEW_STYLE_SOURCES,
  );
  const imgSources = withPreviewSources(BASE_IMG_SOURCES, PREVIEW_IMG_SOURCES);
  const frameSources = withPreviewSources(
    BASE_FRAME_SOURCES,
    PREVIEW_FRAME_SOURCES,
  );
  const connectSources = withPreviewSources(
    [
      ...BASE_CONNECT_SOURCES,
      ...(isDevelopment ? DEV_ONLY_CONNECT_SOURCES : []),
      "wss://*.supabase.co",
    ],
    PREVIEW_CONNECT_SOURCES,
  );
  const fontSources = withPreviewSources(
    BASE_FONT_SOURCES,
    PREVIEW_FONT_SOURCES,
  );

  return [
    "default-src 'self'",
    buildSourceDirective("script-src", scriptSources),
    buildSourceDirective("script-src-elem", scriptSources),
    buildSourceDirective("style-src", styleSources),
    buildSourceDirective("img-src", imgSources),
    buildSourceDirective("frame-src", frameSources),
    buildSourceDirective("connect-src", connectSources),
    buildSourceDirective("font-src", fontSources),
    "worker-src 'self' blob:",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");
}
