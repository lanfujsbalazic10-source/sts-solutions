import fs from "node:fs/promises";
import path from "node:path";
import { ContactSubmission, defaultSiteContent, mergeSiteContent, SiteContent } from "@/lib/site-data";

export const DATA_DIR = path.join(process.cwd(), "data");
export const SITE_CONTENT_PATH = path.join(DATA_DIR, "site-content.json");
export const CONTACT_SUBMISSIONS_PATH = path.join(DATA_DIR, "contact-submissions.json");

export async function readSiteContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(SITE_CONTENT_PATH, "utf8");
    const saved = JSON.parse(raw) as Partial<SiteContent>;
    return mergeSiteContent(defaultSiteContent, saved);
  } catch {
    return defaultSiteContent;
  }
}

export async function writeSiteContent(content: SiteContent): Promise<SiteContent> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SITE_CONTENT_PATH, JSON.stringify(content, null, 2), "utf8");
  return content;
}

export async function readContactSubmissions(): Promise<ContactSubmission[]> {
  try {
    const raw = await fs.readFile(CONTACT_SUBMISSIONS_PATH, "utf8");
    const parsed = JSON.parse(raw) as ContactSubmission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function appendContactSubmission(submission: ContactSubmission): Promise<ContactSubmission[]> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const existing = await readContactSubmissions();
  const next = [...existing, submission];
  await fs.writeFile(CONTACT_SUBMISSIONS_PATH, JSON.stringify(next, null, 2), "utf8");
  return next;
}
