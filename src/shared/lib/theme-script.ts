/**
 * Inline script injected into <head> to prevent flash of wrong theme.
 * Must be kept in sync with ThemeProvider logic.
 */
export const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`.trim();
