import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "wondreams_host_access";

async function digest(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function proxy(request: NextRequest) {
  const configuredCode = process.env.HOST_ACCESS_CODE?.trim().toUpperCase();
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (configuredCode && cookie === await digest(configuredCode)) return NextResponse.next();

  const accessUrl = new URL("/access", request.url);
  accessUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(accessUrl);
}

export const config = {
  matcher: ["/", "/host/:path*"],
};
