import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middlewear(request: NextRequest) {
  if (request.nextUrl.pathname === "/auth/verify") {
    const referrer = request.headers.get("referer");

    if (!referrer?.includes("/auth/register")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/auth/verify",
};
