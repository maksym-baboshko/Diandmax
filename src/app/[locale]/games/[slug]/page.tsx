import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  PREVIEW_IMAGE,
  getGameBySlug,
  getOpenGraphLocale,
  getPlayableGameSlugs,
  isGamePlayable,
  type SupportedLocale,
} from "@/shared/config";
import { resolveLocale } from "@/shared/i18n/routing";
import { GamesWheelPage } from "@/widgets/games-wheel-page";

interface GameDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getPlayableGameSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GameDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const typedLocale = resolveLocale(locale);
  const game = getGameBySlug(slug);

  if (!game || !isGamePlayable(slug)) {
    return {};
  }

  const t = await getTranslations({
    locale: typedLocale,
    namespace: "GamesMetadata",
  });
  const canonicalPath =
    typedLocale === "uk" ? `/games/${slug}` : `/en/games/${slug}`;

  if (slug === "wheel-of-fortune") {
    return {
      title: t("wheel_title"),
      description: t("wheel_description"),
      alternates: {
        canonical: canonicalPath,
        languages: {
          uk: `/games/${slug}`,
          en: `/en/games/${slug}`,
        },
      },
      openGraph: {
        title: t("wheel_title"),
        description: t("wheel_description"),
        type: "website",
        locale: getOpenGraphLocale(typedLocale as SupportedLocale),
        images: [
          {
            url: PREVIEW_IMAGE,
            alt: t("wheel_title"),
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: t("wheel_title"),
        description: t("wheel_description"),
        images: [PREVIEW_IMAGE],
      },
    };
  }

  return {};
}

export default async function GameDetailPage({
  params,
}: GameDetailPageProps) {
  const { locale, slug } = await params;
  const typedLocale = resolveLocale(locale);

  if (!isGamePlayable(slug)) {
    notFound();
  }

  setRequestLocale(typedLocale);

  if (slug === "wheel-of-fortune") {
    return <GamesWheelPage />;
  }

  notFound();
}
