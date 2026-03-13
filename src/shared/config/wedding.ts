export const WEDDING_DATE = new Date("2026-06-28T12:00:00+02:00");

export const VENUE = {
  name: "Grand Hotel Terminus",
  address: "Zander Kaaes gate 6, Bergen, Norway",
  mapsUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1975.6!2d5.3290!3d60.3912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x463cf9be0c15a9c3%3A0x9e3e0f8a7c7e8f0!2sGrand%20Hotel%20Terminus!5e0!3m2!1sen!2sno!4v1",
  coordinates: {
    lat: 60.3912,
    lng: 5.329,
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
      { hex: "#D4B0A8", name: { uk: "Пильна троянда", en: "Dusty rose" } },
      { hex: "#A8B8A0", name: { uk: "Шавлія зелена", en: "Sage green" } },
      { hex: "#8FA88E", name: { uk: "Приглушений зелений", en: "Muted green" } },
    ],
  },
  gentlemen: {
    colors: [
      { hex: "#C4B29A", name: { uk: "Теплий пісочний", en: "Warm Sand" } },
      { hex: "#4A3728", name: { uk: "Темний шоколад", en: "Dark Chocolate" } },
      { hex: "#838C76", name: { uk: "Срібляста шавлія", en: "Silver Sage" } },
      { hex: "#383E42", name: { uk: "Благородний графіт", en: "Slate Graphite" } },
    ],
  },
} as const;
