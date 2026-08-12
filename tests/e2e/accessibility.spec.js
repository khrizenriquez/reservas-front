import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const sessionKey = "reservas.web.session:legacy:http://localhost:8000";

async function mockAuthenticatedApi(page, admin = false) {
  const user = { id: 7, username: "teacher@umg.edu.gt", firstName: "Ana", lastName: "López", active: true, role: { id: admin ? 2 : 1, name: admin ? "ADMIN" : "TEACHER" } };
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify({ user: value })), { key: sessionKey, value: user });
  await page.route("http://localhost:8000/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    let json = [];
    if (path === "/api/labs/" || path === "/api/labs/disponibles/") json = [
      { UMG_ID: 1, UMG_Nombre: "Laboratorio de cómputo 1", UMG_Estado: 1 },
      { UMG_ID: 2, UMG_Nombre: "Laboratorio de cómputo 2", UMG_Estado: 1 },
    ];
    else if (path === "/api/usuarios/") json = [{ UMG_ID: 7, UMG_Usuario: user.username, UMG_Nombre: "Ana", UMG_Apellido: "López", UMG_Rol_ID: user.role.id, UMG_Rol_Nombre: admin ? "Admin" : "Docente", UMG_Estado: 1 }];
    await route.fulfill({ status: 200, json });
  });
}

async function expectWcag22AA(page, routeName) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations, `${routeName}: ${JSON.stringify(results.violations, null, 2)}`).toEqual([]);
}

test("public home meets WCAG 2.2 AA automated rules", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectWcag22AA(page, "/");
});

test("login meets WCAG 2.2 AA automated rules", async ({ page }) => {
  await page.goto("/acceso");
  await expect(page.getByRole("heading", { name: "Bienvenido de nuevo" })).toBeVisible();
  await expectWcag22AA(page, "/acceso");
});

for (const route of ["/portal", "/portal/disponibilidad", "/portal/reservas", "/portal/perfil", "/portal/administracion"]) {
  test(`${route} meets WCAG 2.2 AA automated rules`, async ({ page }) => {
    await mockAuthenticatedApi(page, route.endsWith("administracion"));
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expectWcag22AA(page, route);
  });
}
