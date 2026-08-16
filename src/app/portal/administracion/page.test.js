import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SessionProvider } from "@/components/SessionProvider";

const api = {
  listLabs: jest.fn(), listLabConditions: jest.fn(), listUsers: jest.fn(), listAuditLogs: jest.fn(), createLab: jest.fn(), updateLab: jest.fn(), createLabCondition: jest.fn(), updateLabCondition: jest.fn(), createUser: jest.fn(), deactivateUser: jest.fn(), resetUserPassword: jest.fn()
};
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => api }));

const lab = { id: 1, name: "Laboratorio A", status: 1 };
const condition = { id: 2, labId: 1, labName: "Laboratorio A", date: "2099-08-15", startTime: "08:00", endTime: "09:00", type: "Mantenimiento", reason: "Limpieza", status: 1 };
const user = { id: 3, name: "Ana", email: "ana@umg.edu.gt", roleName: "Docente", status: 1 };
const log = { id: 4, raw: { umg_accion: "CREAR", umg_modulo: "RESERVAS", umg_descripcion: "Reserva creada" }, createdAt: "2099-08-01T08:00:00Z" };
const renderPage = (session = { roleName: "Administrador" }) => render(<LanguageProvider><SessionProvider initialSession={session}><Page /></SessionProvider></LanguageProvider>);

beforeEach(() => {
  jest.clearAllMocks();
  api.listLabs.mockResolvedValue([lab]);
  api.listLabConditions.mockResolvedValue([condition]);
  api.listUsers.mockResolvedValue([user]);
  api.listAuditLogs.mockResolvedValue([log]);
  Object.values(api).filter((mock) => mock.mock).forEach((mock) => {
    if (!mock.getMockImplementation()) mock.mockResolvedValue({});
  });
});

it("keeps administration hidden from a non-administrator", () => {
  renderPage({ roleName: "Docente" });
  expect(screen.getByRole("alert")).toHaveTextContent("No tienes acceso a esta acción.");
  expect(api.listLabs).not.toHaveBeenCalled();
});

it("lists Render labs, conditions, users, and audit records", async () => {
  renderPage();
  expect(await screen.findByText("Laboratorio A")).toBeInTheDocument();
  expect(screen.getByText("Mantenimiento")).toBeInTheDocument();
  expect(screen.getByText("ana@umg.edu.gt · Docente")).toBeInTheDocument();
  expect(screen.getByText(/Reserva creada/)).toBeInTheDocument();
  expect(api.listLabs).toHaveBeenCalledTimes(1);
});

it("creates and updates a laboratory with published fields", async () => {
  api.createLab.mockResolvedValue({});
  api.updateLab.mockResolvedValue({});
  renderPage();
  await screen.findByText("Laboratorio A");
  fireEvent.change(screen.getByLabelText("Nombre de laboratorio"), { target: { value: "Laboratorio B" } });
  fireEvent.click(screen.getByRole("button", { name: "Crear laboratorio" }));
  await waitFor(() => expect(api.createLab).toHaveBeenCalledWith({ name: "Laboratorio B" }));
  fireEvent.click(screen.getByRole("button", { name: "Editar laboratorio" }));
  fireEvent.change(screen.getByLabelText("Nombre de laboratorio"), { target: { value: "Laboratorio A2" } });
  fireEvent.click(screen.getByRole("button", { name: "Guardar laboratorio" }));
  await waitFor(() => expect(api.updateLab).toHaveBeenCalledWith({ id: 1, name: "Laboratorio A2", status: 1 }));
});

it("creates and updates a condition using only documented fields", async () => {
  api.createLabCondition.mockResolvedValue({});
  api.updateLabCondition.mockResolvedValue({});
  renderPage();
  await screen.findByText("Mantenimiento");
  fireEvent.change(screen.getByLabelText("Laboratorio", { selector: "input[name='conditionLabId']" }), { target: { value: "1" } });
  fireEvent.change(screen.getByLabelText("Fecha", { selector: "input[name='conditionDate']" }), { target: { value: "2099-08-16" } });
  fireEvent.change(screen.getByLabelText("Inicio", { selector: "input[name='conditionStart']" }), { target: { value: "10:00" } });
  fireEvent.change(screen.getByLabelText("Fin", { selector: "input[name='conditionEnd']" }), { target: { value: "11:00" } });
  fireEvent.change(screen.getByLabelText("Tipo"), { target: { value: "Clase" } });
  fireEvent.change(screen.getByLabelText("Motivo"), { target: { value: "Práctica" } });
  fireEvent.click(screen.getByRole("button", { name: "Crear condición" }));
  await waitFor(() => expect(api.createLabCondition).toHaveBeenCalledWith({ labId: 1, date: "2099-08-16", startTime: "10:00", endTime: "11:00", type: "Clase", reason: "Práctica" }));
  fireEvent.click(screen.getByRole("button", { name: "Editar condición" }));
  fireEvent.change(screen.getByLabelText("Motivo"), { target: { value: "Actualizada" } });
  fireEvent.click(screen.getByRole("button", { name: "Guardar condición" }));
  await waitFor(() => expect(api.updateLabCondition).toHaveBeenCalledWith({ id: 2, labId: 1, date: "2099-08-15", startTime: "08:00", endTime: "09:00", type: "Mantenimiento", reason: "Actualizada", status: 1 }));
});

it("creates, resets, and inactivates a user through published operations", async () => {
  api.createUser.mockResolvedValue({});
  api.resetUserPassword.mockResolvedValue({});
  api.deactivateUser.mockResolvedValue({});
  window.confirm = jest.fn().mockReturnValue(true);
  renderPage();
  await screen.findByText("ana@umg.edu.gt · Docente");
  fireEvent.change(screen.getByLabelText("Correo institucional"), { target: { value: "nuevo@umg.edu.gt" } });
  fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Cambiar123" } });
  fireEvent.change(screen.getByLabelText("Nombres"), { target: { value: "Nuevo" } });
  fireEvent.change(screen.getByLabelText("Apellidos"), { target: { value: "Usuario" } });
  fireEvent.change(screen.getByLabelText("ID de rol"), { target: { value: "2" } });
  fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));
  await waitFor(() => expect(api.createUser).toHaveBeenCalledWith({ username: "nuevo@umg.edu.gt", password: "Cambiar123", name: "Nuevo", lastName: "Usuario", roleId: 2 }));
  fireEvent.click(screen.getByRole("button", { name: "Restablecer contraseña" }));
  fireEvent.change(screen.getByLabelText("Contraseña temporal"), { target: { value: "Temporal123" } });
  fireEvent.click(screen.getByRole("button", { name: "Guardar contraseña temporal" }));
  await waitFor(() => expect(api.resetUserPassword).toHaveBeenCalledWith({ id: 3, temporaryPassword: "Temporal123" }));
  fireEvent.click(screen.getByRole("button", { name: "Inactivar usuario" }));
  await waitFor(() => expect(api.deactivateUser).toHaveBeenCalledWith({ id: 3 }));
});

it("renders a localized API error without hiding successful sections", async () => {
  api.listUsers.mockRejectedValue({ code: "api.forbidden" });
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("No tienes acceso a esta acción.");
  expect(screen.getByText("Laboratorio A")).toBeInTheDocument();
});
