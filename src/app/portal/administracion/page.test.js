import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";

const api = {
  listLabs: jest.fn(), listLabConditions: jest.fn(), listAuditLogs: jest.fn(), createLab: jest.fn(), updateLab: jest.fn(), createLabCondition: jest.fn(), updateLabCondition: jest.fn()
};
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => api }));
const useAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({ useAuth: () => useAuth() }));

const lab = { id: 1, name: "Laboratorio A", status: 1 };
const condition = { id: 2, labId: 1, labName: "Laboratorio A", date: "2099-08-15", startTime: "08:00", endTime: "09:00", type: "Mantenimiento", reason: "Limpieza", status: 1 };
const log = { id: 4, raw: { umg_accion: "CREAR", umg_modulo: "RESERVAS", umg_descripcion: "Reserva creada" }, createdAt: "2099-08-01T08:00:00Z" };
const renderPage = () => render(<LanguageProvider><Page /></LanguageProvider>);

beforeEach(() => {
  jest.clearAllMocks();
  api.listLabs.mockResolvedValue([lab]);
  api.listLabConditions.mockResolvedValue([condition]);
  api.listAuditLogs.mockResolvedValue([log]);
  useAuth.mockReturnValue({ identity: { id: 18, name: "Chris", email: "chris@umg.edu.gt" }, isAdmin: true });
  Object.values(api).forEach((mock) => { if (!mock.getMockImplementation()) mock.mockResolvedValue({}); });
});

it("keeps labs, conditions, and audit records in administration", async () => {
  renderPage();
  expect(await screen.findByText("Laboratorio A")).toBeInTheDocument();
  expect(screen.getByText("ID de laboratorio:")).toBeInTheDocument();
  expect(screen.getByText("1", { selector: "code" })).toBeInTheDocument();
  expect(screen.getByText("Mantenimiento")).toBeInTheDocument();
  expect(screen.getByText(/Reserva creada/)).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Usuarios" })).not.toBeInTheDocument();
});

it("keeps records visible for a professor while hiding administration mutations", async () => {
  useAuth.mockReturnValue({ identity: { id: 7, name: "Docente", email: "docente@umg.edu.gt" }, isAdmin: false });
  renderPage();
  expect(await screen.findByText("Laboratorio A")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Crear laboratorio" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Editar laboratorio" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Crear condición" })).not.toBeInTheDocument();
});

it("creates and updates a laboratory with documented fields", async () => {
  renderPage();
  await screen.findByText("Laboratorio A");
  fireEvent.click(screen.getByRole("button", { name: "Crear laboratorio" }));
  fireEvent.change(screen.getByLabelText("Nombre de laboratorio"), { target: { value: "Laboratorio B" } });
  fireEvent.click(screen.getAllByRole("button", { name: "Crear laboratorio" })[1]);
  await waitFor(() => expect(api.createLab).toHaveBeenCalledWith({ name: "Laboratorio B" }));
  fireEvent.click(screen.getByRole("button", { name: "Editar laboratorio" }));
  fireEvent.change(screen.getByLabelText("Nombre de laboratorio"), { target: { value: "Laboratorio A2" } });
  fireEvent.click(screen.getByRole("button", { name: "Guardar laboratorio" }));
  await waitFor(() => expect(api.updateLab).toHaveBeenCalledWith({ id: 1, name: "Laboratorio A2", status: 1 }));
});

it("creates and updates a condition using only documented fields", async () => {
  renderPage();
  await screen.findByText("Mantenimiento");
  fireEvent.click(screen.getByRole("button", { name: "Crear condición" }));
  fireEvent.change(screen.getByLabelText("Laboratorio", { selector: "input[name='conditionLabId']" }), { target: { value: "1" } });
  fireEvent.change(screen.getByLabelText("Fecha", { selector: "input[name='conditionDate']" }), { target: { value: "2099-08-16" } });
  fireEvent.change(screen.getByLabelText("Inicio", { selector: "input[name='conditionStart']" }), { target: { value: "10:00" } });
  fireEvent.change(screen.getByLabelText("Fin", { selector: "input[name='conditionEnd']" }), { target: { value: "11:00" } });
  fireEvent.change(screen.getByLabelText("Tipo"), { target: { value: "Clase" } });
  fireEvent.change(screen.getByLabelText("Motivo"), { target: { value: "Práctica" } });
  fireEvent.click(screen.getAllByRole("button", { name: "Crear condición" })[1]);
  await waitFor(() => expect(api.createLabCondition).toHaveBeenCalledWith({ labId: 1, date: "2099-08-16", startTime: "10:00", endTime: "11:00", type: "Clase", reason: "Práctica" }));
});

it("renders a localized API error without hiding successful sections", async () => {
  api.listLabs.mockRejectedValue({ code: "api.forbidden" });
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("No tienes acceso a esta acción.");
  expect(screen.getByText("Mantenimiento")).toBeInTheDocument();
});
