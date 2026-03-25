"use client";

import type { MouseEvent } from "react";

import { VENUE, WEDDING_DATE_ROMAN } from "@/shared/config";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

import { HeaderFrame, type HeaderNavItem } from "./HeaderFrame";

const NAV_LINKS = [
  { id: "hero", label: "hero" },
  { id: "our-story", label: "story" },
  { id: "timeline", label: "timeline" },
  { id: "location", label: "location" },
  { id: "dress-code", label: "dress_code" },
  { id: "gifts", label: "gifts" },
  { id: "rsvp", label: "rsvp" },
];

export function Navbar() {
  const t = useTranslations("Navbar");
  const tA11y = useTranslations("Accessibility");

  const prefersReducedMotion = useReducedMotion();

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);

    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  const items: HeaderNavItem[] = NAV_LINKS.map((link) => ({
    href: `#${link.id}`,
    label: t(link.label),
    kind: "anchor",
    onSelect: (event) => scrollToSection(event, link.id),
  }));

  return (
    <HeaderFrame
      items={items}
      logo={{
        href: "/",
        label: "M&D",
        kind: "route",
        onSelect: (event) => scrollToSection(event, "hero"),
      }}
      desktopNavLabel={tA11y("primary_navigation")}
      mobileNavLabel={tA11y("mobile_navigation")}
      openMenuLabel={tA11y("open_menu")}
      closeMenuLabel={tA11y("close_menu")}
      mobileMeta={{
        left: VENUE.locationShort,
        right: WEDDING_DATE_ROMAN,
      }}
      showSkipLink
      skipLinkLabel={tA11y("skip_to_content")}
    />
  );
}
