import { THEME_STORAGE_KEY } from "@/features/theme-switcher/constants";
import enMessages from "@/shared/i18n/translations/en.json";
import ukMessages from "@/shared/i18n/translations/uk.json";
import { type RenderOptions, render } from "@testing-library/react";
import { MotionConfig } from "motion/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";

const messagesByLocale = {
  en: enMessages,
  uk: ukMessages,
} as const;

type TestLocale = keyof typeof messagesByLocale;
type TestTheme = "light" | "dark";

interface AppTestProvidersProps {
  children: ReactNode;
  locale?: TestLocale;
  theme?: TestTheme;
}

interface RenderWithAppProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  locale?: TestLocale;
  theme?: TestTheme;
}

function AppTestProviders({
  children,
  locale = "uk",
  theme = "light",
}: AppTestProvidersProps): ReactElement {
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    window.localStorage?.setItem?.(THEME_STORAGE_KEY, theme);
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]}>
      <MotionConfig reducedMotion="always">{children}</MotionConfig>
    </NextIntlClientProvider>
  );
}

export function renderWithAppProviders(
  ui: ReactElement,
  { locale = "uk", theme = "light", ...options }: RenderWithAppProvidersOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AppTestProviders locale={locale} theme={theme}>
        {children}
      </AppTestProviders>
    ),
    ...options,
  });
}
