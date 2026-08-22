import { activeRatio, groupEntries, isActive, reservationLabEntries, reservationStatusEntries, userRoleEntries } from "./operational-metrics";

describe("operational metrics", () => {
  const records = [{ status: 1 }, { status: 0 }, { raw: { UMG_Estado: 1 } }];

  it("calculates active ratios from published status fields", () => {
    expect(isActive(records[0])).toBe(true);
    expect(isActive(records[1])).toBe(false);
    expect(activeRatio(records)).toEqual({ active: 2, total: 3 });
  });

  it("groups values deterministically with an explicit fallback", () => {
    expect(groupEntries([{ value: "B" }, { value: "A" }, { value: "A" }], (item) => item.value, "Unknown")).toEqual([["A", 2], ["B", 1]]);
    expect(reservationStatusEntries([{ status: "Publicada" }, {}], "Sin estado")).toEqual([["Publicada", 1], ["Sin estado", 1]]);
    expect(reservationLabEntries([{ labName: "A1" }, { raw: { UMG_Lab_Nombre: "C2" } }, {}], "Sin laboratorio")).toEqual([["A1", 1], ["C2", 1], ["Sin laboratorio", 1]]);
  });

  it("groups users by the published role before role-id fallback", () => {
    expect(userRoleEntries([{ roleName: "Administrador" }, { roleId: 2 }, {}], "Sin rol")).toEqual([["Administrador", 1], ["Professor", 1], ["Sin rol", 1]]);
  });
});
