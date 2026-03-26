import type { Locale } from "@/shared/i18n/routing";
import type { GuestProfile, GuestRepository, InvitationContent } from "../types";
import { MOCK_GUESTS } from "./mock-guests";

function getLocalizedValue(
  value: GuestProfile["name"] | GuestProfile["vocative"] | GuestProfile["formName"],
  locale: Locale,
): string {
  return value?.[locale] ?? value?.uk ?? "";
}

function buildInvitationContent(guest: GuestProfile, locale: Locale): InvitationContent {
  return {
    guest,
    guestVocative: getLocalizedValue(guest.vocative, locale),
    defaultGuestName: getLocalizedValue(guest.formName ?? guest.name, locale),
    maxSeats: guest.seats,
  };
}

export const mockGuestRepository: GuestRepository = {
  getAll() {
    return [...MOCK_GUESTS];
  },
  getAllSlugs() {
    return MOCK_GUESTS.map((guest) => guest.slug);
  },
  getBySlug(slug) {
    return MOCK_GUESTS.find((guest) => guest.slug === slug) ?? null;
  },
  getInvitationContent(slug, locale) {
    const guest = this.getBySlug(slug);

    if (!guest) {
      return null;
    }

    return buildInvitationContent(guest, locale);
  },
};

export function getAllGuestSlugs(): string[] {
  return mockGuestRepository.getAllSlugs();
}

export function getGuestBySlug(slug: string): GuestProfile | null {
  return mockGuestRepository.getBySlug(slug);
}

export function getInvitationContent(slug: string, locale: Locale): InvitationContent | null {
  return mockGuestRepository.getInvitationContent(slug, locale);
}
