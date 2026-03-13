export const WEDDING_DATE = new Date("2026-06-28T12:00:00+02:00");

export const VENUE = {
  name: "Grand Hotel Terminus",
  address: "Zander Kaaes gate 6, Bergen, Norway",
  mapsUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7885.211927431506!2d5.3317077777744!3d60.39067347514558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x463cfeaee5dd6657%3A0xc2191cbcc53f2cb4!2sGrand%20Hotel%20Terminus!5e0!3m2!1sen!2sus!4v1773371922926!5m2!1sen!2sus",
  coordinates: {
    lat: 60.39067347514558,
    lng: 5.3317077777744,
  },
} as const;

export const COUPLE = {
  groom: {
    name: { uk: "Максим", en: "Maksym" },
  },
  bride: {
    name: { uk: "Діана", en: "Diana" },
  },
} as const;

export const DRESS_CODE = {
  ladies: {
    colors: [
      { hex: "#E9E0D2", name: { uk: "Перлинно-кремовий", en: "Pearl Cream" } },
      { hex: "#A8B8A0", name: { uk: "Шавлія зелена", en: "Sage green" } },
      { hex: "#D4B0A8", name: { uk: "Пильна троянда", en: "Dusty rose" } },
      { hex: "#4A3728", name: { uk: "Темний шоколад", en: "Dark Chocolate" } },
    ],
  },
  gentlemen: {
    colors: [
      { hex: "#C4B29A", name: { uk: "Теплий пісочний", en: "Warm Sand" } },
      { hex: "#4A3728", name: { uk: "Темний шоколад", en: "Dark Chocolate" } },
      { hex: "#383E42", name: { uk: "Благородний графіт", en: "Slate Graphite" } },
      { hex: "#0A0A0A", name: { uk: "Опівнічний чорний", en: "Midnight Black" } },
    ],
  },
} as const;
