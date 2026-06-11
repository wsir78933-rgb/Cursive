import { NextResponse, type NextRequest } from "next/server";

import { getLocaleFromPathname, localeRequestHeaderName } from "@/lib/locale-routing";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const locale = getLocaleFromPathname(request.nextUrl.pathname);

  requestHeaders.set(localeRequestHeaderName, locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
