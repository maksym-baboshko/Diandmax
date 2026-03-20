import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { buildContentSecurityPolicy } from "./shared/lib/server";
import { routing } from "./shared/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  if (!request.cookies.has("NEXT_LOCALE")) {
    requestHeaders.set("accept-language", "uk");
  }

  const requestWithHeaders = new NextRequest(request.url, {
    headers: requestHeaders,
  });

  const response = intlMiddleware(requestWithHeaders);
  const contentSecurityPolicy = buildContentSecurityPolicy();
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
