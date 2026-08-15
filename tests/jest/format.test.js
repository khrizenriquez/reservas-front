import { describe, expect, test } from "@jest/globals";

import {
  apiTime,
  dateAfter,
  humanDate,
  shortTime,
  statusLabel,
  toIsoDate,
} from "../../lib/format.js";

describe("format helpers", () => {
  test("toIsoDate returns yyyy-mm-dd", () => {
    const value = toIsoDate(new Date("2026-08-15T12:30:00Z"));
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("dateAfter moves date forward", () => {
    expect(dateAfter(2, new Date("2026-08-15T00:00:00Z"))).toBe("2026-08-17");
  });

  test("apiTime normalizes HH:MM", () => {
    expect(apiTime("08:30")).toBe("08:30:00");
    expect(apiTime("08:30:00")).toBe("08:30:00");
  });

  test("shortTime and humanDate fallback", () => {
    expect(shortTime("19:05:00")).toBe("19:05");
    expect(shortTime(undefined)).toBe("—");
    expect(humanDate(undefined)).toBe("—");
  });

  test("statusLabel maps known states", () => {
    expect(statusLabel("ACTIVE")).toBe("Activa");
    expect(statusLabel("UNKNOWN")).toBe("UNKNOWN");
  });
});
