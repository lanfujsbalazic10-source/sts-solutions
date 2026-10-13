import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidAdminSession, AUTH_COOKIE_NAME } from "@/lib/admin-auth";
import { mergeSiteContent } from "@/lib/site-data";
import { readSiteContent, writeSiteContent } from "@/lib/site-storage";

export async function GET() {
  const content = await readSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();

  if (!isValidAdminSession(cookieStore.get(AUTH_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as Partial<import("@/lib/site-data").SiteContent>;
  const current = await readSiteContent();
  const next = mergeSiteContent(current, payload);
  const saved = await writeSiteContent(next);

  return NextResponse.json(saved);
}
