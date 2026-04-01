import { getLocalePath } from "@/shared/config";
import type { Locale } from "@/shared/i18n/routing";
import enMessages from "@/shared/i18n/translations/en.json";
import ukMessages from "@/shared/i18n/translations/uk.json";

type Messages = typeof ukMessages;

export interface NotFoundPageContent {
  eyebrow: string;
  leftCopy: string;
  cardLabel: string;
  title: string;
  description: string;
  hint: string;
  primaryCta: string;
  secondaryCta: string;
  homeHref: string;
  switchLanguageLabel: string;
  switchThemeToDarkLabel: string;
  switchThemeToLightLabel: string;
}

const NOT_FOUND_MESSAGES: Record<
  Locale,
  {
    accessibility: Messages["Accessibility"];
    notFound: Messages["NotFoundPage"];
  }
> = {
  uk: {
    accessibility: ukMessages.Accessibility,
    notFound: ukMessages.NotFoundPage,
  },
  en: {
    accessibility: enMessages.Accessibility,
    notFound: enMessages.NotFoundPage,
  },
};

export function getNotFoundPageContent(locale: Locale): NotFoundPageContent {
  const { accessibility, notFound } = NOT_FOUND_MESSAGES[locale];
  const switchLanguageLabel =
    locale === "uk" ? accessibility.switch_language_to_en : accessibility.switch_language_to_uk;

  return {
    eyebrow: notFound.eyebrow,
    leftCopy: notFound.left_copy,
    cardLabel: notFound.card_label,
    title: notFound.title,
    description: notFound.description,
    hint: notFound.hint,
    primaryCta: notFound.primary_cta,
    secondaryCta: notFound.secondary_cta,
    homeHref: getLocalePath(locale),
    switchLanguageLabel,
    switchThemeToDarkLabel: accessibility.switch_to_dark_theme,
    switchThemeToLightLabel: accessibility.switch_to_light_theme,
  };
}
