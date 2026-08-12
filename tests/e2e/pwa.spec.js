import { expect, test } from "@playwright/test";

test.skip(process.env.PWA_E2E !== "1", "Run against the production build with PWA_E2E=1.");

test("production build installs the PWA and serves its cached shell offline", async ({ page, context }) => {
  await page.goto("/");

  const manifest = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(manifest).toBe("/manifest.webmanifest");
  const manifestResponse = await page.request.get(manifest);
  expect(manifestResponse.ok()).toBe(true);
  await expect(manifestResponse.json()).resolves.toMatchObject({
    name: "Reservas de laboratorios UMG",
    display: "standalone",
    start_url: "/",
  });

  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) throw new Error("The service worker is not active.");
  });
  await page.reload();
  await context.setOffline(true);
  await page.goto("/acceso");
  await expect(page.getByRole("heading", { name: "Bienvenido de nuevo" })).toBeVisible();
});
