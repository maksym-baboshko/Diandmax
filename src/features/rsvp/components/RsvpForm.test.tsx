// @vitest-environment jsdom

import { setMockMatchMedia } from "@/testing/react/match-media";
import { renderWithAppProviders } from "@/testing/react/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode, createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { RsvpForm } from "./RsvpForm";

const MOTION_ONLY_PROPS = new Set([
  "animate",
  "exit",
  "initial",
  "transition",
  "variants",
  "viewport",
  "whileHover",
  "whileInView",
  "whileTap",
]);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
    motion: new Proxy(
      {},
      {
        get:
          (_, tagName: string) =>
          ({ children, ...props }: Record<string, unknown> & { children?: ReactNode }) => {
            const domProps = Object.fromEntries(
              Object.entries(props).filter(([key]) => !MOTION_ONLY_PROPS.has(key)),
            );

            return createElement(tagName, domProps, children);
          },
      },
    ),
    useReducedMotion: () => true,
  };
});

vi.mock("@/shared/ui", async () => {
  const actual = await vi.importActual<typeof import("@/shared/ui")>("@/shared/ui");

  return {
    ...actual,
    AnimatedReveal: ({ children }: { children: ReactNode }) => <>{children}</>,
  };
});

function renderRsvpForm() {
  setMockMatchMedia("(max-width: 767px)", false);

  return renderWithAppProviders(
    <RsvpForm
      slug="papa-ihor"
      guestVocative="Папа Ігор"
      maxSeats={4}
      initialGuestName="Ігор Бабошко"
    />,
  );
}

function getGuestCountInput(): HTMLInputElement | null {
  return document.querySelector('input[name="guests"]');
}

describe("RsvpForm", () => {
  it("reveals attending details, updates status copy, and manages guest count boundaries", async () => {
    const user = userEvent.setup();
    renderRsvpForm();

    const submitButton = screen.getByRole("button", { name: /Надіслати/ });
    const yesButton = screen.getByRole("button", { name: /^Так/ });
    const noButton = screen.getByRole("button", { name: /^Ні/ });
    const dietaryField = document.getElementById("dietary");
    expect(dietaryField).not.toBeNull();
    if (!dietaryField) {
      throw new Error("Expected the dietary field to exist.");
    }
    const detailsSection = dietaryField.closest("[aria-hidden]");

    expect(detailsSection).toHaveAttribute("aria-hidden", "true");
    expect(detailsSection).toHaveAttribute("inert");
    expect(submitButton).toBeDisabled();
    expect(screen.getByText("* Будь ласка, оберіть варіант присутності")).toBeInTheDocument();
    expect(yesButton).toHaveAttribute("aria-pressed", "false");
    expect(noButton).toHaveAttribute("aria-pressed", "false");

    await user.click(yesButton);

    await waitFor(() => {
      expect(screen.getByLabelText("Гість 2")).toHaveFocus();
    });

    const updatedDetailsSection = document.getElementById("dietary")?.closest("[aria-hidden]");

    expect(screen.getByRole("button", { name: /^Так/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /^Ні/ })).toHaveAttribute("aria-pressed", "false");
    expect(updatedDetailsSection).toHaveAttribute("aria-hidden", "false");
    expect(updatedDetailsSection).not.toHaveAttribute("inert");
    expect(screen.getByRole("button", { name: /Надіслати/ })).toBeEnabled();
    expect(screen.getByText(/Режим прототипу/)).toBeInTheDocument();

    const decreaseGuests = screen.getByRole("button", { name: "Зменшити кількість гостей" });
    const increaseGuests = screen.getByRole("button", { name: "Збільшити кількість гостей" });

    expect(increaseGuests).toBeDisabled();
    await user.click(decreaseGuests);
    await user.click(screen.getByRole("button", { name: "Зменшити кількість гостей" }));
    await user.click(screen.getByRole("button", { name: "Зменшити кількість гостей" }));

    await waitFor(() => {
      expect(getGuestCountInput()).toHaveValue("1");
      expect(screen.getByRole("button", { name: "Зменшити кількість гостей" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Збільшити кількість гостей" })).toBeEnabled();
    });
  });

  it("focuses the first invalid guest field and wires accessibility error metadata", async () => {
    const user = userEvent.setup();
    renderRsvpForm();

    await user.click(screen.getByRole("button", { name: /^Так/ }));

    await screen.findByLabelText("Гість 1");
    const primaryGuestField = document.getElementById("rsvp-guest-name-0");
    expect(primaryGuestField).not.toBeNull();
    await user.clear(primaryGuestField as HTMLInputElement);
    await user.click(screen.getByRole("button", { name: /Надіслати/ }));

    await waitFor(() => {
      const activeField = document.getElementById("rsvp-guest-name-0");

      expect(document.activeElement).toBe(activeField);
      expect(activeField).toHaveAttribute("aria-invalid", "true");
      expect(activeField).toHaveAttribute("aria-describedby");
    });

    const describedBy = document
      .getElementById("rsvp-guest-name-0")
      ?.getAttribute("aria-describedby");
    const primaryErrorId = describedBy?.split(" ").find((id) => id.endsWith("-error"));

    expect(primaryErrorId).toBe("rsvp-guest-name-0-error");
    expect(document.getElementById(primaryErrorId ?? "")).toHaveTextContent(
      "Введіть щонайменше 2 символи",
    );
  });
});
