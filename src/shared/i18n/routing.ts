import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uk", "en"],
  defaultLocale: "uk",
  localePrefix: "as-needed", // Only prefix /en, keep / for uk
});

// Lightweight wrappers around Next.js' navigation APIs
export type Locale = (typeof routing)["locales"][number];
