"use client";

import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { HeaderFrame, type HeaderNavItem } from "./HeaderFrame";

const NAV_LINKS = [
  { id: "hero",       label: "hero" },
  { id: "our-story",  label: "story" },
  { id: "timeline",   label: "timeline" },
  { id: "location",   label: "location" },
  { id: "dress-code", label: "dress_code" },
  { id: "gifts",      label: "gifts" },
  { id: "rsvp",       label: "rsvp" },
];

export function Navbar() {
  const t = useTranslations("Navbar");
  const tA11y = useTranslations("Accessibility");
  const prefersReducedMotion = useReducedMotion();
  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);

    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
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
        left: "Bergen · Norway",
        right: "XXVIII · VI · MMXXVI",
      }}
      showSkipLink
      skipLinkLabel={tA11y("skip_to_content")}
    />
  );
}
