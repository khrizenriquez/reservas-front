import { readFile } from "node:fs/promises";

const config = await readFile("netlify.toml", "utf8");
const requiredSnippets = [
  'command = "npm run contract && npm run check && npm run release:check && npm run build"',
  'publish = ".next"',
  'NODE_VERSION = "22"',
  'NEXT_PUBLIC_API_PROFILE = "render-v1"',
  "Content-Security-Policy",
  "connect-src 'self' https://umg-api-django.onrender.com",
  "Permissions-Policy",
  "Referrer-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  'for = "/sw.js"',
  "Cache-Control = \"no-cache, no-store, must-revalidate\""
];

const missing = requiredSnippets.filter((snippet) => !config.includes(snippet));
if (missing.length > 0) {
  throw new Error(`Netlify release configuration is missing:\n${missing.map((item) => `- ${item}`).join("\n")}`);
}

if (config.includes("NEXT_PUBLIC_API_BASE_URL =")) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL must be managed in Netlify, not committed to netlify.toml.");
}

console.log("Netlify release configuration verified.");
