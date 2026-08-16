const baseUrl = process.env.LOCAL_APP_URL ?? "http://127.0.0.1:3000";
const routes = ["/", "/acceso", "/portal", "/runtime-config.js"];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  if (!response.ok) throw new Error(`Local route ${route} returned HTTP ${response.status}.`);
}

console.log(`Local runtime smoke check passed for ${baseUrl}.`);
