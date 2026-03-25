"use client";

import { usePathname, useRouter } from "@/shared/i18n/navigation";
import { cn } from "@/shared/lib";
import { useLocale, useTranslations } from "next-intl";
import { useSyncExternalStore, useTransition } from "react";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("Accessibility");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const toggleLocale = () => {
    const nextLocale = locale === "uk" ? "en" : "uk";

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-accent bg-bg-primary text-sm font-medium text-accent opacity-0",
          className,
        )}
        aria-label={locale === "uk" ? t("switch_language_to_en") : t("switch_language_to_uk")}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={cn(
        "flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full border border-accent text-sm font-medium transition-all duration-300",
        "bg-bg-primary text-accent hover:bg-accent hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        isPending && "opacity-70",
        className,
      )}
      aria-label={locale === "uk" ? t("switch_language_to_en") : t("switch_language_to_uk")}
    >
      <span className="pointer-events-none">{locale === "uk" ? "EN" : "UA"}</span>
    </button>
  );
}
