import { ThemeProvider } from "@/features/theme-switcher";
import { resolveLocale } from "@/shared/i18n/routing";
import { THEME_INIT_SCRIPT, cinzel, inter, playfair, vibes } from "@/shared/lib";
import { NotFoundPage, getNotFoundPageContent } from "@/widgets/not-found";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cookies } from "next/headers";
import Script from "next/script";

export default async function RootNotFound() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("NEXT_LOCALE")?.value ?? "");
  const content = getNotFoundPageContent(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfair.variable} ${cinzel.variable} ${vibes.variable}`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body className="font-inter antialiased">
        <ThemeProvider>
          <NotFoundPage locale={locale} content={content} />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
