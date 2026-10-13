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

  it("requires an admin password in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_PASSWORD", "");

    expect(() => createAdminSession()).toThrow("ADMIN_PASSWORD must be configured in production.");
  });
});
