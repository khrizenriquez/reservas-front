import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SessionProvider } from "@/components/SessionProvider";

const api = {
  createReservation: jest.fn(), listReservations: jest.fn(), updateReservation: jest.fn(), cancelReservation: jest.fn(), getReservation: jest.fn()
};
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => api }));

const futureReservation = { id: 3, name: "A1", labName: "A1", labId: 2, userId: 7, date: "2099-08-15", startTime: "08:00", endTime: "09:00", reason: "Clase", status: "Activa" };
const renderPage = () => render(<LanguageProvider><SessionProvider initialSession={{ id: 7 }}><Page /></SessionProvider></LanguageProvider>);
const completeForm = (reason = "Clase") => {
  fireEvent.change(screen.getByLabelText("Laboratorio"), { target: { value: "2" } });
  fireEvent.change(screen.getByLabelText("Fecha"), { target: { value: "2099-08-15" } });
  fireEvent.change(screen.getByLabelText("Inicio"), { target: { value: "08:00" } });
  fireEvent.change(screen.getByLabelText("Fin"), { target: { value: "09:00" } });
  fireEvent.change(screen.getByLabelText("Motivo"), { target: { value: reason } });
};

beforeEach(() => {
  jest.clearAllMocks();
  api.listReservations.mockResolvedValue([]);
  api.createReservation.mockResolvedValue({});
  api.updateReservation.mockResolvedValue({});
  api.cancelReservation.mockResolvedValue({});
  api.getReservation.mockResolvedValue(futureReservation);
  Object.defineProperty(window.navigator, "onLine", { configurable: true, value: true });
});

it("lists the authenticated user's Render reservations and filters them", async () => {
  api.listReservations.mockResolvedValue([futureReservation]);
  renderPage();
  expect(await screen.findByText("A1")).toBeInTheDocument();
  expect(api.listReservations).toHaveBeenCalledWith({ userId: 7 });
  fireEvent.change(screen.getByLabelText("Laboratorio para filtrar"), { target: { value: "2" } });
  fireEvent.change(screen.getByLabelText("Fecha para filtrar"), { target: { value: "2099-08-15" } });
  fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));
  await waitFor(() => expect(api.listReservations).toHaveBeenCalledWith({ userId: 7, labId: "2", fecha: "2099-08-15" }));
});

it("creates a reservation with the Render v1 fields and reloads the list", async () => {
  renderPage();
  await screen.findByText("No hay reservas para los filtros seleccionados.");
  completeForm();
  fireEvent.click(screen.getByRole("button", { name: "Confirmar reserva" }));
  await waitFor(() => expect(api.createReservation).toHaveBeenCalledWith({ userId: 7, labId: 2, date: "2099-08-15", startTime: "08:00", endTime: "09:00", reason: "Clase" }));
  expect(await screen.findByText("Reserva creada.")).toBeInTheDocument();
  expect(api.listReservations.mock.calls.length).toBeGreaterThan(1);
});

it("opens the published detail operation and modifies an owned future reservation", async () => {
  api.listReservations.mockResolvedValue([futureReservation]);
  renderPage();
  fireEvent.click(await screen.findByRole("button", { name: "Ver detalle" }));
  await waitFor(() => expect(api.getReservation).toHaveBeenCalledWith({ id: 3 }));
  expect(await screen.findByText("Detalle de reserva")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Modificar" }));
  expect(await screen.findByRole("heading", { name: "Modificar reserva" })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Motivo"), { target: { value: "Examen" } });
  fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
  await waitFor(() => expect(api.updateReservation).toHaveBeenCalledWith({ id: 3, userId: 7, labId: 2, date: "2099-08-15", startTime: "08:00", endTime: "09:00", reason: "Examen", requesterId: 7 }));
  expect(await screen.findByText("Reserva modificada.")).toBeInTheDocument();
});

it("only exposes mutation actions for an owned future reservation and confirms cancellation", async () => {
  api.listReservations.mockResolvedValue([{ ...futureReservation }, { ...futureReservation, id: 4, userId: 9 }]);
  window.confirm = jest.fn().mockReturnValue(true);
  renderPage();
  await screen.findAllByText("A1");
  expect(screen.getAllByRole("button", { name: "Modificar" })).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
  await waitFor(() => expect(api.cancelReservation).toHaveBeenCalledWith({ id: 3, requesterId: 7 }));
  expect(window.confirm).toHaveBeenCalled();
  expect(await screen.findByText("Reserva cancelada.")).toBeInTheDocument();
});

it("shows a friendly failure and hard-disables mutations while offline", async () => {
  api.createReservation.mockRejectedValue({ code: "api.validation" });
  renderPage();
  await screen.findByText("No hay reservas para los filtros seleccionados.");
  completeForm();
  fireEvent.click(screen.getByRole("button", { name: "Confirmar reserva" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Revisa los datos ingresados.");
  Object.defineProperty(window.navigator, "onLine", { configurable: true, value: false });
  fireEvent(window, new Event("offline"));
  expect(screen.getByRole("button", { name: "Confirmar reserva" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Filtrar" })).toBeDisabled();
});

it("handles list and detail failures without exposing backend data", async () => {
  api.listReservations.mockRejectedValue({ code: "api.server" });
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("El servicio no está disponible.");
  api.listReservations.mockResolvedValue([futureReservation]);
  fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
  expect(await screen.findByRole("button", { name: "Ver detalle" })).toBeInTheDocument();
  api.getReservation.mockRejectedValue({ code: "api.notFound" });
  fireEvent.click(screen.getByRole("button", { name: "Ver detalle" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("No encontramos la información solicitada.");
});

it("does not cancel when the user rejects the confirmation", async () => {
  api.listReservations.mockResolvedValue([futureReservation]);
  window.confirm = jest.fn().mockReturnValue(false);
  renderPage();
  fireEvent.click(await screen.findByRole("button", { name: "Cancelar" }));
  expect(api.cancelReservation).not.toHaveBeenCalled();
});
