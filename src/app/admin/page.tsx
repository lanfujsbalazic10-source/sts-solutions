"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { defaultSiteContent, mergeSiteContent, SiteContent } from "@/lib/site-data";

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/site", { cache: "no-store" });

        if (!response.ok) {
          router.push("/admin/login");
          return;
        }

        const data = (await response.json()) as Partial<SiteContent>;
        if (active) {
          setContent(mergeSiteContent(defaultSiteContent, data));
        }
      } catch {
        router.push("/admin/login");
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [router]);

  const handleChange = (
    field: keyof SiteContent,
    value: string | { value: string; label: string }[] | { id: string; title: string; text: string }[] | { year: string; value: string; text: string }[],
  ) => {
    setContent((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/site", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      setStatus("Something went wrong while saving.");
      return;
    }

    setStatus("Website content saved successfully.");
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <main className="admin-shell">
      <div className="admin-panel">
        <div className="admin-header">
          <div>
            <p className="eyebrow dark">Admin dashboard</p>
            <h1>STS Solutions CMS</h1>
          </div>
          <button className="button light" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-grid">
            <label>
              Company name
              <input
                value={content.companyName}
                onChange={(event) => handleChange("companyName", event.target.value)}
              />
            </label>

            <label>
              Contact email
              <input
                value={content.email}
                onChange={(event) => handleChange("email", event.target.value)}
              />
            </label>

            <label>
              Phone
              <input
                value={content.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
              />
            </label>

            <label>
              Location
              <input
                value={content.location}
                onChange={(event) => handleChange("location", event.target.value)}
              />
            </label>

            <label className="full-width">
              Hero title
              <input
                value={content.heroTitle}
                onChange={(event) => handleChange("heroTitle", event.target.value)}
              />
            </label>

            <label className="full-width">
              Hero text
              <textarea
                value={content.heroText}
                rows={4}
                onChange={(event) => handleChange("heroText", event.target.value)}
              />
            </label>
          </div>

          <div className="admin-section">
            <h2>Company stats</h2>
            <div className="mini-grid">
              {content.companyStats.map((item, index) => (
                <div key={`${item.value}-${index}`} className="mini-card">
                  <input
                    value={item.value}
                    onChange={(event) => {
                      const next = [...content.companyStats];
                      next[index] = { ...item, value: event.target.value };
                      handleChange("companyStats", next);
                    }}
                  />
                  <input
                    value={item.label}
                    onChange={(event) => {
                      const next = [...content.companyStats];
                      next[index] = { ...item, label: event.target.value };
                      handleChange("companyStats", next);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="admin-section">
            <h2>Services</h2>
            <div className="mini-grid">
              {content.services.map((service, index) => (
                <div key={`${service.id}-${index}`} className="mini-card">
                  <input
                    value={service.id}
                    onChange={(event) => {
                      const next = [...content.services];
                      next[index] = { ...service, id: event.target.value };
                      handleChange("services", next);
                    }}
                  />
                  <input
                    value={service.title}
                    onChange={(event) => {
                      const next = [...content.services];
                      next[index] = { ...service, title: event.target.value };
                      handleChange("services", next);
                    }}
                  />
                  <textarea
                    rows={3}
                    value={service.text}
                    onChange={(event) => {
                      const next = [...content.services];
                      next[index] = { ...service, text: event.target.value };
                      handleChange("services", next);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="admin-section">
            <h2>Revenue</h2>
            <div className="mini-grid">
              {content.revenue.map((item, index) => (
                <div key={`${item.year}-${index}`} className="mini-card">
                  <input
                    value={item.year}
                    onChange={(event) => {
                      const next = [...content.revenue];
                      next[index] = { ...item, year: event.target.value };
                      handleChange("revenue", next);
                    }}
                  />
                  <input
                    value={item.value}
                    onChange={(event) => {
                      const next = [...content.revenue];
                      next[index] = { ...item, value: event.target.value };
                      handleChange("revenue", next);
                    }}
                  />
                  <textarea
                    rows={3}
                    value={item.text}
                    onChange={(event) => {
                      const next = [...content.revenue];
                      next[index] = { ...item, text: event.target.value };
                      handleChange("revenue", next);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="admin-actions">
            <button type="submit" className="button">
              Save changes
            </button>
            {status ? <p className="success-text">{status}</p> : null}
          </div>
        </form>
      </div>
    </main>
  );
}
