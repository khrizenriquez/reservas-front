import { expect, test } from "@playwright/test";

const sessionKey = "reservas.web.session:legacy:http://localhost:8000";

function normalizedUser(role = "TEACHER") {
  return { id: 7, username: "teacher@umg.edu.gt", firstName: "Ana", lastName: "López", active: true, role: { id: role === "ADMIN" ? 2 : 1, name: role } };
}

const lab = (id) => ({ UMG_ID: id, UMG_Nombre: `Laboratorio de cómputo ${id}`, UMG_Estado: 1 });

async function mockAuthenticatedApi(page, role = "TEACHER") {
  const user = normalizedUser(role);
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify({ user: value })), { key: sessionKey, value: user });
  let idempotencyKey = null;
  await page.route("http://localhost:8000/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    let status = 200;
    let json = [];
    if (path === "/api/labs/" || path === "/api/labs/disponibles/") json = [lab(1), lab(2), lab(3)];
    else if (path === "/api/reservas/" && request.method() === "POST") {
      idempotencyKey = request.headers()["idempotency-key"];
      status = 201;
      json = { UMG_ID: 42, UMG_User_ID: 7, UMG_Lab_ID: 1, UMG_Fecha_Reserva: "2026-08-10", UMG_Hora_Inicio: "08:00:00", UMG_Hora_Fin: "09:00:00", UMG_Estado: "R", UMG_Motivo: "Taller" };
    } else if (path === "/api/usuarios/") {
      json = [{ UMG_ID: 7, UMG_Usuario: user.username, UMG_Nombre: user.firstName, UMG_Apellido: user.lastName, UMG_Rol_ID: user.role.id, UMG_Rol_Nombre: role === "ADMIN" ? "Admin" : "Docente", UMG_Estado: 1 }];
    }
    await route.fulfill({ status, json });
  });
  return () => idempotencyKey;
}

test("HU-018-S01 presents the public service and access action", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("laboratorio correcto");
  await expect(page.getByRole("heading", { name: /Laboratorio de cómputo/ })).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Ingresar al portal" })).toBeVisible();
});

test("HU-018-S08 keeps login controls labeled and keyboard reachable", async ({ page, browserName }) => {
  await page.goto("/acceso");
  await expect(page.getByRole("heading", { name: "Bienvenido de nuevo" })).toBeVisible();
  const skipLink = page.getByRole("link", { name: "Saltar al contenido principal" });
  if (browserName === "webkit") await skipLink.focus(); else await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Correo institucional")).toBeFocused();
  await expect(page.getByLabel("Contraseña")).toHaveAttribute("autocomplete", "current-password");
});

test("anonymous portal access returns to institutional login", async ({ page }) => {
  await page.goto("/portal");
  await expect(page).toHaveURL(/\/acceso$/);
});

for (const removedRoute of ["/portal/notificaciones", "/portal/reportes"]) {
  test(`${removedRoute} was retired and returns 404 without API calls`, async ({ page }) => {
    let apiCalls = 0;
    await page.route("http://localhost:8000/**", async (route) => {
      apiCalls += 1;
      await route.abort();
    });
    const response = await page.goto(removedRoute);
    expect(response?.status()).toBe(404);
    expect(apiCalls).toBe(0);
  });
}

test("HU-018-S06 exposes administration only to administrators", async ({ page }) => {
  await mockAuthenticatedApi(page, "ADMIN");
  await page.goto("/portal");
  await expect(page.getByRole("heading", { name: "Pulso de la operación" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Reportes" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Administración" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("HU-018-S03 and HU-018-S04 search and reserve once", async ({ page }) => {
  const getIdempotencyKey = await mockAuthenticatedApi(page);
  await page.goto("/portal/disponibilidad");
  await page.getByRole("button", { name: "Consultar" }).click();
  await expect(page.getByRole("heading", { name: "Laboratorio de cómputo 1" })).toBeVisible();
  await page.getByRole("button", { name: "Elegir laboratorio" }).first().click();
  await page.getByLabel("Motivo de la actividad").fill("Taller de programación");
  await page.getByRole("button", { name: "Confirmar reserva" }).click();
  await expect(page.getByText("Reserva #42 creada correctamente.")).toBeVisible();
  expect(getIdempotencyKey()).toMatch(/^[0-9a-f-]{16,}$/);
});
