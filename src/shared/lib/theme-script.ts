/**
 * Inline script injected into <head> to prevent flash of wrong theme.
 * Must be kept in sync with ThemeProvider logic.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;
