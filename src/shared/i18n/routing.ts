import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uk", "en"],
  defaultLocale: "uk",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing)["locales"][number];

export function resolveLocale(locale: string): Locale {
  return routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
}
