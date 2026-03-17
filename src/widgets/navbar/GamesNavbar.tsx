"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/shared/i18n/navigation";
import { HeaderFrame, type HeaderNavItem } from "./HeaderFrame";

const desktopRoutes = [
  { href: "/games", key: "games_nav" },
  { href: "/live", key: "live_nav" },
] as const;

const mobileRoutes = [
  { href: "/", key: "home_nav" },
  ...desktopRoutes,
] as const;

export function GamesNavbar() {
  const pathname = usePathname();
  const tCommon = useTranslations("GamesCommon");
  const tA11y = useTranslations("Accessibility");

  const items: HeaderNavItem[] = desktopRoutes.map((item) => ({
    href: item.href,
    label: tCommon(item.key),
    kind: "route",
    active: pathname === item.href,
  }));

  const mobileItems: HeaderNavItem[] = mobileRoutes.map((item) => ({
    href: item.href,
    label: tCommon(item.key),
    kind: "route",
    active: pathname === item.href,
  }));

  return (
    <HeaderFrame
      items={items}
      mobileItems={mobileItems}
      logo={{
        href: "/",
        label: "M&D",
        kind: "route",
      }}
      desktopNavLabel={tA11y("primary_navigation")}
      mobileNavLabel={tA11y("mobile_navigation")}
      openMenuLabel={tA11y("open_menu")}
      closeMenuLabel={tA11y("close_menu")}
      mobileMeta={{
        left: "Bergen · Norway",
        right: "XXVIII · VI · MMXXVI",
      }}
    />
  );
}
