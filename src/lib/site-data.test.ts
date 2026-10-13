import { describe, expect, it } from "vitest";
import { defaultSiteContent, mergeSiteContent } from "./site-data";

describe("mergeSiteContent", () => {
  it("keeps the default values when the saved content is empty", () => {
    expect(mergeSiteContent(defaultSiteContent, {})).toEqual(defaultSiteContent);
  });

  it("overrides only supplied fields while preserving the rest of the site content", () => {
    const updated = mergeSiteContent(defaultSiteContent, {
      companyName: "STS SOLUTIONS LTD",
      companyStats: [{ value: "2026", label: "updated" }],
    });

    expect(updated.companyName).toBe("STS SOLUTIONS LTD");
    expect(updated.heroTitle).toBe(defaultSiteContent.heroTitle);
    expect(updated.companyStats[0]).toMatchObject({ value: "2026", label: "updated" });
  });
});
