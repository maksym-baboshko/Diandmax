"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/features/language-switcher";
import { ThemeSwitcher } from "@/features/theme-switcher";
import { Link, usePathname } from "@/shared/i18n/navigation";
import { cn } from "@/shared/lib";

const navLinks = [
  { href: "/games", key: "games_nav" },
  { href: "/live", key: "live_nav" },
] as const;

export function GamesHeader() {
  const pathname = usePathname();
  const t = useTranslations("GamesCommon");

  return (
    <header className="sticky top-0 z-40 border-b border-accent/12 bg-bg-primary/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            href="/"
            className="heading-serif text-2xl text-text-primary transition-colors hover:text-accent md:text-3xl"
          >
            M<span className="text-accent italic">&</span>D
          </Link>

          <nav
            aria-label={t("games_navigation")}
            className="hidden items-center gap-2 md:flex"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] transition-colors",
                    isActive
                      ? "bg-accent text-bg-primary"
                      : "text-text-secondary hover:text-accent"
                  )}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
