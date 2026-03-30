// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RsvpFormData } from "../schema/rsvp-schema";
import { mockRsvpSubmissionService } from "../services/mock-rsvp-submission-service";
import { useRsvpFormSubmission } from "./useRsvpFormSubmission";

const defaultValues: RsvpFormData = {
  attending: "yes",
  dietary: "",
  guestNames: ["Ігор Бабошко"],
  guests: 1,
  message: "",
  slug: "papa-ihor",
  website: "",
};

function createTranslation(
  key: string,
  values?: Record<string, string | number | null | undefined>,
) {
  if (key === "personalized_limit_error") {
    return `limit:${values?.seats}`;
  }

  return key;
}

describe("useRsvpFormSubmission", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("stops early with a personalized limit error when guests exceed the allowed seats", async () => {
    const reset = vi.fn();
    const submitSpy = vi.spyOn(mockRsvpSubmissionService, "submit");
    const { result } = renderHook(() =>
      useRsvpFormSubmission({
        defaultValues,
        guestVocative: "Папа Ігор",
        maxSeats: 2,
        reset,
        t: createTranslation,
      }),
    );

    await act(async () => {
      await result.current.onSubmit({
        ...defaultValues,
        guestNames: ["Ігор Бабошко", "Мама Ірина", "Гість 3"],
        guests: 3,
      });
    });

    expect(submitSpy).not.toHaveBeenCalled();
    expect(result.current.submitError).toBe("limit:2");
    expect(result.current.submitted).toBe(false);
  });

  it("stores submitted state, shows confetti, locks scroll, and fully resets on dismiss", async () => {
    const reset = vi.fn();
    vi.spyOn(mockRsvpSubmissionService, "submit").mockResolvedValue({
      mode: "mock",
      requestId: "req_1",
      success: true,
    });

    const { result } = renderHook(() =>
      useRsvpFormSubmission({
        defaultValues,
        guestVocative: "Папа Ігор",
        maxSeats: 4,
        reset,
        t: createTranslation,
      }),
    );

    await act(async () => {
      await result.current.onSubmit({
        ...defaultValues,
        guestNames: ["  Папа Ігор  "],
      });
    });

    await waitFor(() => {
      expect(result.current.submitted).toBe(true);
      expect(result.current.showConfetti).toBe(true);
      expect(result.current.submittedAttending).toBe("yes");
      expect(result.current.submittedName).toBe("Папа");
      expect(document.body.style.overflow).toBe("hidden");
    });

    act(() => {
      result.current.onHideConfetti();
    });

    expect(result.current.showConfetti).toBe(false);

    act(() => {
      result.current.dismissSuccessOverlay();
    });

    await waitFor(() => {
      expect(result.current.submitted).toBe(false);
      expect(result.current.showConfetti).toBe(false);
      expect(result.current.submittedAttending).toBeNull();
      expect(result.current.submittedName).toBe("");
      expect(result.current.submitError).toBeNull();
      expect(document.body.style.overflow).toBe("");
      expect(reset).toHaveBeenCalledWith(defaultValues);
    });
  });

  it("falls back to the guest vocative on successful submissions without a usable name", async () => {
    vi.spyOn(mockRsvpSubmissionService, "submit").mockResolvedValue({
      mode: "mock",
      requestId: "req_2",
      success: true,
    });

    const { result } = renderHook(() =>
      useRsvpFormSubmission({
        defaultValues,
        guestVocative: "Папа Ігор",
        maxSeats: 4,
        reset: vi.fn(),
        t: createTranslation,
      }),
    );

    await act(async () => {
      await result.current.onSubmit({
        ...defaultValues,
        guestNames: ["   "],
      });
    });

    expect(result.current.submittedName).toBe("Папа Ігор");
  });

  it("surfaces a generic error when the submission service rejects the RSVP", async () => {
    vi.spyOn(mockRsvpSubmissionService, "submit").mockResolvedValue({
      error: "storage_error",
      mode: "mock",
      requestId: "req_3",
      success: false,
    });

    const { result } = renderHook(() =>
      useRsvpFormSubmission({
        defaultValues,
        maxSeats: 4,
        reset: vi.fn(),
        t: createTranslation,
      }),
    );

    await act(async () => {
      await result.current.onSubmit(defaultValues);
    });

    expect(result.current.submitError).toBe("error_generic");
    expect(result.current.submitted).toBe(false);
    expect(result.current.showConfetti).toBe(false);
  });
});
