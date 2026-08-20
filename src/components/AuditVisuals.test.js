import { render, screen } from "@testing-library/react";
import { AuditMetric, AuditTrend, ModuleBars, WeeklyActivityChart } from "./AuditVisuals";

describe("AuditVisuals", () => {
  it("renders accessible original chart primitives from supplied live data", () => {
    render(<><AuditTrend entries={[["2026-08-18", 2], ["2026-08-19", 6]]} label="Actividad diaria" /><WeeklyActivityChart entries={[{ date: "2026-08-17", label: "L", count: 2 }, { date: "2026-08-18", label: "M", count: 6 }]} label="Semana académica" /><ModuleBars entries={[["Reservas", 6]]} label="Módulos" /><AuditMetric icon={() => null} label="Registros" value="6" /></>);
    expect(screen.getByRole("img", { name: "Actividad diaria" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Semana académica: L 2, M 6/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Módulos" })).toBeInTheDocument();
    expect(screen.getByText("Registros")).toBeInTheDocument();
    expect(screen.getAllByText("6")).toHaveLength(4);
  });
});
