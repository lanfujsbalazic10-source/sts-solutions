"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Incorrect password. Use the admin password to continue.");
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="admin-shell">
      <div className="login-card">
        <p className="eyebrow dark">Admin access</p>
        <h1>STS Solutions CMS</h1>
        <form onSubmit={handleSubmit} className="admin-form">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
          />
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="button light admin-submit">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
