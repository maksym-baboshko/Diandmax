// ThemeSwitcher — full implementation in PR 9
"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-full p-2 text-text-secondary hover:text-accent transition-colors"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
