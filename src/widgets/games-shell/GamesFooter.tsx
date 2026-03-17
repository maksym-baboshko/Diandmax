"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/navigation";

export function GamesFooter() {
  const t = useTranslations("GamesShell");
  const tCommon = useTranslations("GamesCommon");

  return (
    <footer id="site-footer" className="relative">
      {/* Ornamental divider */}
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-accent/12" />
          <span
            className="font-cinzel text-[8px] tracking-[0.5em] text-accent/20"
            aria-hidden="true"
          >
            ✦
          </span>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-accent/12" />
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8 md:py-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
            {t("eyebrow")}
          </p>
          <p className="mt-2.5 max-w-md text-sm leading-relaxed text-text-secondary">
            {t("note")}
          </p>
        </div>

        <nav className="flex flex-wrap gap-5 text-xs uppercase tracking-[0.24em] text-text-secondary md:justify-end">
          <Link
            href="/"
            className="transition-colors duration-300 hover:text-accent"
          >
            {tCommon("home_nav")}
          </Link>
          <Link
            href="/games"
            className="transition-colors duration-300 hover:text-accent"
          >
            {tCommon("games_nav")}
          </Link>
          <Link
            href="/live"
            className="transition-colors duration-300 hover:text-accent"
          >
            {tCommon("live_nav")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
