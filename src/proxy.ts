import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./shared/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  if (!request.cookies.has("NEXT_LOCALE")) {
    request.headers.set("accept-language", "uk");
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
