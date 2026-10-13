"use client";

import { FormEvent, useEffect, useState } from "react";
import { defaultSiteContent, mergeSiteContent, SiteContent } from "@/lib/site-data";

export default function Home() {
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/site", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as Partial<SiteContent>;
        if (active) {
          setSiteContent(mergeSiteContent(defaultSiteContent, data));
        }
      } catch {
        // keep default content when the API is unavailable
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setStatus("Something went wrong. Please try again.");
      return;
    }

    setForm({ name: "", email: "", message: "" });
    setStatus("Thank you. Your message has been saved successfully.");
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark">↗</span> {siteContent.companyName}
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#income">Income</a>
          <a className="button" href="#contact">
            Talk to us <span>↗</span>
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div>
            <div className="eyebrow">Since 2019</div>
            <h1>{siteContent.heroTitle}</h1>
            <p className="hero-copy">{siteContent.heroText}</p>
            <div className="hero-actions">
              <a className="button light" href="#contact">
                Get in touch <span>↗</span>
              </a>
              <a className="text-link" href="#services">
                Explore services <span>↓</span>
              </a>
            </div>
          </div>

          <div className="hero-art">
            <img
              className="photo"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
              alt="Business team collaborating around a table"
            />
            <div className="rate-card">
              <small>Revenue</small>
              <strong>€705k</strong>
              <small>2025</small>
            </div>
          </div>
        </section>

        <section className="trust" aria-label="STS SOLUTIONS highlights">
          {siteContent.companyStats.map((item) => (
            <div key={item.value}>
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </div>
          ))}
        </section>

        <section className="section" id="about">
          <div className="section-heading">
            <h2>Technology, trade, construction, and consulting under one roof.</h2>
            <p className="section-intro">
              Based in Maribor, {siteContent.companyName} works with businesses and
              project partners who need practical support, dependable execution,
              and long-term value.
            </p>
          </div>

          <div className="services">
            <article className="service">
              <span className="service-number">01 / ABOUT</span>
              <h3>Company details</h3>
              <p>
                <strong>Director:</strong> Horvat Jan
                <br />
                <strong>Email:</strong> {siteContent.email}
                <br />
                <strong>Registration:</strong> SI 35332751
                <br />
                <strong>Tax number:</strong> 8441251000
              </p>
            </article>
            <article className="service">
              <span className="service-number">02 / LOCATION</span>
              <h3>Head office</h3>
              <p>{siteContent.location}</p>
            </article>
            <article className="service">
              <span className="service-number">03 / FOCUS</span>
              <h3>Core business</h3>
              <p>
                IT solutions, software and digital services, trade, production,
                construction support, and business consulting.
              </p>
            </article>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-heading">
            <h2>Solutions built around real operational needs.</h2>
            <p className="section-intro">
              We focus on practical services that help businesses run more
              smoothly, deliver more reliably, and grow with confidence.
            </p>
          </div>

          <div className="services">
            {siteContent.services.map((service) => (
              <article key={service.id} className="service">
                <span className="service-number">{service.id}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="statement" id="approach">
          <h2>Stable growth, clear structure, and client-first execution.</h2>
          <div>
            <p className="statement-copy">
              The company’s recent financial results show a consistent upward
              trend, reflecting solid business activity and a strong foundation
              for long-term value.
            </p>
            <a className="button light" href="#contact">
              Get in touch <span>↗</span>
            </a>
          </div>
        </section>

        <section className="section" id="income">
          <div className="section-heading">
            <h2>Revenue growth built on trust and execution.</h2>
            <p className="section-intro">
              Recent results show a clear upward trajectory from 2023 to 2025.
            </p>
          </div>

          <div className="services">
            {siteContent.revenue.map((item) => (
              <article key={item.year} className="service">
                <span className="service-number">{item.year}</span>
                <h3>{item.value}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-card">
            <div>
              <p className="eyebrow dark">Contact</p>
              <h2>Let’s build something reliable together.</h2>
            </div>
            <form onSubmit={handleSubmit} className="contact-form">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
              <textarea
                rows={5}
                placeholder="Tell us about your project"
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                required
              />
              <button type="submit" className="button">
                Send message
              </button>
              {status ? <p className="success-text">{status}</p> : null}
            </form>
          </div>
        </section>
      </main>

      <footer id="contact-footer">
        <div className="brand">
          <span className="brand-mark">↗</span> {siteContent.companyName}
        </div>
        <p>
          {siteContent.location} • Director: Horvat Jan • {siteContent.email}
        </p>
        <a className="button light" href={`mailto:${siteContent.email}`}>
          Start a conversation <span>↗</span>
        </a>
      </footer>
    </>
  );
}
