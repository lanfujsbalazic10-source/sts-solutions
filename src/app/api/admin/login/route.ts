import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createAdminSession, getAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as { password?: string };
  const password = payload.password ?? "";

  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    return NextResponse.json({ error: "Admin password is not configured" }, { status: 503 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const session = createAdminSession();
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE_NAME, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });

  return response;
}
