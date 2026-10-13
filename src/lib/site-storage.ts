import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { ContactSubmission, defaultSiteContent, mergeSiteContent, SiteContent } from "@/lib/site-data";

export const DATA_DIR = path.join(process.cwd(), "data");
export const SITE_CONTENT_PATH = path.join(DATA_DIR, "site-content.json");
export const CONTACT_SUBMISSIONS_PATH = path.join(DATA_DIR, "contact-submissions.json");

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url && !serviceRoleKey && process.env.NODE_ENV !== "production") {
    return null;
  }

  if (!url || !serviceRoleKey) {
    throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable persistent storage.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function readSiteContent(): Promise<SiteContent> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", "main")
      .maybeSingle();

    if (error) {
      throw new Error(`Could not read site content: ${error.message}`);
    }

    return mergeSiteContent(defaultSiteContent, data?.content as Partial<SiteContent> | null);
  }

  try {
    const raw = await fs.readFile(SITE_CONTENT_PATH, "utf8");
    const saved = JSON.parse(raw) as Partial<SiteContent>;
    return mergeSiteContent(defaultSiteContent, saved);
  } catch {
    return defaultSiteContent;
  }
}

export async function writeSiteContent(content: SiteContent): Promise<SiteContent> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { error } = await supabase.from("site_content").upsert(
      {
        id: "main",
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      throw new Error(`Could not save site content: ${error.message}`);
    }

    return content;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SITE_CONTENT_PATH, JSON.stringify(content, null, 2), "utf8");
  return content;
}

export async function readContactSubmissions(): Promise<ContactSubmission[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("name, email, message, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Could not read contact submissions: ${error.message}`);
    }

    return (data ?? []).map((submission) => ({
      name: submission.name,
      email: submission.email,
      message: submission.message,
      createdAt: submission.created_at,
    }));
  }

  try {
    const raw = await fs.readFile(CONTACT_SUBMISSIONS_PATH, "utf8");
    const parsed = JSON.parse(raw) as ContactSubmission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function appendContactSubmission(submission: ContactSubmission): Promise<void> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { error } = await supabase.from("contact_submissions").insert({
      name: submission.name,
      email: submission.email,
      message: submission.message,
      created_at: submission.createdAt,
    });

    if (error) {
      throw new Error(`Could not save contact submission: ${error.message}`);
    }

    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  const existing = await readContactSubmissions();
  const next = [...existing, submission];
  await fs.writeFile(CONTACT_SUBMISSIONS_PATH, JSON.stringify(next, null, 2), "utf8");
}
