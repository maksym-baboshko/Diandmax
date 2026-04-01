import { describe, expect, it } from "vitest";
import {
  getAllGuestSlugs,
  getGuestBySlug,
  getInvitationContent,
  mockGuestRepository,
} from "./mock-guest-repository";

describe("mockGuestRepository", () => {
  it("returns every known guest slug", () => {
    expect(getAllGuestSlugs()).toContain("papa-ihor");
    expect(getAllGuestSlugs()).toContain("family-shevchuk");
  });

  it("resolves a guest by slug", () => {
    expect(getGuestBySlug("mama-ira")?.name.uk).toBe("Мама Іра");
    expect(getGuestBySlug("missing-slug")).toBeNull();
  });

  it("builds localized invitation content from the guest contract", () => {
    expect(mockGuestRepository.getInvitationContent("papa-ihor", "uk")).toEqual({
      guest: expect.objectContaining({ slug: "papa-ihor", seats: 4 }),
      guestVocative: "Папа Ігор",
      defaultGuestName: "Ігор Бабошко",
      maxSeats: 4,
    });

    expect(getInvitationContent("papa-ihor", "en")).toEqual({
      guest: expect.objectContaining({ slug: "papa-ihor", seats: 4 }),
      guestVocative: "Papa Ihor",
      defaultGuestName: "Ihor Baboshko",
      maxSeats: 4,
    });
  });

  it("returns null invitation content for unknown slugs", () => {
    expect(getInvitationContent("missing-slug", "uk")).toBeNull();
  });
});
