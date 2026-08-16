import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";

const getLabAvailability = jest.fn();
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => ({ getLabAvailability }) }));

const search = async () => {
  fireEvent.change(screen.getByLabelText("Fecha"), { target: { value: "2099-08-15" } });
  fireEvent.change(screen.getByLabelText("Hora de inicio"), { target: { value: "08:00" } });
  fireEvent.change(screen.getByLabelText("Hora de fin"), { target: { value: "09:00" } });
  fireEvent.click(screen.getByRole("button", { name: "Buscar disponibilidad" }));
};

beforeEach(() => jest.clearAllMocks());

it("queries Render with date and interval and transfers the selected lab to reservations", async () => {
  getLabAvailability.mockResolvedValue([{ id: 1, name: "A1" }]);
  render(<LanguageProvider><Page /></LanguageProvider>);
  await search();
  await waitFor(() => expect(getLabAvailability).toHaveBeenCalledWith({ fecha: "2099-08-15", hora_inicio: "08:00", hora_fin: "09:00" }));
  expect(screen.getByLabelText("Laboratorios disponibles")).toHaveTextContent("A1");
  expect(screen.getByRole("link", { name: "Reservar este laboratorio" })).toHaveAttribute("href", "/portal/reservas?labId=1&date=2099-08-15&startTime=08%3A00&endTime=09%3A00");
});

it("shows an empty state", async () => {
  getLabAvailability.mockResolvedValue([]);
  render(<LanguageProvider><Page /></LanguageProvider>);
  await search();
  expect(await screen.findByText("No hay laboratorios disponibles para ese horario.")).toBeInTheDocument();
});

it("shows a localized network error", async () => {
  getLabAvailability.mockRejectedValue(new Error("offline"));
  render(<LanguageProvider><Page /></LanguageProvider>);
  await search();
  expect(await screen.findByRole("alert")).toHaveTextContent("Revisa tu conexión");
});
