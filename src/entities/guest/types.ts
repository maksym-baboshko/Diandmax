import type { Locale } from "@/shared/i18n/routing";

export interface LocalizedText {
  uk: string;
  en: string;
}

export interface GuestProfile {
  slug: string;
  name: LocalizedText;
  vocative: LocalizedText;
  formName?: LocalizedText;
  seats: number;
}

export interface InvitationContent {
  guest: GuestProfile;
  guestVocative: string;
  defaultGuestName: string;
  maxSeats: number;
}

export interface GuestRepository {
  getAll(): GuestProfile[];
  getAllSlugs(): string[];
  getBySlug(slug: string): GuestProfile | null;
  getInvitationContent(slug: string, locale: Locale): InvitationContent | null;
}
