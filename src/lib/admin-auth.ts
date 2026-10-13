import { createHmac, timingSafeEqual } from "node:crypto";
import { AUTH_COOKIE_NAME } from "./site-data";

const LOCAL_ADMIN_PASSWORD = "stsadmin";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export { AUTH_COOKIE_NAME };

export function getAdminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) {
    return process.env.ADMIN_PASSWORD;
  }

  return LOCAL_ADMIN_PASSWORD;
}

export function createAdminSession() {
  const password = getAdminPassword();

  if (!password) {
    throw new Error("ADMIN_PASSWORD must be configured in production.");
  }

  const expiresAt = Date.now() + SESSION_DURATION_SECONDS * 1000;
  const signature = createHmac("sha256", password).update(String(expiresAt)).digest("base64url");

  return {
    token: `${expiresAt}.${signature}`,
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export function isValidAdminSession(token?: string): boolean {
  if (!token) {
    return false;
  }

  const [expiresAt, signature] = token.split(".");
  const expiry = Number(expiresAt);
  const password = getAdminPassword();

  if (!Number.isFinite(expiry) || expiry <= Date.now() || !signature || !password) {
    return false;
  }

  const expected = createHmac("sha256", password).update(String(expiry)).digest();
  const actual = Buffer.from(signature, "base64url");

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}