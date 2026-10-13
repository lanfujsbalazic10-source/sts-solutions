import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, mergeSiteContent } from "@/lib/site-data";
import { readSiteContent, writeSiteContent } from "@/lib/site-storage";

export async function GET() {
  const content = await readSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();

  if (cookieStore.get(AUTH_COOKIE_NAME)?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as Partial<import("@/lib/site-data").SiteContent>;
  const current = await readSiteContent();
  const next = mergeSiteContent(current, payload);
  const saved = await writeSiteContent(next);

  return NextResponse.json(saved);
}
