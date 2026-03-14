import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { headers } from "next/headers";
import { getMessages } from "next-intl/server";
import { playfair, inter, cinzel, vibes } from "@/shared/lib";
import { ThemeProvider } from "@/features/theme-switcher";
import "../globals.css";

const TITLE = "Максим & Діана — 28.06.2026";
const DESCRIPTION =
  "Весільне запрошення Максима та Діани. 28 червня 2026, Grand Hotel Terminus, Bergen, Norway.";
const PREVIEW_IMAGE = "/images/preview/og-image.jpg";

const DEFAULT_SITE_URL = new URL("http://localhost:3000");

async function getMetadataBase() {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    DEFAULT_SITE_URL.host;
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  try {
    return new URL(`${protocol}://${host}`);
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: await getMetadataBase(),
    title: TITLE,
    description: DESCRIPTION,
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: "website",
      locale: "uk_UA",
      alternateLocale: "en_US",
      images: [
        {
          url: PREVIEW_IMAGE,
          alt: TITLE,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [PREVIEW_IMAGE],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} ${cinzel.variable} ${vibes.variable} font-inter antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
