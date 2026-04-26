import { getHabitSlug } from "@/lib/slug";
import { describe, it, expect } from "vitest";

describe("getHabitSlug", () => {
  it("returns lowercase hyphenated slug for a basic habit name", () => {
    expect(getHabitSlug("Drink water")).toBe("drink-water");
    expect(getHabitSlug("Read Books")).toBe("read-books");
  });

  it("trims outer spaces and collapses repeated internal spaces", () => {
    expect(getHabitSlug("   Drink   Water   ")).toBe("drink-water");
  });

  it("removes non alphanumeric characters except hyphens", () => {
    expect(getHabitSlug("Drink! Water?")).toBe("drink-water");
    expect(getHabitSlug("Read & Write")).toBe("read-write");
  });
});
