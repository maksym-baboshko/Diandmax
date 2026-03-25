import { Cinzel, Great_Vibes, Inter, Playfair_Display } from "next/font/google";

export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const vibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vibes",
  display: "swap",
});
