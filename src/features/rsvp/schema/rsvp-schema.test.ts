import { describe, expect, it } from "vitest";
import { rsvpSchema } from "./rsvp-schema";

const validPayload = {
  guestNames: ["Олена Ковальчук"],
  attending: "yes" as const,
  guests: 1,
};

describe("rsvpSchema", () => {
  it("accepts a minimal valid payload", () => {
    const result = rsvpSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts a full payload including optional fields", () => {
    const result = rsvpSchema.safeParse({
      ...validPayload,
      attending: "no",
      guests: 3,
      dietary: "вегетаріанське",
      message: "Дуже чекаємо!",
      website: "", // honeypot empty
      slug: "kovalchuk",
    });
    expect(result.success).toBe(true);
  });

  it("accepts honeypot filled (validation at action level, not schema)", () => {
    const result = rsvpSchema.safeParse({ ...validPayload, website: "http://spam.com" });
    expect(result.success).toBe(true);
  });

  it("rejects empty guestNames array", () => {
    const result = rsvpSchema.safeParse({ ...validPayload, guestNames: [] });
    expect(result.success).toBe(false);
  });

  it("rejects guestNames with empty string entries", () => {
    const result = rsvpSchema.safeParse({ ...validPayload, guestNames: [""] });
    expect(result.success).toBe(false);
  });

  it("rejects guestNames with single-character entries", () => {
    const result = rsvpSchema.safeParse({ ...validPayload, guestNames: ["А"] });
    expect(result.success).toBe(false);
  });

  it("rejects guest names that exceed the allowed length", () => {
    const result = rsvpSchema.safeParse({
      ...validPayload,
      guestNames: ["А".repeat(81)],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid attending value", () => {
    const result = rsvpSchema.safeParse({ ...validPayload, attending: "maybe" });
    expect(result.success).toBe(false);
  });

  it("rejects guests = 0", () => {
    const result = rsvpSchema.safeParse({ ...validPayload, guests: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects guests > 20", () => {
    const result = rsvpSchema.safeParse({ ...validPayload, guests: 21 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer guests", () => {
    const result = rsvpSchema.safeParse({ ...validPayload, guests: 1.5 });
    expect(result.success).toBe(false);
  });

  it("rejects missing attending", () => {
    const { attending: _attending, ...rest } = validPayload;
    const result = rsvpSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing guestNames", () => {
    const { guestNames: _guestNames, ...rest } = validPayload;
    const result = rsvpSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("accepts multiple guest names", () => {
    const result = rsvpSchema.safeParse({
      ...validPayload,
      guestNames: ["Андрій Бондар", "Марія Бондар"],
      guests: 2,
    });
    expect(result.success).toBe(true);
  });

  it("rejects more guest names than the maximum guest count", () => {
    const result = rsvpSchema.safeParse({
      ...validPayload,
      guestNames: Array.from({ length: 21 }, (_, index) => `Гість ${index + 1}`),
      guests: 20,
    });
    expect(result.success).toBe(false);
  });

  it("rejects dietary notes that exceed the allowed length", () => {
    const result = rsvpSchema.safeParse({
      ...validPayload,
      dietary: "а".repeat(241),
    });
    expect(result.success).toBe(false);
  });

  it("rejects messages that exceed the allowed length", () => {
    const result = rsvpSchema.safeParse({
      ...validPayload,
      message: "б".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("trims guest names and optional text fields", () => {
    const result = rsvpSchema.safeParse({
      ...validPayload,
      guestNames: ["  Олена Ковальчук  "],
      dietary: "  без глютену  ",
      message: "  З нетерпінням чекаємо!  ",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Expected schema parsing to succeed.");
    }

    expect(result.data.guestNames).toEqual(["Олена Ковальчук"]);
    expect(result.data.dietary).toBe("без глютену");
    expect(result.data.message).toBe("З нетерпінням чекаємо!");
  });
});
