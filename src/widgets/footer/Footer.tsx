"use client";

import { useTranslations } from "next-intl";
import { Ornament } from "@/shared/ui";
import { COUPLE, WEDDING_DATE } from "@/shared/config";

const formattedDate = `${WEDDING_DATE.getDate().toString().padStart(2, "0")}.${(WEDDING_DATE.getMonth() + 1).toString().padStart(2, "0")}.${WEDDING_DATE.getFullYear()}`;

export function Footer() {
  const t = useTranslations("Footer");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-16 md:py-24 overflow-hidden bg-bg-primary">
      <Ornament position="top-left" size="sm" className="opacity-10" />
      <Ornament position="top-right" size="sm" className="opacity-10" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <button
          onClick={scrollToTop}
          className="group flex flex-col items-center gap-3 mb-16 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </div>
          <span className="text-xs tracking-[0.2em] uppercase text-text-secondary/60 font-medium group-hover:text-accent transition-colors duration-500">
            {t("back_to_top")}
          </span>
        </button>

        <div className="flex flex-col items-center gap-4 mb-8">
          <h2 className="heading-serif text-3xl md:text-4xl text-text-primary">
            {COUPLE.groom.name.en} <span className="text-accent italic">&</span> {COUPLE.bride.name.en}
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent/20" />
            <span className="font-cinzel text-sm tracking-widest text-text-secondary">
              {formattedDate}
            </span>
            <div className="h-px w-8 bg-accent/20" />
          </div>
        </div>

        <p className="text-[10px] md:text-xs tracking-widest uppercase text-text-secondary/40 font-medium text-center">
          &copy; {new Date().getFullYear()} &bull; {t("made_with_love")}
        </p>

        <div className="mt-8 text-accent/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
             <path d="M12 22C12 22 17 18 17 12C17 7 14 2 12 2C10 2 7 7 7 12C7 18 12 22 12 22Z" />
             <path d="M12 2V22" />
          </svg>
        </div>
      </div>
    </footer>
  );
}
