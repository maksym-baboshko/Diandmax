import createMiddleware from "next-intl/middleware";
import { routing } from "./shared/i18n/routing";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  if (!request.cookies.has("NEXT_LOCALE")) {
    request.headers.set("accept-language", "uk");
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(uk|en)/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
