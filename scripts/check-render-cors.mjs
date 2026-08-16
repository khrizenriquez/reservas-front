const origin = process.env.CORS_ORIGIN;
const endpoint = "https://umg-api-django.onrender.com/api/auth/login/";

if (!origin) {
  throw new Error("Set CORS_ORIGIN to the exact Netlify preview or production URL before validating CORS.");
}

const response = await fetch(endpoint, {
  method: "OPTIONS",
  headers: {
    Origin: origin,
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "content-type"
  }
});
const allowOrigin = response.headers.get("access-control-allow-origin");
const methods = response.headers.get("access-control-allow-methods") ?? "";
const headers = response.headers.get("access-control-allow-headers") ?? "";

const errors = [
  allowOrigin === origin || allowOrigin === "*" ? null : `Access-Control-Allow-Origin must equal ${origin} or *; received ${allowOrigin ?? "none"}.`,
  methods.toUpperCase().includes("POST") ? null : "Access-Control-Allow-Methods must include POST.",
  headers.toLowerCase().includes("content-type") ? null : "Access-Control-Allow-Headers must include content-type."
].filter(Boolean);

if (errors.length > 0) throw new Error(`Render CORS validation failed:\n${errors.map((item) => `- ${item}`).join("\n")}`);
console.log(`Render CORS validated for ${origin}.`);
