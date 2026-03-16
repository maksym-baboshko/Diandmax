"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/navigation";

export function GamesFooter() {
  const t = useTranslations("GamesShell");
  const tCommon = useTranslations("GamesCommon");

  return (
    <footer className="border-t border-accent/12 bg-bg-primary/88">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
            {t("eyebrow")}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
            {t("note")}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.24em] text-text-secondary">
          <Link href="/" className="transition-colors hover:text-accent">
            {tCommon("home_nav")}
          </Link>
          <Link href="/games" className="transition-colors hover:text-accent">
            {tCommon("games_nav")}
          </Link>
          <Link href="/live" className="transition-colors hover:text-accent">
            {tCommon("live_nav")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
