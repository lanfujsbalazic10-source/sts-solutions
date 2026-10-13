import { NextResponse } from "next/server";
import { ContactSubmission } from "@/lib/site-data";
import { appendContactSubmission } from "@/lib/site-storage";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as Partial<ContactSubmission>;

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required contact data" }, { status: 400 });
  }

  const submission: ContactSubmission = {
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  await appendContactSubmission(submission);
  return NextResponse.json({ success: true, submission });
}
