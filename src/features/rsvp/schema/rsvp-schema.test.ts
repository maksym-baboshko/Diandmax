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
});
