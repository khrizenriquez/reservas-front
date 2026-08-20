import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import Page from "./page";
import { LanguageProvider } from "@/components/LanguageProvider";

const api = {
  listLabs: jest.fn(), listLabConditions: jest.fn(), listUsers: jest.fn(), listAuditLogs: jest.fn(), createLab: jest.fn(), updateLab: jest.fn(), createLabCondition: jest.fn(), updateLabCondition: jest.fn(), createUser: jest.fn(), deactivateUser: jest.fn(), resetUserPassword: jest.fn()
};
jest.mock("@/services/render-api", () => ({ createRenderApiClient: () => api }));
const useAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({ useAuth: () => useAuth() }));

const lab = { id: 1, name: "Laboratorio A", status: 1 };
const condition = { id: 2, labId: 1, labName: "Laboratorio A", date: "2099-08-15", startTime: "08:00", endTime: "09:00", type: "Mantenimiento", reason: "Limpieza", status: 1 };
const user = { id: 3, name: "Ana", email: "ana@umg.edu.gt", roleName: "Docente", status: 1 };
const log = { id: 4, raw: { umg_accion: "CREAR", umg_modulo: "RESERVAS", umg_descripcion: "Reserva creada" }, createdAt: "2099-08-01T08:00:00Z" };
const renderPage = () => render(<LanguageProvider><Page /></LanguageProvider>);

beforeEach(() => {
  jest.clearAllMocks();
  api.listLabs.mockResolvedValue([lab]);
  api.listLabConditions.mockResolvedValue([condition]);
  api.listUsers.mockResolvedValue([user]);
  api.listAuditLogs.mockResolvedValue([log]);
  useAuth.mockReturnValue({ identity: { id: 18, name: "Chris", email: "chris@umg.edu.gt" }, isAdmin: true });
  Object.values(api).filter((mock) => mock.mock).forEach((mock) => {
    if (!mock.getMockImplementation()) mock.mockResolvedValue({});
  });
});

it("loads administration for an administrator", async () => {
  renderPage();
  expect(await screen.findByText("Laboratorio A")).toBeInTheDocument();
  expect(api.listLabs).toHaveBeenCalledTimes(1);
});

it("keeps records visible for a professor while hiding administrative mutations", async () => {
  useAuth.mockReturnValue({ identity: { id: 7, name: "Docente", email: "docente@umg.edu.gt" }, isAdmin: false });
  renderPage();
  expect(await screen.findByText("Laboratorio A")).toBeInTheDocument();
  expect(screen.getByText("ana@umg.edu.gt · Docente")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Crear laboratorio" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Editar laboratorio" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Crear condición" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Crear usuario" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Restablecer contraseña" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Inactivar usuario" })).not.toBeInTheDocument();
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
  api.createLabCondition.mockResolvedValue({});
  api.updateLabCondition.mockResolvedValue({});
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
  fireEvent.click(screen.getByRole("button", { name: "Editar condición" }));
  fireEvent.change(screen.getByLabelText("Motivo"), { target: { value: "Actualizada" } });
  fireEvent.click(screen.getByRole("button", { name: "Guardar condición" }));
  await waitFor(() => expect(api.updateLabCondition).toHaveBeenCalledWith({ id: 2, labId: 1, date: "2099-08-15", startTime: "08:00", endTime: "09:00", type: "Mantenimiento", reason: "Actualizada", status: 1 }));
});

it("creates, resets, and inactivates a user through published operations", async () => {
  api.createUser.mockResolvedValue({});
  api.resetUserPassword.mockResolvedValue({});
  api.deactivateUser.mockResolvedValue({});
  renderPage();
  await screen.findByText("ana@umg.edu.gt · Docente");
  fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));
  fireEvent.change(screen.getByLabelText("Correo institucional"), { target: { value: "nuevo@umg.edu.gt" } });
  fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Cambiar123" } });
  fireEvent.change(screen.getByLabelText("Nombres"), { target: { value: "Nuevo" } });
  fireEvent.change(screen.getByLabelText("Apellidos"), { target: { value: "Usuario" } });
  fireEvent.change(screen.getByLabelText("ID de rol"), { target: { value: "2" } });
  fireEvent.click(screen.getAllByRole("button", { name: "Crear usuario" })[1]);
  await waitFor(() => expect(api.createUser).toHaveBeenCalledWith({ username: "nuevo@umg.edu.gt", password: "Cambiar123", name: "Nuevo", lastName: "Usuario", roleId: 2 }));
  fireEvent.click(screen.getByRole("button", { name: "Restablecer contraseña" }));
  fireEvent.change(screen.getByLabelText("Contraseña temporal"), { target: { value: "Temporal123" } });
  fireEvent.click(screen.getByRole("button", { name: "Guardar contraseña temporal" }));
  await waitFor(() => expect(api.resetUserPassword).toHaveBeenCalledWith({ id: 3, temporaryPassword: "Temporal123" }));
  fireEvent.click(screen.getByRole("button", { name: "Inactivar usuario" }));
  fireEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Inactivar usuario", exact: true }));
  await waitFor(() => expect(api.deactivateUser).toHaveBeenCalledWith({ id: 3 }));
});

it("renders a localized API error without hiding successful sections", async () => {
  api.listUsers.mockRejectedValue({ code: "api.forbidden" });
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("No tienes acceso a esta acción.");
  expect(screen.getByText("Laboratorio A")).toBeInTheDocument();
});
