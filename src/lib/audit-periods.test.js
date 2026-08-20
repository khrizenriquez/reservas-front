import { addDays, auditDateFor, inRange, isIsoDate, latestAuditDate, mondayFor, rangeEntries, validateAuditPeriod, weeklyEntries } from "./audit-periods";

const logs = [
  { createdAt: "2026-08-17T08:00:00Z" },
  { createdAt: "2026-08-19T09:00:00Z" },
  { createdAt: "2026-08-19T10:00:00Z" },
  { createdAt: "invalid" }
];

describe("audit period helpers", () => {
  it("normalizes real audit dates into a Monday through Sunday week", () => {
    expect(isIsoDate("2026-08-19")).toBe(true);
    expect(isIsoDate("2026-02-30")).toBe(false);
    expect(auditDateFor(logs[0])).toBe("2026-08-17");
    expect(latestAuditDate(logs)).toBe("2026-08-19");
    expect(mondayFor("2026-08-19")).toBe("2026-08-17");
    expect(addDays("2026-08-17", 6)).toBe("2026-08-23");
    expect(weeklyEntries(logs, "2026-08-17", ["L", "M", "X", "J", "V", "S", "D"])).toEqual([
      { date: "2026-08-17", label: "L", count: 1 }, { date: "2026-08-18", label: "M", count: 0 }, { date: "2026-08-19", label: "X", count: 2 }, { date: "2026-08-20", label: "J", count: 0 }, { date: "2026-08-21", label: "V", count: 0 }, { date: "2026-08-22", label: "S", count: 0 }, { date: "2026-08-23", label: "D", count: 0 }
    ]);
  });

  it("filters only loaded records and validates period input", () => {
    expect(inRange(logs, "2026-08-18", "2026-08-19")).toHaveLength(2);
    expect(rangeEntries(inRange(logs, "2026-08-18", "2026-08-19"))).toEqual([{ date: "2026-08-19", label: "2026-08-19", count: 2 }]);
    expect(validateAuditPeriod({ mode: "week", week: "bad" })).toBe("logs.invalidWeek");
    expect(validateAuditPeriod({ mode: "range", start: "2026-08-20", end: "2026-08-19" })).toBe("logs.invalidRangeOrder");
    expect(validateAuditPeriod({ mode: "range", start: "2026-08-18", end: "2026-08-19" })).toBeNull();
  });
});
