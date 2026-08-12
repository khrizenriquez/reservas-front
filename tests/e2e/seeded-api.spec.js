import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

const passwordFile = process.env.RESERVAS_E2E_DEMO_PASSWORD_FILE;
const demoPassword = process.env.RESERVAS_E2E_DEMO_PASSWORD
  ?? (passwordFile ? readFileSync(passwordFile, "utf8").trim() : "");
const demoUsername = process.env.RESERVAS_E2E_DEMO_USERNAME ?? "docente.demo01@umg.edu.gt";

function futureDate(days = 7) {
  const value = new Date();
  value.setDate(value.getDate() + days);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

test.use({ baseURL: "http://localhost:3000" });
test.skip(!demoPassword, "Set RESERVAS_E2E_DEMO_PASSWORD_FILE to run seeded API tests.");

async function navigateFromPortal(page, linkName) {
  const menuButton = page.getByRole("button", { name: "Abrir navegación", exact: true });
  if (await menuButton.isVisible()) await menuButton.click();
  await page.getByRole("link", { name: linkName, exact: true }).click();
}

test("seeded teacher can review reservations and availability", async ({ page }) => {
  await page.goto("/acceso");
  await page.getByLabel("Correo institucional").fill(demoUsername);
  await page.getByLabel("Contraseña").fill(demoPassword);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  await expect(page).toHaveURL(/\/portal$/);
  await expect(page.getByRole("heading", { name: "Tu agenda académica" })).toBeVisible();

  await navigateFromPortal(page, "Reservas");
  await expect(page.getByRole("heading", { name: "Reservas", exact: true })).toBeVisible();
  await page.getByLabel("Desde", { exact: true }).fill("");
  await expect(page.locator(".reservation-card").first()).toBeVisible();

  await navigateFromPortal(page, "Disponibilidad");
  const availabilityDate = futureDate();
  await page.getByLabel("Fecha", { exact: true }).fill(availabilityDate);
  await page.getByLabel("Desde", { exact: true }).fill("09:00");
  await page.getByLabel("Hasta", { exact: true }).fill("11:00");
  await page.getByRole("button", { name: "Consultar", exact: true }).click();

  await expect(page.getByLabel("Fecha", { exact: true })).toHaveValue(availabilityDate);
  await expect(page.getByLabel("Desde", { exact: true })).toHaveValue("09:00");
  await expect(page.getByLabel("Hasta", { exact: true })).toHaveValue("11:00");
  await expect(page.getByRole("heading", { name: "Laboratorios disponibles" })).toBeVisible();
  await expect(page.locator(".available-lab-grid article")).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
