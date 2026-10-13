import { afterEach, describe, expect, it, vi } from "vitest";
import { createAdminSession, isValidAdminSession } from "./admin-auth";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("admin sessions", () => {
  it("accepts a signed session and rejects a modified token", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("ADMIN_PASSWORD", "test-password");

    const session = createAdminSession();

    expect(isValidAdminSession(session.token)).toBe(true);
    expect(isValidAdminSession(`${session.token}modified`)).toBe(false);
  });

  it("rejects the old forgeable true cookie value", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("ADMIN_PASSWORD", "test-password");

    expect(isValidAdminSession("true")).toBe(false);
  });

  it("falls back to the default admin password in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_PASSWORD", "");

    expect(createAdminSession().token).toBeTruthy();
    expect(isValidAdminSession(createAdminSession().token)).toBe(true);
  });
});
