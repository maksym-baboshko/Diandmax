// @vitest-environment jsdom

import { setMockMatchMedia } from "@/testing/react/match-media";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeaderFrame, type HeaderNavItem } from "./HeaderFrame";

vi.mock("@/features/language-switcher", () => ({
  LanguageSwitcher: () => <button type="button">Language</button>,
}));

vi.mock("@/features/theme-switcher", () => ({
  ThemeSwitcher: () => <button type="button">Theme</button>,
}));

vi.mock("@/shared/i18n/navigation", () => ({
  Link: forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a">>(function MockLink(props, ref) {
    return <a ref={ref} {...props} />;
  }),
}));

const items: HeaderNavItem[] = [
  { href: "#hero", label: "Hero", kind: "anchor" },
  { href: "#story", label: "Story", kind: "anchor" },
];

function renderHeaderFrame() {
  return render(
    <>
      <HeaderFrame
        items={items}
        logo={{ href: "/", label: "M&D", kind: "route" }}
        desktopNavLabel="Primary navigation"
        mobileNavLabel="Mobile navigation"
        openMenuLabel="Open menu"
        closeMenuLabel="Close menu"
        mobileMeta={{ left: "Bergen", right: "XXVIII" }}
        showSkipLink
        skipLinkLabel="Skip to content"
      />
      <main id="main-content" tabIndex={-1} />
      <footer id="site-footer" />
    </>,
  );
}

describe("HeaderFrame", () => {
  beforeEach(() => {
    setMockMatchMedia("(min-width: 1024px)", false);
  });

  it("opens and closes the mobile menu with inert/focus management", async () => {
    const user = userEvent.setup();
    renderHeaderFrame();

    const menuButton = screen.getByRole("button", { name: "Open menu" });
    const main = document.getElementById("main-content");
    const footer = document.getElementById("site-footer");

    await user.click(menuButton);

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const mobileLinks = within(mobileNav).getAllByRole("link");

    await waitFor(() => {
      expect(menuButton).toHaveAttribute("aria-expanded", "true");
      expect(document.body.style.overflow).toBe("hidden");
      expect(main).toHaveAttribute("inert");
      expect(footer).toHaveAttribute("inert");
      expect(mobileLinks[0]).toHaveFocus();
    });

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("navigation", { name: "Mobile navigation" }),
      ).not.toBeInTheDocument();
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
      expect(menuButton).toHaveFocus();
      expect(main).not.toHaveAttribute("inert");
      expect(footer).not.toHaveAttribute("inert");
      expect(document.body.style.overflow).toBe("unset");
    });
  });

  it("tracks keyboard mode and closes the mobile overlay when desktop media turns on", async () => {
    const user = userEvent.setup();
    renderHeaderFrame();

    const header = screen.getByRole("banner");
    const menuButton = screen.getByRole("button", { name: "Open menu" });

    fireEvent.keyDown(document, { key: "Tab" });
    expect(header).toHaveAttribute("data-keyboard-nav", "true");

    fireEvent.pointerDown(document);
    expect(header).toHaveAttribute("data-keyboard-nav", "false");

    await user.click(menuButton);
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();

    act(() => {
      setMockMatchMedia("(min-width: 1024px)", true);
    });

    await waitFor(() => {
      expect(
        screen.queryByRole("navigation", { name: "Mobile navigation" }),
      ).not.toBeInTheDocument();
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("focuses the skip target after the skip link is activated", async () => {
    const user = userEvent.setup();
    render(
      <>
        <HeaderFrame
          items={items}
          logo={{ href: "/", label: "M&D", kind: "route" }}
          desktopNavLabel="Primary navigation"
          mobileNavLabel="Mobile navigation"
          openMenuLabel="Open menu"
          closeMenuLabel="Close menu"
          mobileMeta={{ left: "Bergen", right: "XXVIII" }}
          showSkipLink
          skipLinkLabel="Skip to content"
        />
        <main id="main-content" tabIndex={-1}>
          Main
        </main>
        <footer id="site-footer" />
      </>,
    );

    await user.click(screen.getByRole("link", { name: "Skip to content" }));

    await waitFor(() => {
      expect(document.getElementById("main-content")).toHaveFocus();
    });
  });
});
