import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  PREVIEW_IMAGE,
  getOpenGraphLocale,
  type SupportedLocale,
} from "@/shared/config";
import { routing, type Locale } from "@/shared/i18n/routing";
import { GamesHubPage } from "@/widgets/games-hub";

interface GamesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

function resolveLocale(locale: string): Locale {
  return routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;
}

export async function generateMetadata({
  params,
}: GamesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = resolveLocale(locale);
  const t = await getTranslations({
    locale: typedLocale,
    namespace: "GamesMetadata",
  });

  return {
    title: t("games_title"),
    description: t("games_description"),
    alternates: {
      canonical: typedLocale === "uk" ? "/games" : "/en/games",
      languages: {
        uk: "/games",
        en: "/en/games",
      },
    },
    openGraph: {
      title: t("games_title"),
      description: t("games_description"),
      type: "website",
      locale: getOpenGraphLocale(typedLocale as SupportedLocale),
      images: [
        {
          url: PREVIEW_IMAGE,
          alt: t("games_title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("games_title"),
      description: t("games_description"),
      images: [PREVIEW_IMAGE],
    },
  };
}

export default async function GamesPage({ params }: GamesPageProps) {
  const { locale } = await params;
  const typedLocale = resolveLocale(locale);

  setRequestLocale(typedLocale);

  return <GamesHubPage />;
}
