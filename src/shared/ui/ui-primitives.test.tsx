// @vitest-environment jsdom

import { renderWithAppProviders } from "@/testing/react/render";
import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { GlassPanel } from "./GlassPanel";
import { SectionHeading } from "./SectionHeading";
import { SectionShell } from "./SectionShell";
import { SectionWrapper } from "./SectionWrapper";

vi.mock("./InViewReveal", () => ({
  InViewReveal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("shared ui primitives", () => {
  it("renders section headings with optional eyebrow, subtitle, and left alignment", () => {
    const { container } = renderWithAppProviders(
      <SectionHeading
        eyebrow="Eyebrow"
        subtitle="Subtitle"
        align="left"
        className="heading-root"
        titleClassName="title-class"
        subtitleClassName="subtitle-class"
        eyebrowClassName="eyebrow-class"
        ruleClassName="rule-class"
      >
        Title
      </SectionHeading>,
    );

    expect(screen.getByText("Eyebrow")).toHaveClass("eyebrow-class");
    expect(screen.getByRole("heading", { name: "Title" })).toHaveClass("title-class");
    expect(screen.getByText("Subtitle")).toHaveClass("subtitle-class");
    expect(container.firstElementChild).toHaveClass("heading-root");
    expect(container.firstElementChild).not.toHaveClass("text-center");
    expect(container.querySelector("hr")).toHaveClass("rule-class");
    expect(container.querySelector("hr")).not.toHaveClass("mx-auto");
  });

  it("centers the default heading rule when optional copy is absent", () => {
    const { container } = renderWithAppProviders(<SectionHeading>Only title</SectionHeading>);

    expect(container.firstElementChild).toHaveClass("text-center");
    expect(screen.queryByText("Eyebrow")).not.toBeInTheDocument();
    expect(screen.queryByText("Subtitle")).not.toBeInTheDocument();
    expect(container.querySelector("hr")).toHaveClass("mx-auto");
  });

  it("maps section shell props to background, padding, width, and fade edges", () => {
    const { container } = renderWithAppProviders(
      <SectionShell
        id="example"
        background="secondary"
        padding="compact"
        contentWidth="wide"
        fullHeight
        contentClassName="content-class"
      >
        <div>Shell content</div>
      </SectionShell>,
    );

    const section = container.querySelector("section");
    const fades = container.querySelectorAll('[aria-hidden="true"]');

    expect(section).toHaveAttribute("id", "example");
    expect(section).toHaveClass("bg-bg-secondary", "flex", "min-h-screen");
    expect(fades).toHaveLength(2);
    expect(container.querySelector(".content-class")).toHaveClass("max-w-6xl");
  });

  it("lets section wrapper switch to alternate full-width sections without fade edges", () => {
    const { container } = renderWithAppProviders(
      <SectionWrapper alternate noPadding noFade fullHeight className="wrapper-root">
        <div>Wrapped content</div>
      </SectionWrapper>,
    );

    const section = container.querySelector("section");

    expect(section).toHaveClass("wrapper-root", "bg-bg-secondary", "flex", "min-h-screen");
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
    expect(container.querySelector(".max-w-none")).toBeInTheDocument();
  });

  it("renders buttons as both native buttons and alternate elements", () => {
    const { rerender } = renderWithAppProviders(<Button>Primary action</Button>);

    expect(screen.getByRole("button", { name: "Primary action" })).toHaveClass(
      "bg-accent",
      "px-6",
      "py-3",
    );

    rerender(
      <Button as="a" href="/invite" variant="outline" size="sm">
        View invite
      </Button>,
    );

    expect(screen.getByRole("link", { name: "View invite" })).toHaveAttribute("href", "/invite");
    expect(screen.getByRole("link", { name: "View invite" })).toHaveClass(
      "border-accent",
      "px-4",
      "py-2",
    );
  });

  it("renders glass panels through the shared surface panel defaults", () => {
    const { container } = renderWithAppProviders(
      <GlassPanel className="glass-root" contentClassName="glass-content">
        <div>Panel content</div>
      </GlassPanel>,
    );

    expect(screen.getByText("Panel content")).toBeInTheDocument();
    expect(container.querySelector(".glass-root")).toHaveClass("group/surface");
    expect(container.querySelector(".glass-content")).toBeInTheDocument();
  });
});
