export interface Guest {
  slug: string;
  name: {
    uk: string;
    en: string;
  };
  vocative: {
    uk: string;
    en: string;
  };
  seats: number;
}

export const guests: Guest[] = [
  {
    slug: "anna",
    name: { uk: "Анна", en: "Anna" },
    vocative: { uk: "Анно", en: "Anna" },
    seats: 1,
  },
  {
    slug: "oleg",
    name: { uk: "Олег", en: "Oleg" },
    vocative: { uk: "Олеже", en: "Oleg" },
    seats: 1,
  },
  {
    slug: "family-kovalenko",
    name: { uk: "Родина Коваленко", en: "Kovalenko Family" },
    vocative: { uk: "Родино Коваленко", en: "Kovalenko Family" },
    seats: 4,
  },
];

export function getGuestBySlug(slug: string): Guest | undefined {
  return guests.find((g) => g.slug === slug);
}

export function getAllGuestSlugs(): string[] {
  return guests.map((g) => g.slug);
}
