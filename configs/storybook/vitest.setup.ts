import { afterEach } from "vitest";

function resetDocumentState(): void {
  document.documentElement.classList.remove("dark");
  document.documentElement.lang = "uk";
  delete document.documentElement.dataset.scrollBehavior;
}

function clearDocumentCookies(): void {
  for (const rawCookie of document.cookie.split(";")) {
    const cookieName = rawCookie.split("=")[0]?.trim();

    if (!cookieName) {
      continue;
    }

    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  }
}

afterEach(() => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.clear();
  window.sessionStorage.clear();
  clearDocumentCookies();
  resetDocumentState();
});
