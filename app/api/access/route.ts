import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

const COOKIE_NAME = "wondreams_host_access";

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: Request) {
  const configuredCode = process.env.HOST_ACCESS_CODE?.trim();
  if (!configuredCode) return NextResponse.json({ error: "Access is not configured yet." }, { status: 503 });

  const body = await request.json().catch(() => ({})) as { code?: string };
  const submitted = String(body.code || "").trim().toUpperCase();
  const expected = configuredCode.toUpperCase();
  const submittedBuffer = Buffer.from(digest(submitted));
  const expectedBuffer = Buffer.from(digest(expected));
  if (!timingSafeEqual(submittedBuffer, expectedBuffer)) {
    return NextResponse.json({ error: "That access code is not valid. Please check your purchase PDF." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, digest(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
